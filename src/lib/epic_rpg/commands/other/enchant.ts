import {Client, Embed, Message, User} from 'discord.js';
import {RPG_ENCHANT_LEVEL, RPG_ENCHANT_LEVEL_RANK} from '../../../../constants/epic_rpg/enchant';
import {userService} from '../../../../models/user/user.service';
import ms from 'ms';
import {EPIC_RPG_ID} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import djsChannelHelper from '../../../discord.js/channel';
import {djsMessageHelper} from '../../../discord.js/message';
import timestampHelper from '../../../discord.js/timestamp';

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
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgEnchant({client, message, author, isSlashCommand}: IRpgEnchant) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isSuccessfullyEnchanted({embed, author})) {
      event.stop();
      await rpgEnchantSuccess({
        client,
        channelId: message.channel.id,
        author,
        embed,
      });
    }
    if (isEnchantEquipmentBroken({embed})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgEnchantSuccess {
  embed: Embed;
  author: User;
  client: Client;
  channelId: string;
}

const rpgEnchantSuccess = async ({embed, author, client, channelId}: IRpgEnchantSuccess) => {
  const enchantTier = getEnchantType({embed});
  const equipmentType = Object.values(EQUIPMENT_TYPE).find((type) =>
    embed.description?.toLowerCase().includes(type)
  );
  const targetTier = await userService.getUserEnchantTier({userId: author.id});
  if (!targetTier || !enchantTier || !equipmentType) return;
  if (RPG_ENCHANT_LEVEL_RANK[enchantTier] < RPG_ENCHANT_LEVEL_RANK[targetTier]) return;

  const unmuteIn = timestampHelper.relative({
    time: new Date(Date.now() + ms('5s')),
  });
  await djsMessageHelper.send({
    channelId,
    options: {
      content: `You have successfully enchanted your **${equipmentType.toUpperCase()}** to **${enchantTier.toUpperCase()}**!, unmute ${unmuteIn}`,
    },
    client,
  });

  [author.id, EPIC_RPG_ID].map((userId) =>
    djsChannelHelper.muteUser({
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
  Object.values(RPG_ENCHANT_LEVEL).find((level) =>
    embed.fields[0].name.toLowerCase().includes(`**${level}**`)
  );

interface IIsSuccessfullyEnchanted {
  embed: Embed;
  author: User;
}

const isSuccessfullyEnchanted = ({author, embed}: IIsSuccessfullyEnchanted) =>
  Object.values(ENCHANT_CMD_TYPE).some(
    (type) => embed.author?.name === `${author.username} — ${type}`
  );

interface IIsEnchantEquipmentBroken {
  embed: Embed;
}

const isEnchantEquipmentBroken = ({embed}: IIsEnchantEquipmentBroken) =>
  embed.description?.includes('but accidentally broke it');
