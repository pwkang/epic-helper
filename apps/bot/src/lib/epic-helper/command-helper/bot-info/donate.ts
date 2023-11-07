import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, PATREON_LINK} from '@epic-helper/constants';

export const _donate = () => {
  const render = () => {
    const embed = getEmbed();
    return {
      embeds: [embed],
    };
  };

  return {
    render,
  };
};

const getEmbed = () => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(
      `If you enjoy using the bot and want to support dev, consider donating on [Patreon](${PATREON_LINK}).`,
    );

  embed.addFields({
    name: 'By donating, you will get:',
    value: [
      '**__Extra Features__**: customize reminder message, more pet commands, view today\'s stats, More toggle options, custom reminder channel',
      '**__Unlocks Commands__**: `custommessage`, `petfusion`, `/pet summary`, `/account reminder-channel`',
      '**__EPIC Tokens__**: Use it on a server and unlocks server perks',
    ].join('\n'),
  });

  return embed;
};
