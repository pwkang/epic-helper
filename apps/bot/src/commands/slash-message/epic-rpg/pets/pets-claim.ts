import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgPetClaim} from '../../../../lib/epic-rpg/commands/pets/pet-claim';

export default <SlashMessage>{
  name: 'petClaim',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets claim'],
  execute: async (client, message, author) => {
    await rpgPetClaim({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
