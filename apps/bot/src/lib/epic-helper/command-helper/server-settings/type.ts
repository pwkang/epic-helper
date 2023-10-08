import type {Guild} from 'discord.js';
import type {IServer} from '@epic-helper/models';

export interface IServerSettings {
  serverAccount: IServer | null;
  guild: Guild;
}
