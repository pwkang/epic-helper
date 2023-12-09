import {mongoClient} from '../clients/mongoose.service';
import type {IDonor} from '@epic-helper/models';
import {donorSchema} from '@epic-helper/models';
import type {DONOR_TIER} from '@epic-helper/constants';
import type {FilterQuery, Promise, QueryOptions} from 'mongoose';
import {redisDonor} from '../redis/donor.redis';
import {redisUserBoostedServers} from '../redis/user-boosted-servers.redis';
import type {ValuesOf} from '@epic-helper/types';

const dbDonor = mongoClient.model<IDonor>('donors', donorSchema);

interface IRegisterDonor {
  patreon: {
    email?: string;
    fullName?: string;
    userId: string;
    memberId: string;
  };
  discord: {
    userId?: string;
    username?: string;
  };
  tier?: ValuesOf<typeof DONOR_TIER>;
  expiresAt?: Date;
  active: boolean;
}

const registerDonors = async (donors: IRegisterDonor[]): Promise<void> => {
  const bulk = dbDonor.collection.initializeUnorderedBulkOp();
  for (const donor of donors) {
    bulk
      .find({
        'patreon.userId': donor.patreon.userId,
      })
      .upsert()
      .updateOne({
        $set: {
          'discord.userId': donor.discord.userId,
          'discord.username': donor.discord.username,
          'patreon.email': donor.patreon.email,
          'patreon.fullName': donor.patreon.fullName
            ?.trim()
            .replace(/\s+/g, ' '),
          'patreon.userId': donor.patreon.userId,
          'patreon.memberId': donor.patreon.memberId,
          tier: donor.tier,
          expiresAt: donor.expiresAt,
          active: donor.active,
        },
      });
  }
  await bulk.execute();
  const donorsDiscordId = donors
    .map((donor) => donor.discord.userId)
    .filter(Boolean) as string[];
  await redisDonor.delDonors(donorsDiscordId);
  await redisUserBoostedServers.delMany(donorsDiscordId);
};

interface IGetDonors {
  tier?: ValuesOf<typeof DONOR_TIER>;
  page?: number;
  limit?: number;
}

const getDonors = async ({tier, page, limit}: IGetDonors) => {
  const query: FilterQuery<IDonor> = {};
  if (tier) query.tier = tier;
  const options: QueryOptions<IDonor> = {
    sort: {
      expiresAt: -1,
    },
  };
  if (page !== undefined && limit) {
    options.skip = page * limit;
    options.limit = limit;
  }
  const data = await dbDonor.find(query, null, options);
  const total = await dbDonor.countDocuments(query);
  return {
    data,
    total,
  };
};

interface IFindDonor {
  discordUserId: string;
}

const findDonor = async ({discordUserId}: IFindDonor) => {
  const cachedDonor = await redisDonor.findDonor(discordUserId);
  if (cachedDonor) return cachedDonor;

  const query: FilterQuery<IDonor> = {};
  if (discordUserId) query['discord.userId'] = discordUserId;
  const donor = await dbDonor.findOne(query);

  if (donor) {
    await redisDonor.setDonor(discordUserId, donor);
  }

  return donor ?? null;
};

export const donorService = {
  registerDonors,
  getDonors,
  findDonor,
};

