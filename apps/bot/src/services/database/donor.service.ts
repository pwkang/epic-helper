import {mongoClient} from '@epic-helper/services';
import {donorSchema, IDonor} from '@epic-helper/models';
import {DONOR_TIER} from '@epic-helper/constants';

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
          'patreon.fullName': donor.patreon.fullName?.trim().replace(/\s+/g, ' '),
          'patreon.userId': donor.patreon.userId,
          'patreon.memberId': donor.patreon.memberId,
          tier: donor.tier,
          expiresAt: donor.expiresAt,
        },
      });
  }
  await bulk.execute();
};

const donorService = {
  registerDonors,
};

export default donorService;
