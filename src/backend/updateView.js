import * as helper from './helper';
import state from './state';

export function highlight (vid) {
  const mesh = helper.getMeshByVid(vid);
  if (mesh) {
    if (state.lastHighlighted) {
      if (mesh === state.lastHighlighted) {
        return;
      }
      window.__SCENE__.remove(state.lastHighlighted._hb);
      state.lastHighlighted._hb = undefined;
    }
    const boudingBox = new window.THREE.BoxHelper(mesh, 0x4CAF50);
    mesh._hb = boudingBox;
    window.__SCENE__.add(boudingBox);
    state.lastHighlighted = mesh;
    window.__UPDATE__();
  }
}

export function select (vid) {
  const mesh = helper.getMeshByVid(vid);
  if (mesh) {
    if (state.lastSelected) {
      if (mesh === state.lastSelected) {
        return;
      }
      window.__SCENE__.remove(state.lastSelected._sb);
      state.lastSelected._sb = undefined;
    }
    const boudingBox = new window.THREE.BoxHelper(mesh, 0xF44336);
    mesh._sb = boudingBox;
    window.__SCENE__.add(boudingBox);
    state.lastSelected = mesh;
    window.__UPDATE__();
  }
}
