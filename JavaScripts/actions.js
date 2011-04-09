//
// Dispatchers
//

function dispatchCommand(e) {
  console.log("actions.dispatchCommand: " + e.command);
  switch(e.command) {
    case "translateFromSpanish":    translateFromSpanish(e.userInfo); break;
    case "translateFromFrench":     translateFromFrench(e.userInfo); break;
    case "translateFromPortuguese": translateFromPortuguese(e.userInfo); break;
    case "translateFromItalian":    translateFromItalian(e.userInfo); break;
  }
}

function dispatchMessage(msg) {
  switch(msg.name) {
    //case "fetchQuickTranslationShortcut": handleFetchQuickTranslationShortcut(msg);
    case "translate":   handleTranslate(msg); break;

    case "translate":               handleTranslate(msg.message);               break;
    case "translateFromSpanish":    handleTranslateFromSpanish(msg.message);    break;
    case "translateFromFrench":     handleTranslateFromFrench(msg.message);     break;
    case "translateFromPortuguese": handleTranslateFromPortuguese(msg.message); break;
    case "translateFromItalian":    handleTranslateFromItalian(msg.message);    break;
  }
}

function dispatchValidate(e) {
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


function handleTranslate(text) {
  var s              = safari.extension.settings;

  return translate.apply(this, [s.primaryLanguage, s.translateTo, text]);
}

function handleTranslateFromSpanish(text) {
  var s              = safari.extension.settings;

  return translate.apply(this, ["es", s.translateTo, text]);
}

function handleTranslateFromFrench(text) {
  var s              = safari.extension.settings;

  return translate.apply(this, ["fr", s.translateTo, text]);
}

function handleTranslateFromPortuguese(text) {
  var s              = safari.extension.settings;

  return translate.apply(this, ["pt", s.translateTo, text]);
}

function handleTranslateFromItalian(text) {
  var s              = safari.extension.settings;

  return translate.apply(this, ["it", s.translateTo, text]);
}




function translate(from, to, text) {
  var tab = safari.application.activeBrowserWindow.openTab();
  tab.url = translationUrlFor(from, to, text);

  return tab;
}

function translateFromSpanish(text) {
  return translate("es", safari.extension.settings.translateTo, text);
}

function translateFromFrench(text) {
  return translate("fr", safari.extension.settings.translateTo, text);
}

function translateFromPortuguese(text) {
  return translate("pt", safari.extension.settings.translateTo, text);
}

function translateFromItalian(text) {
  return translate("it", safari.extension.settings.translateTo, text);
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