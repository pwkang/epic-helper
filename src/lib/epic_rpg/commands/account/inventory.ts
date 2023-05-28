import {Client, Embed, Message, User} from 'discord.js';
import scanInventory from '../../../../utils/epic_rpg/inventory/scanInventory';
import {updateUserRubyAmount} from '../../../../models/user/user.service';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {
  getCalcMaterialMessage,
  isCalcMaterial,
} from '../../../epic_helper/features/calculator/calcMats';
import {
  getCalcInfo,
  getCalcSTTMessage,
  isCalcSTT,
} from '../../../epic_helper/features/calculator/calcSTT';
import sendMessage from '../../../discord.js/message/sendMessage';

const RUBY_EMOJI = '<:ruby:603304907650629653>';

interface IRpg {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
  args?: string[];
}

export function rpgInventory({client, message, author, isSlashCommand, args}: IRpg) {
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isUserInventory({embed, author})) {
      rpgInventorySuccess({
        author,
        embed,
      });
      event.stop();
      if (!isSlashCommand && args) {
        if (isCalcMaterial(args) || isCalcSTT(args)) {
          const calcInfo = getCalcInfo(args);
          if (!calcInfo.area) return;
          const options = isCalcMaterial(args)
            ? getCalcMaterialMessage({embed, area: calcInfo.area ?? 0, author})
            : getCalcSTTMessage({
                embed,
                area: calcInfo.area ?? 0,
                author,
                level: calcInfo?.level ?? 0,
              });

          sendMessage({
            client,
            channelId: message.channel.id,
            options,
          });
        }
      }
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgInventorySuccess {
  author: User;
  embed: Embed;
}

export default async function rpgInventorySuccess({author, embed}: IRpgInventorySuccess) {
  const inventory = scanInventory({embed});
  await updateUserRubyAmount({
    userId: author.id,
    type: 'set',
    ruby: inventory.ruby ?? 0,
  });
}

interface IIsUserInventory {
  embed: Embed;
  author: User;
}

export const isUserInventory = ({embed, author}: IIsUserInventory) =>
  embed.author?.name === `${author.username} — inventory`;
