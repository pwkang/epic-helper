import {_eventMessageChecker} from './event';
import {_artifactMessageChecker} from './account/artifacts';

const messageChecker = {
  event: _eventMessageChecker,
  artifacts: _artifactMessageChecker,
};

export default messageChecker;
