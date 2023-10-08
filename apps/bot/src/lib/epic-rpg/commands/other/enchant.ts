import type {Client, Embed, Guild, Message, User} from 'discord.js';
import ms from 'ms';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import djsChannelHelper from '../../../discordjs/channel';
import {djsMessageHelper} from '../../../discordjs/message';
import timestampHelper from '../../../discordjs/timestamp';
import {
  EPIC_RPG_ID,
  RPG_ENCHANT_LEVEL,
  RPG_ENCHANT_LEVEL_RANK,
} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import toggleServerChecker from '../../../epic-helper/toggle-checker/server';

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

export function rpgEnchant({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgEnchant) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isSuccessfullyEnchanted({embed, author})) {
      event?.stop();
      await rpgEnchantSuccess({
        client,
        channelId: message.channel.id,
        author,
        embed,
        server: message.guild!,
      });
    }
    if (isEnchantEquipmentBroken({embed})) {
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgEnchantSuccess {
  embed: Embed;
  author: User;
  client: Client;
  channelId: string;
  server: Guild;
}

const rpgEnchantSuccess = async ({
  embed,
  author,
  client,
  channelId,
  server,
}: IRpgEnchantSuccess) => {
  const toggleServer = await toggleServerChecker({
    serverId: server.id,
  });
  if (toggleServer?.enchantMute) {
    const enchantTier = getEnchantType({embed});
    const equipmentType = Object.values(EQUIPMENT_TYPE).find((type) =>
      embed.description?.toLowerCase().includes(type)
    );
    const targetTier = await userService.getUserEnchantTier({
      userId: author.id,
    });
    if (!targetTier || !enchantTier || !equipmentType) return;
    if (
      RPG_ENCHANT_LEVEL_RANK[enchantTier] < RPG_ENCHANT_LEVEL_RANK[targetTier]
    )
      return;

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
  }
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
