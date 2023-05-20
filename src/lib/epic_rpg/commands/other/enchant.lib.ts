import {Client, Embed, User} from 'discord.js';
import {ENCHANT_LEVEL, ENCHANT_LEVEL_RANK} from '../../../../constants/enchant';
import {getUserEnchantTier} from '../../../../models/user/user.service';
import {muteUser} from '../../../discord.js/channel/muteUser.lib';
import ms from 'ms';
import {EPIC_RPG_ID} from '../../../../constants/bot';
import sendMessage from '../../../discord.js/message/sendMessage';
import dynamicTimeStamp from '../../../../utils/discord/dynamicTimestamp';

const ENCHANT_CMD_TYPE = {
  enchant: 'enchant',
  refine: 'refine',
  transmute: 'transmute',
  transcend: 'transcend',
} as const;

const EQUIPMENT_TYPE = {
  sword: 'sword',
  armor: 'armor',
} as const;

interface IRpgEnchant {
  embed: Embed;
  author: User;
  client: Client;
  channelId: string;
}

export const rpgEnchant = async ({embed, author, client, channelId}: IRpgEnchant) => {
  const enchantTier = getEnchantType({embed});
  const equipmentType = Object.values(EQUIPMENT_TYPE).find((type) =>
    embed.description?.toLowerCase().includes(type)
  );
  const targetTier = await getUserEnchantTier({userId: author.id});
  if (!targetTier || !enchantTier || !equipmentType) return;
  if (ENCHANT_LEVEL_RANK[enchantTier] < ENCHANT_LEVEL_RANK[targetTier]) return;

  await sendMessage({
    channelId,
    options: {
      content: `You have successfully enchanted your **${equipmentType.toUpperCase()}** to **${enchantTier.toUpperCase()}**!, unmute ${dynamicTimeStamp(
        {
          time: new Date(Date.now() + ms('5s')),
        }
      )}`,
    },
    client,
  });

  [author.id, EPIC_RPG_ID].map((userId) =>
    muteUser({
      userId,
      client,
      channelId,
      unMuteIn: ms('5s'),
    })
  );
};

interface IEnchantGet {
  embed: Embed;
}

export const getEnchantType = ({embed}: IEnchantGet) =>
  Object.values(ENCHANT_LEVEL).find((level) =>
    embed.fields[0].name.toLowerCase().includes(`**${level}**`)
  );

interface IIsSuccessfullyEnchanted {
  embed: Embed;
  author: User;
}

export const isSuccessfullyEnchanted = ({author, embed}: IIsSuccessfullyEnchanted) =>
  Object.values(ENCHANT_CMD_TYPE).some(
    (type) => embed.author?.name === `${author.username} — ${type}`
  );

interface IIsEnchantEquipmentBroken {
  embed: Embed;
}

export const isEnchantEquipmentBroken = ({embed}: IIsEnchantEquipmentBroken) =>
  embed.description?.includes('but accidentally broke it');
