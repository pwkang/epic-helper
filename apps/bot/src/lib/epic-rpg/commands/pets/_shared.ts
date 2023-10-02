import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, User} from 'discord.js';
import timestampHelper from '../../../discordjs/timestamp';
import ms from 'ms';
import {djsMessageHelper} from '../../../discordjs/message';
import djsInteractionHelper from '../../../discordjs/interaction';
import {isPetsIdValid} from '@epic-helper/utils';

interface ICollectSelectedPets {
  client: Client;
  message: Message;
  author: User;
}

export const collectSelectedPets = async ({
  client,
  message,
  author,
}: ICollectSelectedPets): Promise<string[] | undefined> => {
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
  if (!event) return undefined;
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

const row = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('epic').setLabel('EPIC').setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder().setCustomId('ids').setLabel('IDs').setStyle(ButtonStyle.Secondary)
  );

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
