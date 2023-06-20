import type {EmbedAuthorOptions, EmbedField} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI, PREFIX} from '@epic-helper/constants';

export interface IToggleEmbedsInfo {
  id: string;
  title: string;
  value?: boolean;
  path?: string;
  description?: string;
  children: {
    label: string;
    value: boolean;
    path: string;
    children?: {
      path: string;
      label: string;
      value: boolean;
    }[];
  }[];
}

interface IGetToggleEmbed {
  embedsInfo: IToggleEmbedsInfo[];
  embedAuthor: EmbedAuthorOptions | null;
  displayItem: string;
}

export const renderEmbed = ({embedsInfo, embedAuthor}: IGetToggleEmbed): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor(embedAuthor)
    .setDescription(
      `**Syntax 1:** \`${PREFIX.bot}t <on/off> <ID> [ID] [ID]\` - turn on/off any settings
      > *\`${PREFIX.bot}t on a1 a5 b3a\`*
      **Syntax 2:** \`${PREFIX.bot}t reset\` - reset all settings`
    );
  const fields: EmbedField[] = embedsInfo.map((info, index) =>
    renderFieldValue({
      info,
      index,
    })
  );
  embed.addFields(fields);
  return embed;
};

interface IRenderFieldValue {
  info: IToggleEmbedsInfo;
  index: number;
}

const renderFieldValue = ({info, index}: IRenderFieldValue): EmbedField => {
  const embedValue: string[] = [];
  const {value, children: parent, title} = info;
  const groupId = String.fromCharCode(65 + index);
  const toGrey = value === false;

  for (const i in parent) {
    const child = parent[i];
    const {value, children, label} = child;
    const toGreySubChildren = !value;
    const childId = Number(i) + 1;
    const emoji = renderEmoji({status: value, grey: toGrey && i !== '0'});
    embedValue.push(`${emoji} \`${groupId}${childId}\` ${label}`);

    if (children?.length) {
      for (const j in children) {
        const subChild = children[j];
        const {value, label} = subChild;
        const emoji = renderEmoji({status: value, grey: toGreySubChildren});
        const subChildId = String.fromCharCode(97 + Number(j));
        embedValue.push(`${emoji}--\`${groupId}${childId}${subChildId}\` ${label}`);
      }
    }
  }

  return {
    value: embedValue.join('\n'),
    inline: true,
    name: info.title,
  };
};

interface IRenderEmoji {
  grey: boolean;
  status: boolean;
}

const renderEmoji = ({status, grey}: IRenderEmoji) => {
  if (grey) return status ? BOT_EMOJI.utils.onGrey : BOT_EMOJI.utils.offGrey;
  else return status ? BOT_EMOJI.utils.on : BOT_EMOJI.utils.off;
};
