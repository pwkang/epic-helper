import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.admins.name,
  description: SLASH_COMMAND.server.admins.description,
  type: 'subcommandGroup',
  commandName: SLASH_COMMAND.server.name,
};
