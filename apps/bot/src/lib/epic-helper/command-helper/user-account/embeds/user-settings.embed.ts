import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI} from '@epic-helper/constants';
import type {IUser} from '@epic-helper/models';

export interface IGetUserSettingsEmbed {
  author: User;
  userProfile: IUser;
  guildName?: string;
  guildServerName?: string;
}

interface IHelperSettings {
  icon: string;
  value: string;
}

const DONOR_DISPLAY = {
  nonDonor: '0%',
  donor10: '10%',
  donor20: '20%',
  donor35: '35%',
} as const;

export const _getUserSettingsEmbed = ({
  userProfile,
  author,
  guildServerName,
  guildName,
}: IGetUserSettingsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s settings`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setThumbnail(author.avatarURL());

  const helperSettings: IHelperSettings[] = [
    {
      icon: userProfile?.config.onOff ? ':bell:' : ':no_bell:',
      value: `Helper **${
        userProfile.config.onOff ? 'ON' : 'OFF'
      }** (use \`toggle\` to customize helper)`,
    },
    {
      icon: ':alarm_clock:',
      value: `**${
        DONOR_DISPLAY[userProfile.config.donor]
      }** cooldown on all commands`,
    },
  ];

  if (userProfile.config.donorP) {
    helperSettings.push({
      icon: '👥',
      value: `\`hunt t\` with **${
        DONOR_DISPLAY[userProfile.config.donorP]
      }** cooldown`,
    });
  }

  if (userProfile.config.enchant)
    helperSettings.push({
      icon: '✨',
      value: `Mute on getting **${userProfile.config.enchant.toUpperCase()}** or higher tier`,
    });

  if (userProfile.config.heal)
    helperSettings.push({
      icon: '🩸',
      value: `Heal below **${userProfile.config.heal}** HP`,
    });

  if (userProfile.channel.all)
    helperSettings.push({
      icon: '💈',
      value: `Reminder send to <#${userProfile.channel.all}>`,
    });

  if (guildName && guildServerName)
    helperSettings.push({
      icon: '🏰',
      value: `Guild: **${guildName}** @ ${guildServerName}`,
    });

  if(userProfile.rpgInfo.artifacts.pocketWatch.owned)
    helperSettings.push({
      icon: BOT_EMOJI.artifacts.pocketWatch,
      value: `Pocket Watch: **${userProfile.rpgInfo.artifacts.pocketWatch.percent}%**`,
    });

  embed.addFields({
    name: 'EPIC HELPER Settings',
    value: helperSettings
      .map((setting) => `${setting.icon} - ${setting.value}`)
      .join('\n'),
  });

  return embed;
};
