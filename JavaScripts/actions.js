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


/* A helper that factors out structural duplication between handlers */
function languageSpecificTranslationHandlerFor(targetLanguage) {
  return function(text) {
    var s              = safari.extension.settings;

    return translate.apply(this, [targetLanguage, s.translateTo, text]);
  };
}

var handleTranslateFromSpanish    = languageSpecificTranslationHandlerFor("es");
var handleTranslateFromFrench     = languageSpecificTranslationHandlerFor("fr");
var handleTranslateFromPortuguese = languageSpecificTranslationHandlerFor("pt");
var handleTranslateFromItalian    = languageSpecificTranslationHandlerFor("it");




function translate(from, to, text) {
  var tab = safari.application.activeBrowserWindow.openTab();
  tab.url = translationUrlFor(from, to, text);

  return tab;
}

/* Another helper that factors out structural duplication */
function languageSpecificTranslationFor(targetLanguage) {
  return function(text) {
    return translate(targetLanguage, safari.extension.settings.translateTo, text);
  };
}

var translateFromSpanish    = languageSpecificTranslationFor("es");
var translateFromFrench     = languageSpecificTranslationFor("fr");
var translateFromPortuguese = languageSpecificTranslationFor("pt");
var translateFromItalian    = languageSpecificTranslationFor("it");





function translationUrlFor(from, to, text) {
  /*
  if(from == "es" && to == "en") {
    return "http://www.spanishdict.com/translate/" + text;
  }

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