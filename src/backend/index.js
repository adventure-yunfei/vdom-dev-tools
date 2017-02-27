import startListeningOnCanvas from './startListening'
import bindReactions from './reactions';
import * as actions from './actions';
import {setBridge} from './bridge';

function flushOnVDomUpdate () {
  window.addEventListener('message', (e) => {
    if (e.data.type === 'vdom-update') {
      actions.flush();
    }
  })
}

export default function initBackend (bridge) {
  setBridge(bridge);
  flushOnVDomUpdate();
  actions.flush();
  bindReactions();
  startListeningOnCanvas()
}
