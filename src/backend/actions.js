import * as helper from './helper';
import {bridge} from './bridge';

export function flush () {
  bridge.send('flush', {
    root: helper.getSerializableStore(window.__VNODE_STORE__['0'])
  })
}

export function select (id) {
  bridge.send('select', {
    selectedId: id
  })
}

export function toggleInspect (isInspecting) {
  bridge.send('toggle-inspect', {
    isInspecting
  })
}

