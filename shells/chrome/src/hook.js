chrome.runtime.onMessage.addListener(function (e) {
  if (e.name === 'to-page') {
    window.postMessage(e, '*');
  }
});

window.addEventListener('message', e => {
  if (e.source === window && e.data && e.data.name === 'to-devtools') {
    chrome.runtime.sendMessage(e.data);
  }
})
