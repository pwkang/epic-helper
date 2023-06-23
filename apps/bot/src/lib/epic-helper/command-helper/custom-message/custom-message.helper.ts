import {_getCustomMessageEmbed} from './custom-message.embed';
import {_customMessagePageSelector} from './custom-message.components';
import {_getMessageOptions} from './custom-message.message-options';

const customMessageHelper = {
  renderEmbed: _getCustomMessageEmbed,
  renderPageSelector: _customMessagePageSelector,
  getMessageOptions: _getMessageOptions,
};

export default customMessageHelper;
