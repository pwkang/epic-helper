import type {BaseMessageOptions, Client, User} from 'discord.js';
import {userService} from '../../../../../services/database/user.service';
import type {IUser, IUserToggle} from '@epic-helper/models';
import {toggleDisplayList} from '../toggle.list';
import {renderEmbed} from '../toggle.embed';
import {PREFIX} from '@epic-helper/constants';
import type {IUpdateToggle} from '../toggle.helper';
import {getUpdateQuery} from '../toggle.helper';
import {userChecker} from '../../../user-checker';

interface IGetUserToggle {
  author: User;
  client: Client;
  serverId: string;
}

export const getUserToggle = async ({
  author,
  client,
  serverId,
}: IGetUserToggle) => {
  let userToggle = await userService.getUserToggle(author.id);
  if (!userToggle) return null;
  const isDonor = await userChecker.isDonor({
    userId: author.id,
    client,
    serverId,
  });

  function render(userToggle: IUserToggle): BaseMessageOptions {
    const embed = getEmbed(userToggle);
    return {
      embeds: [embed],
    };
  }

  function getEmbed(userToggle: IUserToggle) {
    return isDonor
      ? getDonorToggleEmbed({
        author,
        userToggle,
      })
      : getNonDonorToggleEmbed({
        author,
        userToggle,
      });
  }

  async function update({on, off}: IUpdateToggle) {
    const query = getUpdateQuery<IUser>({
      on,
      off,
      toggleInfo: isDonor
        ? toggleDisplayList.donor(userToggle!)
        : toggleDisplayList.nonDonor(userToggle!),
    });
    const userAccount = await userService.updateUserToggle({
      query,
      userId: author.id,
    });
    if (!userAccount) return null;
    userToggle = userAccount.toggle;
    return render(userToggle);
  }

  return {
    render: () => render(userToggle!),
    update,
  };
};

interface IGetDonorToggleEmbed {
  userToggle: IUserToggle;
  author: User;
}

export const getDonorToggleEmbed = ({
  userToggle,
  author,
}: IGetDonorToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.donor(userToggle),
  })
    .setAuthor({
      name: `${author.username}'s toggle`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setDescription(
      `**Syntax 1:** \`${PREFIX.bot}t <on/off> <ID> [ID] [ID]\` - turn on/off any settings
      > *\`${PREFIX.bot}t on a1 a5 b3a c2-c5\`*
      **Syntax 2:** \`${PREFIX.bot}t reset\` - reset all settings`,
    );
};

interface IGetNonDonorToggleEmbed {
  userToggle: IUserToggle;
  author: User;
}

const getNonDonorToggleEmbed = ({
  userToggle,
  author,
}: IGetNonDonorToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.nonDonor(userToggle),
  }).setAuthor({
    name: `${author.username}'s toggle`,
    iconURL: author.avatarURL() ?? undefined,
  });
};
