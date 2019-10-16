define(function() {

  var translationCache = {};
  let translationsFile = undefined;

  // Load translations from the server.
  (async () => {
    let lang = navigator.language.split('-')[0];

    let response = await fetch(`_locales/${lang}/messages.json`);
    // Fallback to english for unsupported languages.
    if (!response.ok) {
      response = await fetch(`_locales/en/messages.json`)
    }

    translationsFile = await response.json();
  })();

  const getTranslatedMessage = (message, subs) => {
    // TODO(fallaciousreasoning): Fix race condition where translations are not loaded when this is called.
    if (!translationsFile)
      return message;

    let translation = translationsFile[message];
    if (!translation)
      return message;

    let result = translation.message ? translation.message : translation;

    // Basic substitution support.
    subs = subs || [];
    for (let i = 0; i < subs.length; ++i) {
      result = result.replace(new RegExp(`\\$${i + 1}`), subs[i]);
    }

    return result;
  };
  
  return {
    //process a chunk of template HTML for i18n strings
    process: function(html) {
      return html.replace(/__MSG_(\w+)__/g, (match, tag) => getTranslatedMessage(tag));
    },
    //process the page for inline strings, marked with .i18n
    page: function() {
      document.querySelectorAll(".i18n").forEach(function(element) {
        var original = element.innerHTML;
        var translated = getTranslatedMessage(original);
        if (translated) element.innerHTML = translated;
        var title = element.getAttribute("title") || "";
        var translatedTitle = getTranslatedMessage(title);
        if (translatedTitle) element.setAttribute("title", translatedTitle);
      });
    },
    //get a message, or return the untranslated text
    //caches results for speed
    get: function(message) {
      //rest params trigger uncached behavior for substitution
      if (!translationCache[message] || arguments.length > 1) {
        var subs = [];
        for (var i = 1; i < arguments.length; i++) subs.push(arguments[i]);
        var translated = getTranslatedMessage(message, subs);
        translationCache[message] = translated;
        return translated;
      }
      return translationCache[message];
    }
  }

});