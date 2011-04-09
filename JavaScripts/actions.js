//
// Dispatchers
//

function dispatchCommand(e) {
  console.log("actions.dispatchValidate");
  switch(e.command) {
    case "translateFromSpanish":    translateFromSpanish(e); break;
    case "translateFromFrench":     translateFromFrench(e); break;
    case "translateFromPortuguese": translateFromPortuguese(e); break;
    case "translateFromItalian":    translateFromItalian(e); break;
  }
}

function dispatchMessage(msg) {
  switch(msg.name) {
    //case "fetchQuickTranslationShortcut": handleFetchQuickTranslationShortcut(msg);
    case "translate":                     handleTranslate(msg); break;
  }
}

function dispatchValidate(e) {
  console.log("actions.dispatchValidate");
}

function dispatchContextMenu(e) {
  if (e.userInfo != null) {
    var primaryLanguage = safari.extension.settings.primaryLanguage;

    if(primaryLanguage != "es") {
      e.contextMenu.appendContextMenuItem("translateFromSpanish",    "Translate from Spanish");
    }
    if(primaryLanguage != "fr") {
      e.contextMenu.appendContextMenuItem("translateFromFrench",     "Translate from French");
    }
    if(primaryLanguage != "pt") {
      e.contextMenu.appendContextMenuItem("translateFromPortuguese", "Translate from Portuguese");
    }
    if(primaryLanguage != "it") {
      e.contextMenu.appendContextMenuItem("translateFromItalian",    "Translate from Italian");
    }
  }
}


//
// Handlers
//

function handleFetchQuickTranslationShortcut(msg) {
  var tab   = safari.application.activeBrowserWindow.activeTab,
      s     = safari.extension.settings;
      value = s.quickTranslationModifier + "+" + s.quickTranslationKey;

  tab.page.dispatchMessage("reconfigureQuickTranslationShortcut", value);

  return tab;
}


function handleTranslate(msg) {
  var s              = safari.extension.settings;

  return translate.apply(this, [s.primaryLanguage, s.translateTo, msg.message]);
}


function translate(from, to, text) {
  var tab = safari.application.activeBrowserWindow.openTab();
  tab.url = translationUrlFor(from, to, text);

  return tab;
}

function translateFromSpanish(e) {
  return translate("es", safari.extension.settings.translateTo, e.userInfo);
}

function translateFromFrench(e) {
  return translate("fr", safari.extension.settings.translateTo, e.userInfo);
}

function translateFromPortuguese(e) {
  return translate("pt", safari.extension.settings.translateTo, e.userInfo);
}

function translateFromItalian(e) {
  return translate("it", safari.extension.settings.translateTo, e.userInfo);
}




function translationUrlFor(from, to, text) {
  if(from == "es" && to == "en") {
    return "http://www.spanishdict.com/translate/" + text;
  }

  /*
  if(from == "pt" && to == "en") {
    return "http://www.portuguesedictionary.net/" + text + ".htm";
  }

  if(from == "fr" && to == "en") {
    return "http://dictionary.reverso.net/french-english/" + text;
  }
  */

  return "http://wordreference.com/" + from + to + "/" + text;
}



//
// Initializers
//

var dispatches = {
  "command"    : dispatchCommand,
  "message"    : dispatchMessage,
  "validate"   : dispatchValidate,
  "contextmenu": dispatchContextMenu
};
Object.each(dispatches, function(eventHandler, eventName) {
  safari.application.addEventListener(eventName, eventHandler, false);
})