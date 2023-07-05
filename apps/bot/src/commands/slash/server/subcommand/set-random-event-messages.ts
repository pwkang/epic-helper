import {RPG_RANDOM_EVENTS_COMMAND} from '@epic-helper/constants';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {IServerConfig} from './type';

export const setRandomEventMessages = async ({client, interaction}: IServerConfig) => {
  const log = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.log.replaceAll(' ', '-').toLowerCase()
  );
  const fish = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.fish.replaceAll(' ', '-').toLowerCase()
  );
  const coin = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.coin.replaceAll(' ', '-').toLowerCase()
  );
  const lootbox = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.lootbox.replaceAll(' ', '-').toLowerCase()
  );
  const boss = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.boss.replaceAll(' ', '-').toLowerCase()
  );
  const arena = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.arena.replaceAll(' ', '-').toLowerCase()
  );
  const miniboss = interaction.options.getString(
    RPG_RANDOM_EVENTS_COMMAND.miniboss.replaceAll(' ', '-').toLowerCase()
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
      miniboss: miniboss ? (miniboss === 'clear' ? null : miniboss) : undefined,
    },
  });
  if (!serverAccount) return null;
  djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      embeds: [
        commandHelper.serverSettings.renderRandomEventEmbed({
          guild: interaction.guild!,
          serverAccount,
        }),
      ],
    },
  });
};
