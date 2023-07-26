import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/server-settings/constant';
import {SLASH_COMMAND_SERVER_ENCHANT_MUTE_NAME, SLASH_COMMAND_SERVER_NAME} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'duration',
  description: 'Set the enchant mute duration',
  type: 'subcommand',
  commandName: SLASH_COMMAND_SERVER_NAME,
  groupName: SLASH_COMMAND_SERVER_ENCHANT_MUTE_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const duration = interaction.options.getNumber('duration')!;

    await serverService.updateEnchantMuteDuration({
      duration: duration * 1000,
      serverId: interaction.guildId!,
    });

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
