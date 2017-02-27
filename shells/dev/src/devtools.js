// Create a connection to the background page
import initDevTool from 'src/devtools';
import Bridge from 'src/bridge';

const contentWindow = document.querySelector('iframe').contentWindow

const bridge = new Bridge({
  listen (fn) {
    window.addEventListener('message', function (msg) {
      if (msg.data && msg.data.name === 'to-devtools') {
        fn(msg.data.payload);
      }
    });
  },
  send (payload) {
    contentWindow.postMessage({
      name: 'to-page',
      payload
    }, '*');
  }
})

initDevTool(bridge);

// injectScript(chrome.runtime.getURL('build/backend.js'));

// function injectScript (scriptName, cb) {
//   const src = `
//     var script = document.constructor.prototype.createElement.call(document, 'script');
//     script.src = "${scriptName}";
//     document.documentElement.appendChild(script);
//     script.parentNode.removeChild(script);
//   `
//   chrome.devtools.inspectedWindow.eval(src, function (res, err) {
//     if (err) {
//       console.log(err)
//     }
//     cb()
//   })
// }

function inject (url) {
  /* global XMLHttpRequest */
  const xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.onload = () => {
    contentWindow.postMessage({
      type: 'vdom-dev-tool-inject',
      data: xhr.responseText
    }, '*')
  }
  xhr.send()
}

window.onload = () => {
  inject('./build/backend.js')
}
