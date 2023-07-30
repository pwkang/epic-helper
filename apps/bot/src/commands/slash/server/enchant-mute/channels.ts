import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {IEnchantChannel} from '@epic-helper/models';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';

type TActionType = 'add' | 'remove' | 'reset';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.enchantMute.channels.name,
  description: SLASH_COMMAND.server.enchantMute.channels.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.enchantMute.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option
          .setName('action')
          .setDescription('Action to perform')
          .setRequired(true)
          .setChoices(
            {name: 'Add', value: 'add'},
            {name: 'Remove', value: 'remove'},
            {name: 'Reset', value: 'reset'}
          )
      )
      .addStringOption((option) =>
        option
          .setName('channels')
          .setDescription('Mention multiple channels to perform action')
          .setRequired(false)
      ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const channels = interaction.options.getString('channels');
    const action = interaction.options.getString('action') as TActionType;
    const validatedChannels = readChannels(channels).filter((channelId) =>
      interaction.guild?.channels.cache.has(channelId)
    );
    const enchantChannels = await serverService.getEnchantChannels({
      serverId: interaction.guildId,
    });
    switch (action) {
      case 'add':
        await addEnchantChannels({
          channels: validatedChannels,
          serverId: interaction.guildId,
          existingChannels: enchantChannels,
        });
        break;
      case 'remove':
        await removeEnchantChannels({
          channels: validatedChannels,
          serverId: interaction.guildId,
          existingChannels: enchantChannels,
        });
        break;
      case 'reset':
        await resetEnchantChannels({
          serverId: interaction.guildId,
        });
        break;
    }

    const serverSettings = await commandHelper.serverSettings.settings({
      server: interaction.guild!,
    });
    if (!serverSettings) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: serverSettings.render({
        type: SERVER_SETTINGS_PAGE_TYPE.enchantMute,
        displayOnly: true,
      }),
      interaction,
    });
  },
};

const channelMentionRegex = /<#(\d+)>/g;

const readChannels = (channels: string | null) => {
  if (!channels) return [];
  const matches = channels.matchAll(channelMentionRegex);
  return [...matches].map(([, channelId]) => channelId);
};

interface IAddEnchantChannels {
  channels: string[];
  serverId: string;
  existingChannels: IEnchantChannel[];
}

const addEnchantChannels = async ({channels, serverId, existingChannels}: IAddEnchantChannels) => {
  const newChannels = channels.filter((channelId) =>
    existingChannels.every((existingChannel) => existingChannel.channelId !== channelId)
  );
  await serverService.addEnchantChannels({
    serverId,
    channels: newChannels.map((channelId) => ({
      channelId,
    })),
  });
};

interface IRemoveEnchantChannels {
  channels: string[];
  serverId: string;
  existingChannels: IEnchantChannel[];
}

const removeEnchantChannels = async ({
  channels,
  serverId,
  existingChannels,
}: IRemoveEnchantChannels) => {
  const newChannels = existingChannels.filter((channel) => !channels.includes(channel.channelId));
  await serverService.addEnchantChannels({
    serverId,
    channels: newChannels.map((channel) => ({
      channelId: channel.channelId,
    })),
  });
};

interface IResetEnchantChannels {
  serverId: string;
}

const resetEnchantChannels = async ({serverId}: IResetEnchantChannels) => {
  await serverService.resetEnchantChannels({
    serverId,
  });
};
