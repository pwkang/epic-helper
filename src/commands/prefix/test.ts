import {
  rpgPetAdventure,
  rpgPetAdventureChecker,
} from '../../lib/epic_rpg/commands/pets/petAdventure.lib';
import {PREFIX_COMMAND_TYPE} from '../../constants/bot';
import {djsMessageHelper} from '../../lib/discord.js/message';

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

    // console.log(
    //   extractReturnedPetsId({
    //     message: msg,
    //     author: message.author,
    //   })
    // );

    // console.log(
    //   isSuccessfullyClaimedPet({
    //     embed: msg.embeds[0],
    //     author: message.author,
    //   })
    // );
    // rpgPetClaim({
    //   author: message.author,
    //   embed: msg.embeds[0],
    //   client,
    // });
  },
};
