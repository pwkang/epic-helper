import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {userService} from '../../../../services/database/user.service';

export const showUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
  const userToggle = await userService.getUserToggle(interaction.user.id);
  if (!userToggle) return;

  const embed = commandHelper.toggle.getUserToggleEmbed({
    isDonor: true,
    author: interaction.user,
    userToggle,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      embeds: [embed],
    },
  });
};
