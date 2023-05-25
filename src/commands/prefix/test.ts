import {COMMAND_TYPE} from '../../constants/bot';
import {
  amountOfPetsSentToAdventure,
  rpgPetAdventure,
} from '../../lib/epic_rpg/commands/pets/petAdventure.lib';
import {isSuccessfullyClaimedPet, rpgPetClaim} from '../../lib/epic_rpg/commands/pets/petClaim';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const args = message.content.split(' ');
    if (!args[2]) return;
    const msg = await message.channel.messages.fetch(args[2]);
    if (!msg) return;

    console.log(
      isSuccessfullyClaimedPet({
        embed: msg.embeds[0],
        author: message.author,
      })
    );
    rpgPetClaim({
      author: message.author,
      embed: msg.embeds[0],
      client,
    });
  },
};
