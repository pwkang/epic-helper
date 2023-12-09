import {
  RPG_RANDOM_EVENTS_COMMAND,
  RPG_RANDOM_EVENTS_NAME,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../lib/epic-helper/command-helper/server-settings/constant';
import {SLASH_COMMAND} from '../constant';
import {serverService} from '@epic-helper/services';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.randomEvents.name,
  description: SLASH_COMMAND.server.randomEvents.description,
  commandName: SLASH_COMMAND.server.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.log.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.log),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.fish.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.fish),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.coin.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.coin),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.lootbox.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.lootbox),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.boss.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.boss),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.arena.replaceAll(' ', '-').toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.arena),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.miniboss
              .replaceAll(' ', '-')
              .toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.miniboss),
      )
      .addStringOption((option) =>
        option
          .setName(
            RPG_RANDOM_EVENTS_COMMAND.santevil
              .replaceAll(' ', '-')
              .toLowerCase(),
          )
          .setDescription(RPG_RANDOM_EVENTS_NAME.santevil),
      )
  ,
  execute: async (client, interaction) => {
    const log = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.log.replaceAll(' ', '-').toLowerCase(),
    );
    const fish = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.fish.replaceAll(' ', '-').toLowerCase(),
    );
    const coin = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.coin.replaceAll(' ', '-').toLowerCase(),
    );
    const lootbox = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.lootbox.replaceAll(' ', '-').toLowerCase(),
    );
    const boss = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.boss.replaceAll(' ', '-').toLowerCase(),
    );
    const arena = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.arena.replaceAll(' ', '-').toLowerCase(),
    );
    const miniboss = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.miniboss.replaceAll(' ', '-').toLowerCase(),
    );
    const santevil = interaction.options.getString(
      RPG_RANDOM_EVENTS_COMMAND.santevil.replaceAll(' ', '-').toLowerCase(),
    );

    const serverAccount = await serverService.updateRandomEvents({
      serverId: interaction.guildId!,
      randomEvents: {
        log: log ? (log === 'clear' ? null : log) : undefined,
        fish: fish ? (fish === 'clear' ? null : fish) : undefined,
        coin: coin ? (coin === 'clear' ? null : coin) : undefined,
        lootbox: lootbox ? (lootbox === 'clear' ? null : lootbox) : undefined,
        boss: boss ? (boss === 'clear' ? null : boss) : undefined,
        arena: arena ? (arena === 'clear' ? null : arena) : undefined,
        miniboss: miniboss
          ? miniboss === 'clear'
            ? null
            : miniboss
          : undefined,
        santevil: santevil
          ? santevil === 'clear'
            ? null
            : santevil
          : undefined,
      },
    });
    if (!serverAccount) return null;
    const serverSettings = await commandHelper.serverSettings.settings({
      server: interaction.guild!,
      client,
    });
    if (!serverSettings) return null;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: serverSettings.render({
        type: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
        displayOnly: true,
      }),
    });
  },
};
