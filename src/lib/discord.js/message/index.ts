import _sendMessage from './_sendMessage';
import _deleteMessage from './_deleteMessage';
import _editMessage from './_editMessage';
import _replyMessage from './_replyMessage';
import _sendInteractiveMessage from './_sendInteractiveMessage';

export const djsMessageHelper = {
  send: _sendMessage,
  delete: _deleteMessage,
  edit: _editMessage,
  reply: _replyMessage,
  interactiveSend: _sendInteractiveMessage,
};
