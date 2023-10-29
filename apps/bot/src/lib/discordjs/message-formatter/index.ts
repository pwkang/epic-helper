import {_formatUser} from './_user';
import {_formatChannel} from './_channel';
import {_formatRole} from './_role';
import {_getInfoFromMessageUrl, _messageUrl} from './_message-url';

const messageFormatter = {
  user: _formatUser,
  channel: _formatChannel,
  role: _formatRole,
  messageUrl: _messageUrl,
  getInfoFromMessageUrl: _getInfoFromMessageUrl,
  hyperlink: (text: string, url: string) => `[${text}](${url})`,
};

export default messageFormatter;
