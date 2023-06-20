import {
  BaseInteraction,
  Client,
  DiscordAPIError,
  InteractionReplyOptions,
  InteractionResponse,
  InteractionUpdateOptions,
  StringSelectMenuInteraction,
} from 'discord.js';
import ms from 'ms';
import {logger} from '@epic-helper/utils';

export interface IReplyInteraction {
  client: Client;
  interaction: BaseInteraction;
  interactive?: boolean;
  options: InteractionReplyOptions;
}

export default async function _replyInteraction<T>({
  interaction,
  interactive,
  options,
  client,
}: IReplyInteraction) {
  if (!interaction.isRepliable() || interaction.replied) return;
  let interactionResponse: InteractionResponse | undefined;

  try {
    interactionResponse = await interaction.reply(options);
  } catch (error: DiscordAPIError | any) {
    logger({
      message: error.rawError,
      variant: 'replyInteraction',
      logLevel: 'warn',
    });
  }

  if (!interactive || !interactionResponse) return;
  const channel = interaction.channel;
  if (!channel) return;
  const collector = interactionResponse.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(
    customId: T extends undefined ? string : T,
    callback: (
      collected: BaseInteraction | StringSelectMenuInteraction
    ) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null
  ) {
    collector?.on('collect', async (collected) => {
      if (collected.customId !== customId) return;
      const replyOptions = await callback(collected);
      if (!replyOptions) return;
      await collected.update(replyOptions);
    });
  }

  function stop() {
    collector?.stop();
    collector?.removeAllListeners();
  }

  collector?.on('end', async (collected, reason) => {
    if (reason === 'idle') {
      try {
        await interactionResponse?.edit({
          components: [],
        });
      } catch (error: DiscordAPIError | any) {
        logger({
          message: error.message,
          logLevel: 'warn',
          variant: 'replyInteraction',
        });
      }
    }
  });

  return {
    on,
    stop,
  };
}
