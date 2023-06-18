import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {userService} from '../../../../models/user/user.service';
import djsInteractionHelper from '../../../../lib/discord.js/interaction';

export const setUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
  const onStr = interaction.options.getString('on');
  const offStr = interaction.options.getString('off');
  let userToggle = await userService.getUserToggle(interaction.user.id);
  if (!userToggle) return;

  const query = commandHelper.toggle.getUpdateQuery({
    userToggle,
    on: onStr ? onStr : undefined,
    off: offStr ? offStr : undefined,
    isDonor: true,
  });
  userToggle = await userService.updateUserToggle({
    query,
    userId: interaction.user.id,
  });
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
