import {SLASH_COMMAND_GUILD_NAME, SLASH_COMMAND_GUILD_TOGGLE_NAME} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND_GUILD_TOGGLE_NAME,
  commandName: SLASH_COMMAND_GUILD_NAME,
  description: 'Toggle guild features',
  type: 'subcommandGroup',
};
