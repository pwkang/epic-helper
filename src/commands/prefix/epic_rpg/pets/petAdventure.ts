import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {
  rpgPetAdventure,
  rpgPetAdventureChecker,
} from '../../../../lib/epic_rpg/commands/pets/petAdventure.lib';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

const args1 = ['pets', 'pet'];
const args2 = ['adventure', 'adv'];
const args3 = ['learn', 'drill', 'find'];

function generateAllPossibleCommands(args1: string[], args2: string[], args3: string[]) {
  return args1.flatMap((arg1) =>
    args2.flatMap((arg2) => args3.map((arg3) => `${arg1} ${arg2} ${arg3}`))
  );
}

export default <PrefixCommand>{
  name: 'petAdventure',
  commands: generateAllPossibleCommands(args1, args2, args3),
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message, args) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', async (content, collected) => {
      if (
        rpgPetAdventureChecker.isFailToSendPetsToAdventure({
          message: collected,
          author: message.author,
        })
      ) {
        event.stop();
      }
      if (
        rpgPetAdventureChecker.isSuccessfullySentPetsToAdventure({
          message: collected,
          author: message.author,
        })
      ) {
        event.stop();
        const amountOfPetSent = rpgPetAdventureChecker.amountOfPetsSentToAdventure({
          message: collected,
          author: message.author,
        });
        const options = await rpgPetAdventure({
          author: message.author,
          selectedPets: args.slice(3),
          amountOfPetSent,
          message: collected,
        });
        djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options,
        });
      }
    });
  },
};
