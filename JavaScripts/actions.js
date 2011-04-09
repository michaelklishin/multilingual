//
// Dispatchers
//

function dispatchCommand() {
}

function dispatchMessage(msg) {
  console.log("actions.dispatchMessage: " + msg.name);

  switch(msg.name) {
    //case "fetchQuickTranslationShortcut": handleFetchQuickTranslationShortcut(msg);
    case "translate":                     handleTranslate(msg);
  }
}

function dispatchValidate() {
}

function dispatchContextMenu() {
}


//
// Handlers
//

function handleFetchQuickTranslationShortcut(msg) {
  var tab   = safari.application.activeBrowserWindow.activeTab,
      s     = safari.extension.settings
      value = s.quickTranslationModifier + "+" + s.quickTranslationKey;

  tab.page.dispatchMessage("reconfigureQuickTranslationShortcut", value);
}


function handleTranslate(msg) {
  var s              = safari.extension.settings;

  translate.apply(this, [s.primaryLanguage, s.translateTo, msg.message]);
}


function translate(from, to, text) {
  var tab = safari.application.activeBrowserWindow.openTab();
  tab.url = translationUrlFor(from, to, text);

  return tab;
}

function translationUrlFor(from, to, text) {
  if(from == "es" && to == "en") {
    return "http://www.spanishdict.com/translate/" + text;
  }

  if(from == "pt" && to == "en") {
    return "http://www.portuguesedictionary.net/" + text + ".htm";
  }

  return "http://wordreference.com/" + from + to + "/" + text;
}



//
// Initializers
//

var dispatches = {
  "command"    : dispatchCommand,
  "message"    : dispatchMessage,
  "validate"   : dispatchValidate,
  "contextmanu": dispatchContextMenu
};
Object.each(dispatches, function(eventHandler, eventName) {
  safari.application.addEventListener(eventName, eventHandler, false);
})