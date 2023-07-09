import {Guild} from 'discord.js';
import {IServer} from '@epic-helper/models';

export interface IServerSettings {
  serverAccount: IServer | null;
  guild: Guild;
}
