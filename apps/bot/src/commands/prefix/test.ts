import {
  rpgPetAdventure,
  rpgPetAdventureChecker,
} from '../../lib/epic-rpg/commands/pets/pet-adventure';
import {djsMessageHelper} from '../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const args = message.content.split(' ');
    if (!args[2]) return;
    const msg = await message.channel.messages.fetch(args[2]);
    if (!msg) return;
    //
    const options = await rpgPetAdventure({
      message: msg,
      author: message.author,
      selectedPets: ['a', 'b', 'c', 'd', 'e'],
      amountOfPetSent: rpgPetAdventureChecker.amountOfPetsSentToAdventure({
        message: msg,
        author: message.author,
      }),
    });
    djsMessageHelper.reply({
      message,
      options,
      client,
    });
  },
};
