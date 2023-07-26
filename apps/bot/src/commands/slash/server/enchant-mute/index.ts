import {SLASH_COMMAND_SERVER_ENCHANT_MUTE_NAME, SLASH_COMMAND_SERVER_NAME} from '../constant';

export default <SlashCommand>{
  name: 'enchant-mute',
  commandName: SLASH_COMMAND_SERVER_NAME,
  description: 'Enchant Mute',
  type: 'subcommandGroup',
};
