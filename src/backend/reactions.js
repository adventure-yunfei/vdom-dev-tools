import * as updateView from './updateView';
import {bridge} from './bridge';
import state from './state';

export default function bindReactions () {
  bridge.on('highlight', ({id}) => updateView.highlight(id));
  bridge.on('select', ({id}) => updateView.select(id))
  bridge.on('toggle-inspect', ({isInspecting}) => {
    state.isInspecting = isInspecting
  })
}

