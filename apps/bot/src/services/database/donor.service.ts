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
  tier: ValuesOf<typeof DONOR_TIER>;
  expiresAt: Date;
}

const registerDonors = async (donors: IRegisterDonor[]): Promise<void> => {
  await dbDonor.insertMany(donors);
};

const donorService = {
  registerDonors,
};

export default donorService;
