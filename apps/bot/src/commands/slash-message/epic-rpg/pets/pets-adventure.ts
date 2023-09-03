import {
  rpgPetAdventure,
  rpgPetAdventureChecker,
} from '../../../../lib/epic-rpg/commands/pets/pet-adventure';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import ms from 'ms';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, User} from 'discord.js';
import {
  rpgPetAdvCancelSuccess,
  rpgPetCancelChecker,
} from '../../../../lib/epic-rpg/commands/pets/pet-cancel';
import {isPetsIdValid} from '@epic-helper/utils';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import timestampHelper from '../../../../lib/discordjs/timestamp';
import {
  SLASH_MESSAGE_BOT_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'petsAdventure',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['pets adventure'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message, author) => {
    if (!message.inGuild()) return;
    const event = createRpgCommandListener({
      channelId: message.channel.id,
      client,
      author,
    });
    if (!event) return;
    event.on('content', async (content, collected) => {
      if (
        rpgPetAdventureChecker.isFailToSendPetsToAdventure({message: collected, author}) ||
        rpgPetCancelChecker.isFailToCancelPet({message: collected, author})
      ) {
        event.stop();
      }
      if (rpgPetAdventureChecker.isSuccessfullySentPetsToAdventure({message: collected, author})) {
        event.stop();

        const amountOfPetSent = rpgPetAdventureChecker.amountOfPetsSentToAdventure({
          message: collected,
          author,
        });
        const selectedPetsId = await collectSelectedPets({
          author,
          message: collected,
          client,
        });
        if (!selectedPetsId) return;
        const options = await rpgPetAdventure({
          message: collected,
          author,
          selectedPets: selectedPetsId,
          amountOfPetSent,
        });
        await djsMessageHelper.send({channelId: message.channel.id, client, options});
      }
      if (
        rpgPetCancelChecker.isPetSuccessfullyCancelled({
          author,
          message: collected,
        })
      ) {
        event.stop();
        const amountOfPetCancelled = rpgPetCancelChecker.extractCancelledPetAmount({
          message: collected,
        });

        const selectedPetsId = await collectSelectedPets({
          author,
          message: collected,
          client,
        });
        if (!selectedPetsId) return;
        const options = await rpgPetAdvCancelSuccess({
          message: collected,
          author,
          selectedPets: selectedPetsId,
          amountOfPetCancelled,
        });
        await djsMessageHelper.send({
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

const collectSelectedPets = async ({
  client,
  message,
  author,
}: ICollectSelectedPets): Promise<string[] | null> => {
  const readyIn = timestampHelper.relative({
    time: new Date(Date.now() + ms('5s')),
  });
  const event = await djsMessageHelper.interactiveSend({
    client,
    channelId: message.channel.id,
    options: {
      content: [
        'Select EPIC or insert IDs to select pets',
        `**EPIC** will be auto select if no response ${readyIn}`,
      ].join('\n'),
      components: [row],
    },
  });
  if (!event) return null;
  return new Promise((resolve) => {
    const autoSelectTimeout = setTimeout(() => {
      if (event.isEnded()) return;
      resolve(['epic']);
      event.stop();
      djsMessageHelper.edit({
        client,
        message: event.message,
        options: {
          components: [],
          content: '**EPIC** selected',
        },
      });
    }, ms('5s'));
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
      await djsInteractionHelper.updateInteraction({
        client,
        interaction,
        options: {
          components: [],
          content: 'Insert IDs',
        },
      });
      const selectedPetsId = await collectSelectedPetsId({client, message, author});
      clearTimeout(autoSelectTimeout);
      resolve(selectedPetsId);
      return null;
    });
  });
};

const collectSelectedPetsId = ({message, author}: ICollectSelectedPets): Promise<string[]> => {
  return new Promise((resolve) => {
    const event = message.channel.createMessageCollector({
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
