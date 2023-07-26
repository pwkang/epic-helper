import {BaseInteraction, ChatInputCommandInteraction, Client, Events, User} from 'discord.js';
import {userService} from '../../services/database/user.service';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import embedProvider from '../../lib/epic-helper/embeds';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import interaction from '../../lib/discordjs/interaction';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    if (interaction.isChatInputCommand()) {
      const command = searchSlashCommand(client, interaction);

      if (!command) return;

      const toExecute = await preCheckSlashCommand({
        client,
        interaction,
        preCheck: command.preCheck,
        author: interaction.user,
      });
      if (!toExecute) return;

      await command.execute(client, interaction);
    }
  },
};

const searchSlashCommand = (client: Client, interaction: BaseInteraction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand()) return null;
  const commandName = interaction.commandName;
  const subcommandGroupName = interaction.options.getSubcommandGroup();
  const subcommandName = interaction.options.getSubcommand();
  const searchCommandName = [commandName, subcommandGroupName, subcommandName]
    .filter((name) => !!name)
    .join(' ');
  return client.slashCommands.get(searchCommandName);
};

interface IPreCheckSlashCommand {
  client: Client;
  preCheck: PrefixCommand['preCheck'];
  interaction: BaseInteraction;
  author: User;
}

const preCheckSlashCommand = async ({
  preCheck,
  interaction,
  client,
  author,
}: IPreCheckSlashCommand) => {
  const status: Record<keyof SlashCommand['preCheck'], boolean> = {
    userNotRegistered: true,
    userAccOff: true,
  };
  const userAccount = await userService.getUserAccount(author.id);
  if (preCheck.userNotRegistered !== undefined) {
    switch (preCheck.userNotRegistered) {
      case USER_NOT_REGISTERED_ACTIONS.skip:
        status.userNotRegistered = true;
        break;
      case USER_NOT_REGISTERED_ACTIONS.abort:
        status.userNotRegistered = !!userAccount;
        break;
      case USER_NOT_REGISTERED_ACTIONS.askToRegister:
        status.userNotRegistered = !!userAccount;
        if (!userAccount)
          await djsInteractionHelper.replyInteraction({
            client,
            interaction,
            options: {
              embeds: [
                embedProvider.howToRegister({
                  author,
                }),
              ],
              ephemeral: true,
            },
          });
        break;
    }
  }

  if (preCheck.userAccOff !== undefined) {
    switch (preCheck.userAccOff) {
      case USER_ACC_OFF_ACTIONS.skip:
        status.userAccOff = true;
        break;
      case USER_ACC_OFF_ACTIONS.abort:
        status.userAccOff = !!userAccount?.config.onOff;
        break;
      case USER_ACC_OFF_ACTIONS.askToTurnOn:
        status.userAccOff = !!userAccount?.config.onOff;
        if (!userAccount?.config.onOff)
          await djsInteractionHelper.replyInteraction({
            client,
            interaction,
            options: {
              embeds: [embedProvider.turnOnAccount()],
              ephemeral: true,
            },
          });
        break;
    }
  }

  return Object.values(status).every((value) => value);
};
