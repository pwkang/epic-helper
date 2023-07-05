import {SlashCommandBuilder} from 'discord.js';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'bot-help',
  builder: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all commands or information of the bot'),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {},
};
