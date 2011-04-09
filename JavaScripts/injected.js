//
// Dispatchers
//

/*
function dispatchMessage(msg) {
  console.log("injected.dispatchMessage: " + msg.name);

  switch(msg.name) {
    case "reconfigureQuickTranslationShortcut": handleReconfigureQuickTranslationShortcut(msg);
  }
}
 safari.self.addEventListener("message", dispatchMessage, false)
*/

function dispatchContextMenu(e) {
  safari.self.tab.setContextMenuEventUserInfo(e, e.target.getSelectionText());
}

function dispatchValidate() {
}


//
// Actions
//

var tab = safari.self.tab;
var keyboard = new Keyboard({
    defaultEventType: 'keyup',
    events: {
        "alt+shift+d": openDictionaryPage
    },
    active: true
});


function openDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translate", selectedText);
  }
}



//
// UI
//

// document.addEvent("dblclick", openDictionaryPage);
document.addEvent("contextmenu", dispatchContextMenu);
document.addEvent("validate",    dispatchValidate);