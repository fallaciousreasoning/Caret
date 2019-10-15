define(function() {
  "use strict";

  const settingsStorage = {
    get: async function(keys) {
      // chrome.storage had a special case where undefined keys returns
      // everything in storage.
      if (!keys)
        return { ...localStorage };

      // TODO(fallaciousreasoning): Use localForage.
      if (keys.length !== 1)
        throw new Error("I should probably deal with this...");

      const item = localStorage.getItem(keys[0]);
      return JSON.parse(item);
    },
    set: async function(items) {
      // TODO(fallaciousreasoning): Use localForage.
      for (const key of Object.keys(items))
        localStorage.setItem(key, JSON.stringify(items[key]));
    },
    remove: async function(key) {
      // TODO(fallaciousreasoning): Use localForage.
      delete localStorage[key];
    }
  };

  var ch = {
    fileSystem: {
      chooseEntry: function(options) {
        return new Promise(function(ok, fail) {
          chrome.fileSystem.chooseEntry(options, function(entries) {
            if (chrome.runtime.lastError) return fail(chrome.runtime.lastError);
            ok(entries);
          });
        });
      },
      getDisplayPath: function(entry) {
        return new Promise(ok => chrome.fileSystem.getDisplayPath(entry, ok));
      },
      getWritableEntry: function(entry) {
        return new Promise(ok => chrome.fileSystem.getWritableEntry(entry, ok));
      },
      isRestorable: function(entry) {
        return new Promise(ok => chrome.fileSystem.isRestorable(entry, ok));
      },
      isWritableEntry: function(entry) {
        return new Promise(ok => chrome.fileSystem.isWritableEntry(entry, ok));
      },
      restoreEntry: function(id) {
        return new Promise(ok => chrome.fileSystem.restoreEntry(id, ok));
      }
    },

    notifications: {
      create: function(id, options) {
        return new Promise(ok => chrome.notifications.create(id, options, ok));
      },
      clear: function(id) {
        return new Promise(ok => chrome.notifications.clear(id, ok));
      }
    },

    runtime: {
      getBackgroundPage: function() {
        return new Promise(ok => chrome.runtime.getBackgroundPage(ok));
      },
      getPlatformInfo: function() {
        return new Promise(ok => chrome.runtime.getPlatformInfo(ok));
      },
      requestUpdateCheck: function() {
        return new Promise(function(ok, fail) {
          chrome.runtime.requestUpdateCheck(function(status, details) {
            ok([status, details]);
          });
        })
      },
      sendMessage: function(id, message, options) {
        return new Promise(function(ok, fail) {
          chrome.runtime.sendMessage(id, message, options, function(response) {
            if (chrome.runtime.lastError) return fail(chrome.runtime.lastError);
            ok(response);
          });
        });
      }
    },

    storage: {
      // TODO(fallaciousreasoning): Remove sync storage, doesn't make sense on
      // the web.
      sync: settingsStorage,
      local: settingsStorage
    }
  };

  return ch;
});