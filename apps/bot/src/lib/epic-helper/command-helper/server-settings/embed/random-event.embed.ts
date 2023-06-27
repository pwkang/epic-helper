import {EmbedBuilder, Guild} from 'discord.js';
import {IServerSettingsEmbed} from '../type';
import {BOT_COLOR, RPG_RANDOM_EVENTS_NAME} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

export const _getRandomEventSettingsEmbed = ({serverAccount, guild}: IServerSettingsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s random event settings`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed);

  for (let [key, label] of typedObjectEntries(RPG_RANDOM_EVENTS_NAME)) {
    embed.addFields({
      name: label,
      value: serverAccount.settings.randomEvent[key] ?? '-',
    });
  }

  return embed;
};
