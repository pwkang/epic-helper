import {IUserConfig} from '../config.type';
import replyInteraction from '../../../../../lib/discord.js/interaction/replyInteraction';
import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../../constants/epic_rpg/rpg';
import {
  removeUserReminderChannel,
  setUserReminderChannel,
} from '../../../../../models/user/user.service';

export const setReminderChannelSlash = async ({client, interaction}: IUserConfig) => {
  const optionReminderType = interaction.options.getString('reminder-type')!;
  const optionAction = interaction.options.getString('action')! as 'set' | 'remove';

  const reminderType = matchReminderType(optionReminderType);

  if (!reminderType.length)
    return replyInteraction({
      client,
      interaction,
      options: {
        content: `Invalid reminder type. Valid reminder types are: ${Object.keys(RPG_COMMAND_TYPE)
          .map((i) => `\`${i}\``)
          .join(', ')}`,
      },
    });

  let message: string;

  switch (optionAction) {
    case 'set':
      await setUserReminderChannel({
        channelId: interaction.channelId,
        userId: interaction.user.id,
        commandType: reminderType,
      });
      message = `Successfully set reminder channel for ${reminderType
        .map((i) => `\`${i}\``)
        .join(', ')} to this channel`;
      break;
    case 'remove':
      await removeUserReminderChannel({
        userId: interaction.user.id,
        commandType: reminderType,
      });
      message = `Successfully removed reminder channel for ${reminderType
        .map((i) => `\`${i}\``)
        .join(', ')}`;
      break;
  }

  replyInteraction({
    client,
    interaction,
    options: {
      content: message,
    },
  });
};

type IKeyword = Record<keyof typeof RPG_COMMAND_TYPE, string[]>;

const keyWords: IKeyword = {
  adventure: ['adventure', 'adv'],
  hunt: ['hunt'],
  arena: ['arena'],
  daily: ['daily'],
  duel: ['duel'],
  dungeon: ['dungeon', 'miniboss'],
  farm: ['farm'],
  horse: ['horse', 'horse breed', 'horse race'],
  lootbox: ['lootbox', 'buy'],
  pet: ['pet', 'pets'],
  quest: ['quest', 'epic quest'],
  use: ['use', 'epic items', 'epic item'],
  training: ['training', 'tr'],
  vote: ['vote'],
  weekly: ['weekly'],
  working: ['working', ...Object.keys(RPG_WORKING_TYPE)],
};

const matchReminderType = (reminderType: string) => {
  const reminderTypeLower = reminderType.toLowerCase();

  const matched: (keyof IKeyword)[] = [];
  for (const key in keyWords) {
    const _key = key as keyof typeof keyWords;
    if (keyWords[_key].some((keyword) => reminderTypeLower.includes(keyword))) {
      if (!matched.includes(_key)) {
        matched.push(_key);
      }
    }
  }

  return matched;
};
