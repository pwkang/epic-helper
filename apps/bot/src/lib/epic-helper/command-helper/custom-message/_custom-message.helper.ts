import {_getCustomMessageEmbed} from './custom-message.embed';
import {_customMessagePageSelector} from './custom-message.components';
import {_getMessageOptions} from './custom-message.message-options';

export const _customMessageHelper = {
  renderEmbed: _getCustomMessageEmbed,
  renderPageSelector: _customMessagePageSelector,
  getMessageOptions: _getMessageOptions,
};
