import {_createGlobalSlashCommand} from './_createGlobalSlashCommand';
import {_getGlobalSlashCommands} from './_getGlobalSlashCommands.lib';
import {_deleteGlobalSlashCommand} from './_deleteGlobalSlashCommand';
import {_createGuildSlashCommand} from './_createGuildSlashCommand';
import {_deleteGuildSlashCommand} from './_deleteGuildSlashCommand';
import {_getGuildSlashCommands} from './_getGuildSlashCommands.lib';
import {_findGuildSlashCommand} from './_findGuildSlashCommand.lib';

const djsRestHelper = {
  slashCommand: {
    global: {
      createOne: _createGlobalSlashCommand,
      getAll: _getGlobalSlashCommands,
      deleteOne: _deleteGlobalSlashCommand,
    },
    guild: {
      createOne: _createGuildSlashCommand,
      deleteOne: _deleteGuildSlashCommand,
      getAll: _getGuildSlashCommands,
      findOne: _findGuildSlashCommand,
    },
  },
};

export default djsRestHelper;
