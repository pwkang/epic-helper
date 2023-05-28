import {
  BaseInteraction,
  Client,
  InteractionReplyOptions,
  InteractionUpdateOptions,
} from 'discord.js';
import ms from 'ms';

interface IReplyInteraction {
  client: Client;
  interaction: BaseInteraction;
  interactive?: boolean;
  options: InteractionReplyOptions;
}

export default async function replyInteraction({
  interaction,
  client,
  interactive,
  options,
}: IReplyInteraction) {
  if (!interaction.isRepliable() || interaction.replied) return;

  const interactionResponse = await interaction.reply(options).catch(console.error);
  if (!interactive || !interactionResponse) return;
  const channel = interaction.channel;
  if (!channel) return;
  const collector = interactionResponse.createMessageComponentCollector({
    idle: ms('1m'),
  });

  function on(
    customId: string,
    callback: (
      collected: BaseInteraction
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

  collector?.on('end', (collected, reason) => {
    if (reason === 'idle') {
      interactionResponse
        .edit({
          components: [],
        })
        .catch(console.error);
    }
  });

  return {
    on,
    stop,
  };
}
