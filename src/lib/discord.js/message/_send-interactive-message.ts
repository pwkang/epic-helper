import {
  BaseInteraction,
  Client,
  InteractionUpdateOptions,
  MessageCreateOptions,
  MessagePayload,
  StringSelectMenuInteraction,
} from 'discord.js';
import ms from 'ms';
import {djsMessageHelper} from './index';

interface SendInteractiveMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function _sendInteractiveMessage<EventType extends string>({
  channelId,
  options,
  client,
}: SendInteractiveMessageProps) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  const sentMessage = await djsMessageHelper.send({
    channelId,
    client,
    options,
  });
  if (!sentMessage) return;

  const collector = sentMessage.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(
    customId: EventType extends undefined ? string : EventType,
    callback: (
      collected: BaseInteraction | StringSelectMenuInteraction
    ) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null
  ) {
    collector.on('collect', async (collected) => {
      if (collected.customId !== customId) return;
      const replyMsg = await callback(collected);
      if (!replyMsg) return;
      await collected.update(replyMsg);
    });
  }

  function stop() {
    collector.stop();
    collector.removeAllListeners();
  }

  function isEnded() {
    return collector.ended;
  }

  collector.on('end', (collected, reason) => {
    if (!sentMessage) return;

    if (reason === 'idle')
      djsMessageHelper.edit({
        client,
        message: sentMessage,
        options: {
          components: [], // todo: make all components disabled instead of remove it
        },
      });
  });

  return {
    on,
    stop,
    isEnded,
    message: sentMessage,
  };
}

// function disableAllComponents(components: ActionRow<MessageActionRowComponent>[]) {
//   // return JSON.parse(JSON.stringify(components));
//   return components.map((row) => {
//     if (row instanceof ActionRow<ButtonComponent>) {
//       const _components = row.components.map((component) => {
//         const _component = component as ButtonComponent;
//         return ButtonBuilder.from(_component).setDisabled(true);
//       });
//       return new ActionRowBuilder<ButtonBuilder>().addComponents(_components);
//     }
//     if (row instanceof ActionRow<StringSelectMenuComponent>) {
//       const _components = row.components.map((component) => {
//         const _component = component as StringSelectMenuComponent;
//         return StringSelectMenuBuilder.from(_component).setDisabled(true);
//       });
//       return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(_components);
//     }
//     // UserSelectMenuComponent
//     // RoleSelectMenuComponent
//     // MentionableSelectMenuComponent
//     // ChannelSelectMenuComponent
//
//     // const _row = row.components.map((component) => {
//     //   if (component instanceof ButtonComponent) {
//     //     return ButtonBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof StringSelectMenuComponent) {
//     //     return StringSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof UserSelectMenuComponent) {
//     //     return UserSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof RoleSelectMenuComponent) {
//     //     return RoleSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else if (component instanceof MentionableSelectMenuComponent) {
//     //     return MentionableSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   } else {
//     //     return ChannelSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//     //   }
//     // });
//     // return ActionRowBuilder.from(_row).toJSON();
//   });
// }
