import {Client, Message, User} from 'discord.js';
import {RPG_EQUIPMENTS} from '../../../../constants/epic_rpg/equipments';
import {updateUserRubyAmount} from '../../../../models/user/user.service';
import {createRpgCommandListener} from '../../../../utils/createRpgCommandListener';

const rubyConsumed = {
  [RPG_EQUIPMENTS.ultraEdgyArmor]: 400,
};

interface IRpgForge {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgForge = ({client, message, author, isSlashCommand}: IRpgForge) => {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isSuccessfullyForged({content})) {
      await rpgForgeSuccess({
        author,
        content,
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgForgeSuccess {
  content: Message['content'];
  author: User;
}

const rpgForgeSuccess = async ({content, author}: IRpgForgeSuccess) => {
  const item = Object.entries(RPG_EQUIPMENTS).find(([_, item]) =>
    content.toLowerCase().includes(item)
  )?.[1] as keyof typeof RPG_EQUIPMENTS;
  if (!item) return;

  if (Object.keys(rubyConsumed).includes(item)) {
    const _item = item as keyof typeof rubyConsumed;
    let ruby = rubyConsumed[_item];
    if (isReturnPortionRecipes({content})) {
      const rate = extractReturnPortionRecipes({content});
      if (rate) {
        ruby -= Math.ceil(ruby * (Number(rate) / 100));
      }
    }
    await updateUserRubyAmount({
      type: 'dec',
      userId: author.id,
      ruby,
    });
  }
};

interface IIsSuccessfullyForged {
  content: Message['content'];
}

const isSuccessfullyForged = ({content}: IIsSuccessfullyForged) =>
  content.includes('successfully forged!');

interface IIsReturnPortionRecipes {
  content: Message['content'];
}

const isReturnPortionRecipes = ({content}: IIsReturnPortionRecipes) =>
  content.includes('of the recipe back');

interface IExtractReturnPortionRecipes {
  content: Message['content'];
}

const extractReturnPortionRecipes = ({content}: IExtractReturnPortionRecipes) =>
  content.match(/You got (\d+.\d+)% of the /)?.[1];
