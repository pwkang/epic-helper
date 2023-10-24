import {mongoClient} from '@epic-helper/services';
import {freeDonorSchema} from '@epic-helper/models';
import type {QueryOptions} from 'mongoose';
import {redisFreeDonor} from '../redis/free-donor.redis';
import type {Promise} from 'mongoose';

const dbFreeDonor = mongoClient.model('freeDonors', freeDonorSchema);

interface ICreateFreeDonors {
  usersId: string[];
  expiresAt: Date;
  token: number;
}

const createFreeDonors = async ({
  usersId,
  expiresAt,
  token,
}: ICreateFreeDonors): Promise<void> => {
  const bulk = dbFreeDonor.collection.initializeUnorderedBulkOp();
  for (const userId of usersId) {
    bulk
      .find({
        discordId: userId,
      })
      .upsert()
      .updateOne({
        $set: {
          expiresAt,
          token,
        },
      });
  }
  await bulk.execute();
};

interface IGetFreeDonors {
  page?: number;
  limit?: number;
}

const getFreeDonors = async ({page, limit}: IGetFreeDonors) => {
  const options: QueryOptions = {
    sort: {
      expiresAt: -1,
    },
  };
  if (page !== undefined && limit !== undefined) {
    options.skip = page * limit;
    options.limit = limit;
  }
  const data = await dbFreeDonor.find({}, null, options);
  const total = await dbFreeDonor.countDocuments();
  return {data, total};
};

interface IFindFreeDonor {
  discordUserId: string;
}

const findFreeDonor = async ({discordUserId}: IFindFreeDonor) => {
  const cachedData = await redisFreeDonor.findFreeDonor(discordUserId);
  if (cachedData) return cachedData;

  const freeDonor = await dbFreeDonor.findOne({
    discordId: discordUserId,
  });

  if (freeDonor) await redisFreeDonor.setFreeDonor(discordUserId, freeDonor);

  return freeDonor ?? null;
};

interface IDeleteFreeDonors {
  usersId: string[];
}

const deleteFreeDonors = async ({usersId}: IDeleteFreeDonors) => {
  await dbFreeDonor.bulkWrite(
    usersId.map((userId) => ({
      deleteOne: {
        filter: {
          discordId: userId,
        },
      },
    })),
  );
  await redisFreeDonor.delFreeDonors(usersId);
};

const freeDonorService = {
  createFreeDonors,
  getFreeDonors,
  findFreeDonor,
  deleteFreeDonors,
};

export default freeDonorService;
