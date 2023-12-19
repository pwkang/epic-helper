import {RPG_COMMANDS_KEYWORDS} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

export const searchCmdByKeyword = (searchKeywords: string) => {
  return typedObjectEntries(RPG_COMMANDS_KEYWORDS).filter(([, keywords]) => {
    return keywords.some((keyword) => searchKeywords.includes(keyword));
  }).map(([cmd]) => cmd);
};
