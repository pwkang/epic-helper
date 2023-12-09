import {rpgOpenLootbox} from '../../../../lib/epic-rpg/commands/other/open';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgOpenLootbox',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['open'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgOpenLootbox({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
