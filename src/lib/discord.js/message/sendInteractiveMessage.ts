import {
  ActionRow,
  ActionRowBuilder,
  AnyComponentBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonComponent,
  Client,
  ComponentBuilder,
  InteractionUpdateOptions,
  MessageActionRowComponent,
  MessageCreateOptions,
  MessagePayload,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
} from 'discord.js';
import sendMessage from './sendMessage';
import ms from 'ms';
import editMessage from './editMessage';

interface SendInteractiveMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function sendInteractiveMessage({
  channelId,
  options,
  client,
}: SendInteractiveMessageProps) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  const sentMessage = await sendMessage({
    channelId,
    client,
    options,
  });

  const collector = sentMessage?.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(
    customId: string,
    callback: (
      collected: BaseInteraction
    ) => Promise<InteractionUpdateOptions> | InteractionUpdateOptions
  ) {
    collector?.on('collect', async (collected) => {
      if (collected.customId !== customId) return;
      const replyMsg = await callback(collected);
      if (!replyMsg) return;
      await collected.update(replyMsg);
    });
  }

  function stop() {
    collector?.stop();
  }

  collector?.on('end', () => {
    if (!sentMessage) return;
    editMessage({
      client,
      message: sentMessage,
      options: {
        content: sentMessage.content,
        embeds: sentMessage.embeds,
        components: [], // todo: make all components disabled instead of remove it
      },
    });
  });

  return {
    on,
    stop,
  };
}

// function disableAllComponents(components: any) {
//   return JSON.parse(JSON.stringify(components));
// return components.map((row) => {
//   if (row instanceof ActionRow<ButtonComponent>) {
//     const _components = row.components.map((component) => {
//       const _component = component as ButtonComponent;
//       return ButtonBuilder.from(_component).setDisabled(true);
//     });
//     return new ActionRowBuilder<ButtonBuilder>().addComponents(_components);
//   }
//
//   // StringSelectMenuComponent
//   if (row instanceof ActionRow<StringSelectMenuComponent>) {
//     const _components = row.components.map((component) => {
//       const _component = component as StringSelectMenuComponent;
//       return StringSelectMenuBuilder.from(_component).setDisabled(true);
//     });
//     return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(_components);
//   }
//   // UserSelectMenuComponent
//   // RoleSelectMenuComponent
//   // MentionableSelectMenuComponent
//   // ChannelSelectMenuComponent
//
//   // const _row = row.components.map((component) => {
//   //   if (component instanceof ButtonComponent) {
//   //     return ButtonBuilder.from(component).setDisabled(true).toJSON();
//   //   } else if (component instanceof StringSelectMenuComponent) {
//   //     return StringSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//   //   } else if (component instanceof UserSelectMenuComponent) {
//   //     return UserSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//   //   } else if (component instanceof RoleSelectMenuComponent) {
//   //     return RoleSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//   //   } else if (component instanceof MentionableSelectMenuComponent) {
//   //     return MentionableSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//   //   } else {
//   //     return ChannelSelectMenuBuilder.from(component).setDisabled(true).toJSON();
//   //   }
//   // });
//   // return ActionRowBuilder.from(_row).toJSON();
// });
// }
