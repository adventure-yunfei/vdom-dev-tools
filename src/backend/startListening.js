// import CircularJSON from 'circular-json-es6'
import * as helper from './helper';
import * as actions from './actions';
import * as updateView from './updateView';
import state from './state';

export default function startListeningOnCanvas () {
  window.__CANVAS__.addEventListener('mousemove', (event) => {
    if (state.isInspecting) {
      const vid = helper.getVid(event);
      if (vid !== undefined) {
        updateView.highlight(vid);
        actions.select(vid);
      }
    }
  })

  window.__CANVAS__.addEventListener('click', (event) => {
    if (state.isInspecting) {
      const vid = helper.getVid(event);
      if (vid !== undefined) {
        updateView.select(vid);
        actions.select(vid);
        state.isInspecting = false;
        actions.toggleInspect(false);
      }
    }
  })
}
