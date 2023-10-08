import type {
  ActionRow,
  MessageActionRowComponent,
  MessageActionRowComponentBuilder
} from 'discord.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponent,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuComponent,
  RoleSelectMenuBuilder,
  RoleSelectMenuComponent,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
  UserSelectMenuBuilder,
  UserSelectMenuComponent
} from 'discord.js';

const disableAllComponents = (
  components: ActionRow<MessageActionRowComponent>[]
) => {
  const row: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  for (const component of components) {
    const _components = component.components.map((component) => {
      if (component instanceof ButtonComponent) {
        return ButtonBuilder.from(component).setDisabled(
          component.style !== ButtonStyle.Link
        );
      } else if (component instanceof StringSelectMenuComponent) {
        return StringSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof UserSelectMenuComponent) {
        return UserSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof RoleSelectMenuComponent) {
        return RoleSelectMenuBuilder.from(component).setDisabled(true);
      } else if (component instanceof MentionableSelectMenuComponent) {
        return MentionableSelectMenuBuilder.from(component).setDisabled(true);
      } else {
        return ChannelSelectMenuBuilder.from(component).setDisabled(true);
      }
    });
    row.push(
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        _components
      )
    );
  }

  return row;
};

export default disableAllComponents;
