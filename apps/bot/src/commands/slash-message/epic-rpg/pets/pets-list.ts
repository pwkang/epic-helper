import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgPetList} from '../../../../lib/epic-rpg/commands/pets/pet-list';

export default <SlashMessage>{
  name: 'petsList',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets list'],
  execute: async (client, message, author) => {
    await rpgPetList({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
