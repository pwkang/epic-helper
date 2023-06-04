import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
  MessageCreateOptions,
} from 'discord.js';
import {generateNavigationRow} from '../../utils/paginationRow';
import sendInteractiveMessage from '../discord.js/message/sendInteractiveMessage';
import replyInteraction from '../discord.js/interaction/replyInteraction';
import sendMessage from '../discord.js/message/sendMessage';
import {sleep} from '../../utils/sleep';

type TActionType =
  | {message: Message; interaction?: never}
  | {message?: never; interaction: ChatInputCommandInteraction};

type IItemListingHelper = {
  client: Client;
  totalItems: number;
  channelId: string;
  itemsPerPage: number;
  embedFn: (page: number) => Promise<EmbedBuilder>;
} & TActionType;

export const itemListingHelper = async ({
  client,
  totalItems,
  channelId,
  message,
  interaction,
  itemsPerPage,
  embedFn,
}: IItemListingHelper) => {
  let page = 0;
  const pageOptions = await createPage({
    embedFn,
    itemsPerPage,
    totalItems,
    page,
  });
  let event = await generateResponse({
    client,
    message,
    interaction,
    options: pageOptions,
  });
  if (!event) return;
  const events = {
    prev: () => page--,
    next: () => page++,
    last: () => (page = Math.floor(totalItems / itemsPerPage)),
    first: () => {
      page = 0;
    },
  };
  for (const [key, fn] of Object.entries(events)) {
    // @ts-ignore
    event.on(key, () => {
      fn();
      return createPage({
        embedFn,
        itemsPerPage,
        page,
        totalItems,
      });
    });
  }
  // @ts-ignore
  event.on('all', async () => {
    showAllItems({
      channelId,
      client,
      totalItems,
      embedFn,
      itemsPerPage,
    });
    return {
      content: '‍',
      embeds: [],
      components: [],
    };
  });
};

interface IShowAllItems {
  client: Client;
  embedFn: (page: number) => Promise<EmbedBuilder>;
  totalItems: number;
  channelId: string;
  itemsPerPage: number;
}

const showAllItems = async ({
  client,
  totalItems,
  channelId,
  embedFn,
  itemsPerPage,
}: IShowAllItems) => {
  const totalPage = Math.floor(totalItems / itemsPerPage);
  for (let i = 0; i <= totalPage; i++) {
    const embed = await embedFn(i);
    await sendMessage({
      client,
      channelId,
      options: {
        embeds: [embed],
      },
    });
    await sleep(1500);
  }
};

interface IGenerateResponse {
  message?: Message;
  interaction?: ChatInputCommandInteraction;
  client: Client;
  options: Awaited<ReturnType<typeof createPage>>;
}

const generateResponse = async ({client, message, interaction, options}: IGenerateResponse) => {
  let event;
  if (message) {
    event = await sendInteractiveMessage({
      client,
      channelId: message.channel.id,
      // @ts-ignore
      options,
    });
  } else if (interaction) {
    event = await replyInteraction({
      client,
      interaction,
      // @ts-ignore
      options,
      interactive: true,
    });
  }
  return event;
};

interface ICreatePage {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  embedFn: (page: number) => Promise<EmbedBuilder>;
}

const createPage = async ({
  page,
  totalItems,
  embedFn,
  itemsPerPage,
}: ICreatePage): Promise<
  MessageCreateOptions | InteractionReplyOptions | InteractionUpdateOptions
> => {
  const embed = await embedFn(page);
  const row = generateNavigationRow({
    page,
    total: totalItems,
    all: true,
    itemsPerPage,
  });
  return {
    embeds: [embed],
    components: [row],
  };
};
