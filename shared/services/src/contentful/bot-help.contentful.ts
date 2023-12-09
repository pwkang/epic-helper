import {contentfulService} from '../clients/contentful.service';
import type {EntryFieldTypes} from 'contentful';
import {redisHelpCommands} from '../redis/help-commands.redis';
import {toHelpCommands} from '../transformer/help-commands.transformer';
import {toHelpCommandsGroup} from '../transformer/toHelpCommandsGroup.transformer';
import {redisHelpCommandsGroup} from '../redis/help-commands-group.redis';

export interface BotHelpSkeleton {
  contentTypeId: 'epicHelperCommand';
  fields: {
    name: EntryFieldTypes.Text;
    prefixCommands: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    description: EntryFieldTypes.Text;
    usage: EntryFieldTypes.Text;
    type: EntryFieldTypes.Text<'feature' | 'command'>;
  };
}

export const getAllCommands = async () => {
  const cachedData = await redisHelpCommands.get();
  if (cachedData) return toHelpCommands(cachedData);

  const data =
    await contentfulService.withoutUnresolvableLinks.getEntries<BotHelpSkeleton>(
      {
        content_type: 'epicHelperCommand',
        limit: 1000,
      },
    );

  await redisHelpCommands.set(data);
  return toHelpCommands(data);
};

export interface BotHelpGroupSkeleton {
  contentTypeId: 'epicHelperCommandsGroup';
  fields: {
    name: EntryFieldTypes.Text;
    fieldLabel: EntryFieldTypes.Text;
    commands: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<BotHelpSkeleton>>;
    order: EntryFieldTypes.Integer;
    type: EntryFieldTypes.Text<'commands' | 'features'>;
  };
}

export const getAllCommandsGroup = async () => {
  const cachedData = await redisHelpCommandsGroup.get();
  if (cachedData) return toHelpCommandsGroup(cachedData);

  const data =
    await contentfulService.withoutUnresolvableLinks.getEntries<BotHelpGroupSkeleton>(
      {
        content_type: 'epicHelperCommandsGroup',
        order: ['fields.order'],
        limit: 1000,
      },
    );
  await redisHelpCommandsGroup.set(data);
  return toHelpCommandsGroup(data);
};
