// Create a connection to the background page
import initDevTool from 'src/devtools';
import Bridge from 'src/bridge';
var backgroundPageConnection = chrome.runtime.connect({
  name: 'dev-tools'
});

backgroundPageConnection.postMessage({
  name: 'init-dev-tools-connection',
  tabId: chrome.devtools.inspectedWindow.tabId
});

const bridge = new Bridge({
  listen (fn) {
    backgroundPageConnection.onMessage.addListener(function (msg) {
      if (msg.name === 'to-devtools') {
        fn(msg.payload);
      }
    });
  },
  send (payload) {
    backgroundPageConnection.postMessage({
      name: 'to-page',
      payload
    });
  }
})

initDevTool(bridge);

injectScript(chrome.runtime.getURL('build/backend.js'));

function injectScript (scriptName, cb) {
  const src = `
    var script = document.constructor.prototype.createElement.call(document, 'script');
    script.src = "${scriptName}";
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);
  `
  chrome.devtools.inspectedWindow.eval(src, function (res, err) {
    if (err) {
      console.log(err)
    }
    cb()
  })
}
