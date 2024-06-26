import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../../constant';
import {serverService} from '@epic-helper/services';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.enchantMute.duration.name,
  description: SLASH_COMMAND.server.enchantMute.duration.description,
  commandName: SLASH_COMMAND.server.name,
  groupName: SLASH_COMMAND.server.enchantMute.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand.addNumberOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration in seconds')
        .setRequired(true)
        .setMinValue(1),
    ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const duration = interaction.options.getNumber('duration', true);

    await serverService.updateEnchantMuteDuration({
      duration: duration * 1000,
      serverId: interaction.guildId,
    });

    const serverSettings = await commandHelper.serverSettings.settings({
      server: interaction.guild!,
      client,
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
