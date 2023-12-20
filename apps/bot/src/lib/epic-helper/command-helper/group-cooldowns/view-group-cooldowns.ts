import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userReminderServices, userService} from '@epic-helper/services';
import type {IUser, IUserReminder} from '@epic-helper/models';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {BOT_COLOR, BOT_EMOJI, RPG_COMMAND_LABEL} from '@epic-helper/constants';
import timestampHelper from '../../../discordjs/timestamp';
import type {ValuesOf} from '@epic-helper/types';
import {typedObjectEntries} from '@epic-helper/utils';

interface IVGroupCooldowns {
  author: User;
}

export const _viewGroupCooldowns = async ({author}: IVGroupCooldowns) => {
  const userAccount = await userService.getUserAccount(author.id);
  if (!userAccount) return null;

  const groupCooldowns = userAccount?.groupCooldowns;
  const cooldownList = await userReminderServices.getUserAllCooldowns(author.id);
  const users = await userService.getUsersAccount({usersId: groupCooldowns?.map(cd => cd.userId)});

  const commandsToShow = new Set<ValuesOf<typeof RPG_COMMAND_TYPE>>();

  for (const {userId, types} of groupCooldowns) {
    const _cooldowns = await userReminderServices.getUserAllCooldowns(userId);
    cooldownList.push(..._cooldowns);
    for (const type of types) {
      commandsToShow.add(type);
    }
  }


  const embed = generateEmbed({
    author: userAccount,
    users,
    cooldownList,
  });

  return {
    embeds: [embed],
  };
};

interface IGenerateEmbed {
  author: IUser;
  users: IUser[];
  cooldownList: IUserReminder[];
}

const generateEmbed = ({author, users, cooldownList}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: 'Group Cooldowns',
    });


  const commandsToShow = new Set<ValuesOf<typeof RPG_COMMAND_TYPE>>();

  for (const { types} of author.groupCooldowns) {
    types.forEach(type => commandsToShow.add(type));
  }

  if(author.groupCooldowns.length) {


    for (const [type] of typedObjectEntries(RPG_COMMAND_TYPE)) {
      if(!commandsToShow.has(type)) continue;
      const title = RPG_COMMAND_LABEL[type];
      const value = [];

      const authorCooldown = cooldownList.find(cooldown => cooldown.userId === author.userId && cooldown.type === type);
      value.push(`**${author.username}** ~ ${getCommandState(authorCooldown)}`);

      for (const user of users) {
        const commandsOfUser = author.groupCooldowns.find(cd => cd.userId === user.userId);
        if(!commandsOfUser?.types.includes(type)) continue;
        const userCooldown = cooldownList.find(cooldown => cooldown.userId === user.userId && cooldown.type === type);
        value.push(`**${user.username}** ~ ${getCommandState(userCooldown)}`);
      }

      embed.addFields({
        name: title,
        value: value.join('\n'),
        inline: true,
      });
    }
  }else{
    embed.setDescription('You have not set any group cooldowns yet');
  }


  embed.addFields({
    name: 'Commands',
    value: [
      '`gcd` - View group cooldowns',
      '`gcd set @player1 @player2 hunt duel ...` - update users and commands type',
      '`gcd remove @player1 @player2` - remove users',
      '`gcd reset` - Reset and clear all group cooldowns',
    ].join('\n'),
  });

  return embed;
};

const getCommandState = (reminder?: IUserReminder) => {
  if (!reminder) return BOT_EMOJI.utils.on;
  if (!reminder.readyAt) return BOT_EMOJI.utils.on;
  if (reminder.readyAt.getTime() > Date.now()) return `⏳ ${timestampHelper.relative({time: reminder.readyAt})}`;
  return BOT_EMOJI.utils.on;
};
