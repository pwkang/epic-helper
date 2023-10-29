import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.donorRoles.name,
  description: SLASH_COMMAND.server.donorRoles.description,
  type: 'subcommandGroup',
  commandName: SLASH_COMMAND.server.name,
};
