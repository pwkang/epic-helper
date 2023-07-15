import {IBoostedGuild} from '../donor/donor.type';

export interface IFreeDonor {
  discordId: string;
  expiresAt: Date;
  token: number;
  boostedGuilds: IBoostedGuild[];
}
