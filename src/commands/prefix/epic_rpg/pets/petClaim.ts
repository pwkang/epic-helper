import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import {
  isNoPetsToClaim,
  isSuccessfullyClaimedPet,
  rpgPetClaim,
} from '../../../../lib/epic_rpg/commands/pets/petClaim';

export default <PrefixCommand>{
  name: 'petClaim',
  commands: ['pet claim', 'pets claim'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author: message.author,
    });
    if (!event) return;
    event.on('content', (content, collected) => {
      if (
        isNoPetsToClaim({
          message: collected,
          author: message.author,
        })
      ) {
        event.stop();
      }
    });
    event.on('embed', async (embed) => {
      if (
        isSuccessfullyClaimedPet({
          embed,
          author: message.author,
        })
      ) {
        event.stop();
        await rpgPetClaim({
          client,
          embed,
          author: message.author,
        });
      }
    });
  },
};
