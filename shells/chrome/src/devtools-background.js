// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the VDOM panel; otherwise poll
// for 10 seconds.

let checkCount = 0

chrome.devtools.network.onNavigated.addListener(createPanelIfHasVue)
const checkVueInterval = setInterval(createPanelIfHasVue, 1000)
createPanelIfHasVue()

function createPanelIfHasVue () {
  if (checkCount++ > 10) {
    clearInterval(checkVueInterval)
    console.log('could not init the dev tool')
    return
  }
  chrome.devtools.inspectedWindow.eval(
    '!!(window.__VNODE_STORE__ && window.__CAMERA__ && window.__SCENE__ && window.THREE)',
    function (hasVue) {
      if (!hasVue) {
        return
      }
      clearInterval(checkVueInterval)
      chrome.devtools.panels.create(
        'VDOM', 'icons/128.png', 'devtools.html',
        function (panel) {
          // panel loaded
        }
      )
    }
  )
}
