import {Client, Embed, Message, User} from 'discord.js';
import {userService} from '../../../../models/user/user.service';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';
import {
  getCalcMaterialMessage,
  isCalcMaterial,
} from '../../../epic_helper/features/calculator/materialCalculator';
import {
  getCalcInfo,
  getCalcSTTMessage,
  isCalcSTT,
} from '../../../epic_helper/features/calculator/sttScoreCalculator';
import embedReaders from '../../embedReaders';
import {djsMessageHelper} from '../../../discord.js/message';

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

          djsMessageHelper.send({
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

const rpgInventorySuccess = async ({author, embed}: IRpgInventorySuccess) => {
  const inventory = embedReaders.inventory({embed});
  await userService.updateUserRubyAmount({
    userId: author.id,
    type: 'set',
    ruby: inventory.ruby ?? 0,
  });
};

interface IIsUserInventory {
  embed: Embed;
  author: User;
}

const isUserInventory = ({embed, author}: IIsUserInventory) =>
  embed.author?.name === `${author.username} — inventory`;

export const rpgInventoryChecker = {
  isUserInventory,
};
