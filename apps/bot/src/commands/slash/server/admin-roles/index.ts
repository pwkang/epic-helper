import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.adminRoles.name,
  description: SLASH_COMMAND.server.adminRoles.description,
  type: 'subcommandGroup',
  commandName: SLASH_COMMAND.server.name,
};
