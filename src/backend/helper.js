function getMouseRay (event, camera) {
  const canvas = event.target
  const THREE = window.THREE
  const mouse = new THREE.Vector2()
  mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1
  mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  return raycaster
}

export function getVidByMesh (node) {
  let id = node.vid
  while (!id) {
    node = node.parent
    if (!node) {
      break
    }
    id = node.vid
  }
  return id
}

export function getMeshByVid (vid) {
  return window.__SCENE__.getObjectByProperty('vid', vid);
}

function getMouseTargetByRay (raycaster, scene) {
  const intersects = raycaster.intersectObjects([scene], true)
  if (intersects.length > 0) {
    return intersects[0].object
  }
  return undefined
}

export function getMeshByMouse (event) {
  const mesh = getMouseTargetByRay(getMouseRay(event, window.__CAMERA__), window.__SCENE__)
  return mesh;
}

export function getVid (event) {
  const mesh = getMeshByMouse(event);
  if (mesh) {
    return getVidByMesh(mesh);
  }
}

export function getSerializableStore (vnode) {
  if (!vnode) {
    return
  }
  return {
    type: vnode.type.name,
    // props: vnode.props,
    id: vnode.id,
    children: vnode.children.map(v => getSerializableStore(v))
  }
}
