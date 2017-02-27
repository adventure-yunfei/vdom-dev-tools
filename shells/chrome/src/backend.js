import initBackend from 'src/backend'
import Bridge from 'src/bridge'

let listeners = []
const bridge = new Bridge({
  listen (fn) {
    var listener = evt => {
      if (evt.data.name === 'to-page') {
        fn(evt.data.payload)
      }
    }
    window.addEventListener('message', listener)
    listeners.push(listener)
  },
  send (data) {
    window.postMessage({
      name: 'to-devtools',
      payload: data
    }, '*')
  }
})

bridge.on('shutdown', () => {
  listeners.forEach(l => {
    window.removeEventListener('message', l)
  })
  listeners = []
})

initBackend(bridge)

