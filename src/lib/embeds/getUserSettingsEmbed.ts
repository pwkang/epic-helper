import {Client, Embed, EmbedBuilder, User} from 'discord.js';
import {IUser} from '../../models/user/user.type';
import {BOT_COLOR} from '../../constants/bot';
import {ENCHANT_LEVEL} from '../../constants/enchant';

interface IGetUserSettingsEmbed {
  client: Client;
  author: User;
  userProfile: IUser;
}

interface IHelperSettings {
  icon: string;
  value: string;
}

const DONOR_DISPLAY = {
  1: '0%',
  0.9: '10%',
  0.8: '20%',
  0.65: '35%',
} as const;

export const getUserSettingsEmbed = ({client, userProfile, author}: IGetUserSettingsEmbed) => {
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
      value: `**${DONOR_DISPLAY[userProfile.config.donor]}** cooldown on all commands`,
    },
  ];

  if (userProfile.config.donorP) {
    helperSettings.push({
      icon: '👥',
      value: `\`hunt t\` with **${DONOR_DISPLAY[userProfile.config.donorP]}** cooldown`,
    });
  }

  if (userProfile.config.huntSwitch)
    helperSettings.push({
      icon: '🔁',
      value: 'Switch hunt message between **hunt** and **hunt together**',
    });

  if (userProfile.config.enchant)
    helperSettings.push({
      icon: '✨',
      value: `Mute on getting **${userProfile.config.enchant.toUpperCase()}** or higher tier`,
    });

  if (userProfile.config.timezone)
    helperSettings.push({
      icon: '🌎',
      value: `Timezone: **${userProfile.config.timezone}**`,
    });

  if (userProfile.config.timeFormat)
    helperSettings.push({
      icon: '🕒',
      value: `Time format: **${userProfile.config.timeFormat}**`,
    });

  if (userProfile.config.heal)
    helperSettings.push({
      icon: '🩸',
      value: `Heal below **${userProfile.config.heal}** HP`,
    });

  if (userProfile.config.channel)
    helperSettings.push({
      icon: '💈',
      value: `Reminder send to <#${userProfile.config.channel}>`,
    });

  embed.addFields({
    name: 'EPIC HELPER Settings',
    value: helperSettings.map((setting) => `${setting.icon} - ${setting.value}`).join('\n'),
  });

  return embed;
};
