import {RPG_CLICKABLE_SLASH_COMMANDS, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {IUserReminder, IUserReminderPropsCondition} from '@epic-helper/models';

interface IParseSlash {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const _parseSlash = (data: IUserReminder) => {
  switch (data.type) {
    case RPG_COMMAND_TYPE.hunt:
      return RPG_CLICKABLE_SLASH_COMMANDS.hunt;
    case RPG_COMMAND_TYPE.adventure:
      return RPG_CLICKABLE_SLASH_COMMANDS.adventure;
    case RPG_COMMAND_TYPE.training:
      return data.props?.ultraining
        ? RPG_CLICKABLE_SLASH_COMMANDS.ultraining
        : RPG_CLICKABLE_SLASH_COMMANDS.training;
    case RPG_COMMAND_TYPE.quest:
      return data.props?.epicQuest
        ? RPG_CLICKABLE_SLASH_COMMANDS.epicQuest
        : RPG_CLICKABLE_SLASH_COMMANDS.quest;
    case RPG_COMMAND_TYPE.daily:
      return RPG_CLICKABLE_SLASH_COMMANDS.daily;
    case RPG_COMMAND_TYPE.weekly:
      return RPG_CLICKABLE_SLASH_COMMANDS.weekly;
    case RPG_COMMAND_TYPE.vote:
      return RPG_CLICKABLE_SLASH_COMMANDS.vote;
    case RPG_COMMAND_TYPE.duel:
      return RPG_CLICKABLE_SLASH_COMMANDS.duel;
    case RPG_COMMAND_TYPE.horse:
      return `${RPG_CLICKABLE_SLASH_COMMANDS.horseBreeding} ${RPG_CLICKABLE_SLASH_COMMANDS.horseRace}`;
    case RPG_COMMAND_TYPE.arena:
      return `${RPG_CLICKABLE_SLASH_COMMANDS.arena} ${RPG_CLICKABLE_SLASH_COMMANDS.bigArena}`;
    case RPG_COMMAND_TYPE.dungeon:
      return `${RPG_CLICKABLE_SLASH_COMMANDS.dungeon} ${RPG_CLICKABLE_SLASH_COMMANDS.miniboss}`;
    case RPG_COMMAND_TYPE.pet:
      return `${RPG_CLICKABLE_SLASH_COMMANDS.petClaim} ${RPG_CLICKABLE_SLASH_COMMANDS.petAdventure}`;
    case RPG_COMMAND_TYPE.working:
      return data.props?.workingType
        ? RPG_CLICKABLE_SLASH_COMMANDS[data.props?.workingType]
        : RPG_CLICKABLE_SLASH_COMMANDS.chop;
    case RPG_COMMAND_TYPE.farm:
      return RPG_CLICKABLE_SLASH_COMMANDS.farm;
    case RPG_COMMAND_TYPE.lootbox:
      return RPG_CLICKABLE_SLASH_COMMANDS.lootbox;
    case RPG_COMMAND_TYPE.epicItem:
      return RPG_CLICKABLE_SLASH_COMMANDS.epicItem;
    default:
      return '';
  }
};
