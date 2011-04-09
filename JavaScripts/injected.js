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
        "alt+shift+d": openDictionaryPage,
        "alt+shift+s": openSpanishDictionaryPage,
        "alt+shift+f": openFrenchDictionaryPage,
        "alt+shift+p": openPortugueseDictionaryPage,
        "alt+shift+i": openItalianDictionaryPage,
        "alt+shift+g": openGermanDictionaryPage
    },
    active: true
});


function openDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translate", selectedText);
  }
}

function openSpanishDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translateFromSpanish", selectedText);
  }
}

function openFrenchDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translateFromFrench", selectedText);
  }
}

function openPortugueseDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translateFromPortuguese", selectedText);
  }
}

function openItalianDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translateFromItalian", selectedText);
  }
}

function openGermanDictionaryPage(e) {
  var selectedText = e.target.getSelectionText();

  if (selectedText != null) {
    tab.dispatchMessage("translateFromGerman", selectedText);
  }
}



//
// UI
//

// document.addEvent("dblclick", openDictionaryPage);
document.addEvent("contextmenu", dispatchContextMenu);
document.addEvent("validate",    dispatchValidate);