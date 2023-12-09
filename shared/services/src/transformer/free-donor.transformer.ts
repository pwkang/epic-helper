import type {IFreeDonor} from '@epic-helper/models';

export const toFreeDonor = (donor: IFreeDonor): IFreeDonor => {
  return {
    discordId: donor.discordId,
    expiresAt: donor.expiresAt ? new Date(donor.expiresAt) : new Date(),
    token: donor.token,
  };
};

export const toFreeDonors = (donors: any[]): IFreeDonor[] => {
  return donors.map(toFreeDonor);
};
