import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {
  extractCancelledPetAmount,
  isFailToCancelPet,
  isPetSuccessfullyCancelled,
  rpgPetAdvCancel,
} from '../../../../lib/epic_rpg/commands/pets/petCancel.lib';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';

const args1 = ['pets', 'pet'];
const args2 = ['adventure', 'adv'];
const args3 = ['cancel'];

function generateAllPossibleCommands(args1: string[], args2: string[], args3: string[]) {
  return args1.flatMap((arg1) =>
    args2.flatMap((arg2) => args3.map((arg3) => `${arg1} ${arg2} ${arg3}`))
  );
}

export default <PrefixCommand>{
  name: 'petCancel',
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
        isPetSuccessfullyCancelled({
          message: collected,
          author: message.author,
        })
      ) {
        const cancelledPetAmount = extractCancelledPetAmount({
          message: collected,
        });
        const options = await rpgPetAdvCancel({
          message: collected,
          author: message.author,
          selectedPets: args.slice(3),
          amountOfPetCancelled: cancelledPetAmount,
        });
        sendMessage({
          client,
          channelId: message.channel.id,
          options,
        });
        event.stop();
      }
      if (
        isFailToCancelPet({
          message: collected,
          author: message.author,
        })
      ) {
        event.stop();
      }
    });
  },
};
