import type {BaseMessageOptions, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {
  BOT_CLICKABLE_SLASH_COMMANDS,
  BOT_COLOR,
  RPG_CLICKABLE_SLASH_COMMANDS,
  SUPPORT_SERVER_INVITE_LINK
} from '@epic-helper/constants';

interface IRegisterAccount {
  author: User;
  channelId: string;
}

export const _registerAccount = async ({
  author,
  channelId
}: IRegisterAccount): Promise<BaseMessageOptions> => {
  const created = await userService.registerUserAccount({
    userId: author.id,
    username: author.username,
    channelId
  });
  if (created) {
    return {
      embeds: [registeredEmbed]
    };
  } else {
    return {
      content: 'You have already registered!'
    };
  }
};

const registeredEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Successfully registered your account!')
  .addFields(
    {
      name: 'What Next ?',
      value: `
        - Use /account donor to select EPIC RPG donor
- Use ${RPG_CLICKABLE_SLASH_COMMANDS.cd} to register reminder
- Use ${RPG_CLICKABLE_SLASH_COMMANDS.inventory} to track ruby amount
- Use ${RPG_CLICKABLE_SLASH_COMMANDS.petList}, go through all pages to register pet reminder
- Start grinding !`,
      inline: true
    },
    {
      name: 'More Settings',
      value: `
- ${BOT_CLICKABLE_SLASH_COMMANDS.toggleShow} - customise the helper
- ${BOT_CLICKABLE_SLASH_COMMANDS.stats} - view command counter
`,
      inline: true
    },
    {
      name: 'Need Help ?',
      value: `
        Use ${BOT_CLICKABLE_SLASH_COMMANDS.help} to explore more commands
        Or Join our [support server](${SUPPORT_SERVER_INVITE_LINK})`,
      inline: false
    }
  );
