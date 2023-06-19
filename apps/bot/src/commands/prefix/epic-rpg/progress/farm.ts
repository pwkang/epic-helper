import {rpgFarm} from '../../../../lib/epic-rpg/commands/progress/farm';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgFarm',
  commands: ['farm'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgFarm({
      author: message.author,
      client,
      isSlashCommand: false,
      message,
    });
  },
};