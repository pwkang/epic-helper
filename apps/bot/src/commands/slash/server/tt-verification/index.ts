import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.ttVerification.name,
  description: SLASH_COMMAND.server.ttVerification.description,
  type: 'subcommandGroup',
  commandName: SLASH_COMMAND.server.name
};
