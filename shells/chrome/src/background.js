// background.js
var devToolsConnections = {};

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'dev-tools') {
    let tabId;
    var extensionListener = function (message, sender, sendResponse) {
        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
      if (message.name === 'init-dev-tools-connection') {
        tabId = message.tabId;
        devToolsConnections[message.tabId] = port;
        return;
      }
      if (message.name === 'to-page') {
        chrome.tabs.sendMessage(tabId, message);
      }
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
      port.onMessage.removeListener(extensionListener);
      delete devToolsConnections[tabId];
    });
  }
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (msg.name === 'to-devtools') {
      if (tabId in devToolsConnections) {
        devToolsConnections[tabId].postMessage(msg);
      } else {
        console.log('Tab not found in connection list.');
      }
    } else {
      // other events
    }
  } else {
    console.log('sender.tab not defined.');
  }
  return true;
});
