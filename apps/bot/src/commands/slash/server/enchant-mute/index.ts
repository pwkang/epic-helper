import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.enchantMute.name,
  description: SLASH_COMMAND.server.enchantMute.description,
  type: 'subcommandGroup',
  commandName: SLASH_COMMAND.server.name,
};
