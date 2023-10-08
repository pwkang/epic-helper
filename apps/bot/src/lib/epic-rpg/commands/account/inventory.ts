import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import materialCalculator from '../../../epic-helper/features/calculator/material-calculator';
import sttScoreCalculator from '../../../epic-helper/features/calculator/stt-score-calculator';
import embedReaders from '../../embed-readers';
import {djsMessageHelper} from '../../../discordjs/message';
import {userService} from '../../../../services/database/user.service';

interface IRpg {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
  args?: string[];
}

export function rpgInventory({client, message, author, isSlashCommand, args}: IRpg) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
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
      event?.stop();
      if (!isSlashCommand && args) {
        if (materialCalculator.isCalcMaterial(args) || sttScoreCalculator.isCalcSTT(args)) {
          const calcInfo = sttScoreCalculator.getCalcInfo(args);
          if (!calcInfo.area) return;
          const options = materialCalculator.isCalcMaterial(args)
            ? materialCalculator.getCalcMaterialMessage({embed, area: calcInfo.area ?? 0, author})
            : sttScoreCalculator.getCalcSTTMessage({
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
  event.on('end', () => {
    event = undefined;
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
