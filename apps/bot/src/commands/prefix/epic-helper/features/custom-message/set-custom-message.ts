import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {
  CUSTOM_MESSAGE_PAGE_TYPE,
  CUSTOM_MESSAGE_TYPES_DISPLAY_NAME,
} from '../../../../../lib/epic-helper/command-helper/custom-message/custom-message.constant';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import {userService} from '../../../../../services/database/user.service';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import toggleUserChecker from '../../../../../lib/epic-helper/toggle-checker/user';

export default <PrefixCommand>{
  name: 'customMessageSet',
  commands: ['customMessage set', 'cm set'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message, args) => {
    const type = args[2];
    if (
      !Object.values(CUSTOM_MESSAGE_TYPES_DISPLAY_NAME).includes(
        type.toLowerCase(),
      )
    ) {
      return djsMessageHelper.reply({
        client,
        message,
        options: {
          content: `Invalid type. Valid types are: ${Object.values(
            CUSTOM_MESSAGE_TYPES_DISPLAY_NAME,
          )
            .map((name) => `\`${name}\``)
            .join(', ')}`,
        },
      });
    }
    if (!args[3]) {
      return djsMessageHelper.reply({
        client,
        message,
        options: {
          content: 'Please provide a message',
        },
      });
    }
    const messageContent = extractReminderMessage(message.content);
    const updateKey = Object.entries(CUSTOM_MESSAGE_TYPES_DISPLAY_NAME).find(
      ([, displayName]) => displayName.toLowerCase() === type.toLowerCase(),
    )?.[0] as keyof typeof CUSTOM_MESSAGE_TYPES_DISPLAY_NAME;
    const userAccount = await userService.updateUserCustomMessage({
      userId: message.author.id,
      message: messageContent,
      type: updateKey,
    });
    const toggleChecker = await toggleUserChecker({userId: message.author.id});
    if (!userAccount || !toggleChecker) return;
    let event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: await commandHelper.customMessage.getMessageOptions({
        author: message.author,
        userAccount,
        client,
        toggleChecker,
      }),
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    for (const pageType of Object.values(CUSTOM_MESSAGE_PAGE_TYPE)) {
      event.on(pageType, async (interaction) => {
        if (!interaction.isButton()) return null;
        return await commandHelper.customMessage.getMessageOptions({
          author: interaction.user,
          client,
          userAccount,
          pageType,
          toggleChecker,
        });
      });
    }
  },
};

const extractReminderMessage = (message: string) =>
  message
    .split('set')
    .slice(1)
    .join('set')
    .trim()
    .split(' ')
    .slice(1)
    .join(' ');
