import {Guild} from 'discord.js';
import {IServer} from '@epic-helper/models';

export interface IServerSettingsEmbed {
  serverAccount: IServer;
  guild: Guild;
}
