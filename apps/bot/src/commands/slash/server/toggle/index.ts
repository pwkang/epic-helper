import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.toggle.name,
  description: SLASH_COMMAND.server.toggle.description,
  commandName: SLASH_COMMAND.server.name,
  type: 'subcommandGroup',
};
