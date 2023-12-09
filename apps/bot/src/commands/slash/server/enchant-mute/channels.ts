import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
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
            {name: 'Reset', value: 'reset'},
          ),
      )
      .addStringOption((option) =>
        option
          .setName('channels')
          .setDescription('Mention multiple channels to perform action')
          .setRequired(false),
      ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const channels = interaction.options.getString('channels');
    const action = interaction.options.getString('action') as TActionType;
    const validatedChannels = readChannels(channels).filter((channelId) =>
      interaction.guild?.channels.cache.has(channelId),
    );
    const enchantMuteSettings = await commandHelper.serverSettings.enchantMute({
      serverId: interaction.guildId,
      client,
    });
    let messageOptions;
    switch (action) {
      case 'add':
        messageOptions = await enchantMuteSettings.addChannels(
          validatedChannels,
        );
        break;
      case 'remove':
        messageOptions = await enchantMuteSettings.removeChannels(
          validatedChannels,
        );
        break;
      case 'reset':
        messageOptions = await enchantMuteSettings.reset();
        break;
    }

    if (!messageOptions) return;
    await djsInteractionHelper.replyInteraction({
      client,
      options: messageOptions,
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
