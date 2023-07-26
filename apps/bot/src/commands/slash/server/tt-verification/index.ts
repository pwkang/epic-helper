import {SLASH_COMMAND_SERVER_NAME, SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND_SERVER_TT_VERIFICATION_NAME,
  commandName: SLASH_COMMAND_SERVER_NAME,
  type: 'subcommandGroup',
  description: 'TT Verification',
};
