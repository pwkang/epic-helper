import {rpgAdventure} from '../../../../lib/epic-rpg/commands/progress/adventure';
import {SLASH_MESSAGE_BOT_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgAdventure',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['adventure'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    rpgAdventure({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
