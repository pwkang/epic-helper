import {BOT_EMOJI, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import type {ValuesOf} from '@epic-helper/types';

interface IParseEmoji {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const _parseEmoji = ({type}: IParseEmoji) => {
  switch (type) {
    case RPG_COMMAND_TYPE.hunt:
      return BOT_EMOJI.animated.hunt;
    case RPG_COMMAND_TYPE.adventure:
      return BOT_EMOJI.animated.adventure;
    case RPG_COMMAND_TYPE.training:
      return BOT_EMOJI.animated.training;
    case RPG_COMMAND_TYPE.quest:
      return BOT_EMOJI.animated.quest;
    case RPG_COMMAND_TYPE.daily:
      return BOT_EMOJI.animated.daily;
    case RPG_COMMAND_TYPE.weekly:
      return BOT_EMOJI.animated.weekly;
    case RPG_COMMAND_TYPE.vote:
      return BOT_EMOJI.animated.vote;
    case RPG_COMMAND_TYPE.duel:
      return BOT_EMOJI.animated.duel;
    case RPG_COMMAND_TYPE.horse:
      return BOT_EMOJI.animated.horse;
    case RPG_COMMAND_TYPE.arena:
      return BOT_EMOJI.animated.arena;
    case RPG_COMMAND_TYPE.dungeon:
      return BOT_EMOJI.animated.dungeon;
    case RPG_COMMAND_TYPE.pet:
      return '';
    case RPG_COMMAND_TYPE.working:
      return BOT_EMOJI.animated.working;
    case RPG_COMMAND_TYPE.farm:
      return BOT_EMOJI.animated.farm;
    case RPG_COMMAND_TYPE.lootbox:
      return BOT_EMOJI.animated.lootboxes;
    case RPG_COMMAND_TYPE.epicItem:
      return BOT_EMOJI.animated.epicItems;
    default:
      return '';
  }
};
