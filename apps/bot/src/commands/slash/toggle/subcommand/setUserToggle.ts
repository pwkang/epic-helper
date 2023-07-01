import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {userService} from '../../../../services/database/user.service';
import {toggleDisplayList} from '../../../../lib/epic-helper/command-helper/toggle/toggle.list';
import {IUser} from '@epic-helper/models';

export const setUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
  const onStr = interaction.options.getString('on');
  const offStr = interaction.options.getString('off');
  let userAccount = await userService.getUserAccount(interaction.user.id);
  if (!userAccount) return;

  const query = commandHelper.toggle.getUpdateQuery<IUser>({
    on: onStr ? onStr : undefined,
    off: offStr ? offStr : undefined,
    toggleInfo: toggleDisplayList.donor(userAccount.toggle),
  });
  userAccount = await userService.updateUserToggle({
    query,
    userId: interaction.user.id,
  });
  if (!userAccount) return;
  const embed = commandHelper.toggle.getDonorToggleEmbed({
    author: interaction.user,
    userAccount,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      embeds: [embed],
    },
  });
};
