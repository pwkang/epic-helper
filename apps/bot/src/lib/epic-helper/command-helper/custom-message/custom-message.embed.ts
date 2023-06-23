import {Client, EmbedBuilder, User} from 'discord.js';
import {IUser} from '@epic-helper/models';
import {BOT_COLOR, BOT_REMINDER_DEFAULT_MESSAGES} from '@epic-helper/constants';
import {CUSTOM_MESSAGE_PAGE_TYPE, CUSTOM_MESSAGE_PAGES} from './custom-message.constant';
import {generateUserReminderMessage} from '../../reminders/message-generator/custom-message-generator';
import ms from 'ms';

export interface IGetCustomMessageEmbed {
  client: Client;
  author: User;
  userAccount: IUser;
  pageType?: ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>;
}

export const _getCustomMessageEmbed = async ({
  client,
  userAccount,
  author,
  pageType = CUSTOM_MESSAGE_PAGE_TYPE.general,
}: IGetCustomMessageEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s custom messages`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed);

  const pageToRender = CUSTOM_MESSAGE_PAGES.find((page) => page.id === pageType)!;

  for (const row of pageToRender.rows) {
    const {label, type} = row;
    const embedValue: string[] = [];

    const currentMessage = await generateUserReminderMessage({
      userId: author.id,
      client,
      type,
      userAccount,
      nextPetIds: [1, 27, 55],
      nextReminder: {
        type: 'hunt',
        readyAt: new Date(Date.now() + ms('1h')),
        userId: author.id,
        props: {
          hardMode: false,
          together: false,
        },
      },
      props: {
        epicItemType: 'epic seed',
        epicQuest: false,
        hardMode: false,
        lootboxType: 'edgy',
        seedType: 'carrot',
        together: false,
        ultraining: false,
        workingType: 'fish',
      },
    });
    embedValue.push(`${currentMessage}`);

    embed.addFields({
      name: label.toUpperCase(),
      value: embedValue.join('\n\n'),
    });
  }

  return embed;
};

interface IGetCustomMessageSettings {
  type: keyof typeof BOT_REMINDER_DEFAULT_MESSAGES;
  customMessage: IUser['customMessage'];
}

const getCustomMessageSettings = ({customMessage, type}: IGetCustomMessageSettings) => {
  const userSettings = customMessage[type];
  const messageDefault = BOT_REMINDER_DEFAULT_MESSAGES[type];

  return userSettings ?? messageDefault ?? '-';
};
