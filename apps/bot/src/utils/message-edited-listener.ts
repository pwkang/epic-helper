import {TypedEventEmitter} from './typed-event-emitter';
import {Message} from 'discord.js';
import {redisMessageEdited} from '../services/redis/message-edited.redis';
import {EventEmitter} from 'events';

const messageEditedEvent = new EventEmitter();

interface ICreateMessageEditedListener {
  messageId: string;
}

type TEventTypes = {
  edited: [Message];
};

type TExtraProps = {
  stop: () => void;
};

export const createMessageEditedListener = async ({messageId}: ICreateMessageEditedListener) => {
  await redisMessageEdited.register({
    messageId,
  });
  const event = new TypedEventEmitter<TEventTypes>() as TypedEventEmitter<TEventTypes> &
    TExtraProps;

  messageEditedEvent.on(messageId, messageEdited);

  event.stop = () => {
    event.removeAllListeners();
    messageEditedEvent.removeListener(messageId, messageEdited);
  };

  function messageEdited(message: Message) {
    event.emit('edited', message);
  }

  return event;
};

export const emitMessageEdited = async (message: Message) => {
  const messageId = message.id;
  const isEdited = await redisMessageEdited.isEdited({
    messageId,
  });
  if (!isEdited) return;
  messageEditedEvent.emit(messageId, message);
};
