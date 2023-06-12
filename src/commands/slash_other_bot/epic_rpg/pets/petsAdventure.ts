import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {
  amountOfPetsSentToAdventure,
  isFailToSendPetsToAdventure,
  isPetsIdValid,
  isSuccessfullySentPetsToAdventure,
  rpgPetAdventure,
} from '../../../../lib/epic_rpg/commands/pets/petAdventure.lib';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import dynamicTimeStamp from '../../../../utils/discord/dynamicTimestamp';
import ms from 'ms';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, User} from 'discord.js';
import updateInteraction from '../../../../lib/discord.js/interaction/updateInteraction';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import editMessage from '../../../../lib/discord.js/message/editMessage';
import {
  extractCancelledPetAmount,
  isFailToCancelPet,
  isPetSuccessfullyCancelled,
  rpgPetAdvCancel,
} from '../../../../lib/epic_rpg/commands/pets/petCancel.lib';

export default <SlashCommandOtherBot>{
  name: 'petsAdventure',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets adventure'],
  execute: async (client, message, author) => {
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author,
    });
    if (!event) return;
    event.on('content', async (content, collected) => {
      if (
        isFailToSendPetsToAdventure({message: collected, author}) ||
        isFailToCancelPet({message: collected, author})
      ) {
        event.stop();
      }
      if (isSuccessfullySentPetsToAdventure({message: collected, author})) {
        event.stop();

        const amountOfPetSent = amountOfPetsSentToAdventure({
          message: collected,
          author,
        });
        const selectedPetsId = await collectSelectedPets({
          author,
          message: collected,
          client,
        });
        const options = await rpgPetAdventure({
          message: collected,
          author,
          selectedPets: selectedPetsId,
          amountOfPetSent,
        });
        sendMessage({channelId: message.channel.id, client, options});
      }
      if (
        isPetSuccessfullyCancelled({
          author,
          message: collected,
        })
      ) {
        event.stop();
        const amountOfPetCancelled = extractCancelledPetAmount({
          message: collected,
        });

        const selectedPetsId = await collectSelectedPets({
          author,
          message: collected,
          client,
        });
        const options = await rpgPetAdvCancel({
          message: collected,
          author,
          selectedPets: selectedPetsId,
          amountOfPetCancelled,
        });
        sendMessage({
          channelId: message.channel.id,
          client,
          options,
        });
      }
    });
    event.triggerCollect(message);
  },
};

interface ICollectSelectedPets {
  client: Client;
  message: Message;
  author: User;
}

const collectSelectedPets = ({
  client,
  message,
  author,
}: ICollectSelectedPets): Promise<string[]> => {
  return new Promise(async (resolve) => {
    const event = await sendInteractiveMessage({
      client,
      channelId: message.channel.id,
      options: {
        content: `Select EPIC or insert IDs to select pets
**EPIC** will be auto select if no response ${dynamicTimeStamp({
          time: new Date(Date.now() + ms('5s')),
        })}`,
        components: [row],
      },
    });
    if (!event) return;
    event.on('epic', () => {
      resolve(['epic']);
      event.stop();
      return {
        components: [],
        content: '**EPIC** selected',
      };
    });
    event.on('ids', async (interaction) => {
      if (!interaction.isButton()) return {};
      updateInteraction({
        client,
        interaction,
        options: {
          components: [],
          content: 'Insert IDs',
        },
      });
      const selectedPetsId = await collectSelectedPetsId({client, message, author});
      resolve(selectedPetsId);
      return null;
    });
    setTimeout(() => {
      if (event.isEnded()) return;
      resolve(['epic']);
      event.stop();
      editMessage({
        client,
        message: event.message,
        options: {
          components: [],
          content: '**EPIC** selected',
        },
      });
    }, ms('5s'));
  });
};

const collectSelectedPetsId = ({
  client,
  message,
  author,
}: ICollectSelectedPets): Promise<string[]> => {
  return new Promise(async (resolve) => {
    const event = await message.channel.createMessageCollector({
      filter: (m) => m.author.id === author.id,
      idle: ms('30s'),
    });
    event.on('collect', (collected) => {
      const args = collected.content.toLowerCase().split(' ');
      if (args.length === 0) return;
      if (!isPetsIdValid(args)) return;
      resolve(args);
    });
  });
};

const row = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('epic').setLabel('EPIC').setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder().setCustomId('ids').setLabel('IDs').setStyle(ButtonStyle.Secondary)
  );
