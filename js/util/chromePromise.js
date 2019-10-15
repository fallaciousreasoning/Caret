define(function() {
  "use strict";

  const settingsStorage = {
    get: async function(keys) {
      // chrome.storage had a special case where undefined keys returns
      // everything in storage.
      if (!keys)
        return { ...localStorage };

      // TODO(fallaciousreasoning): Use localForage.
      if (Array.isArray(keys)) {
        throw new Error(`I should probably deal with this... (keys were ${keys})`);
      }

      const item = localStorage.getItem(keys);
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
        return window.chooseFileSystemEntries(options);

      },
      getDisplayPath: async function(entry) {
        return entry.name;
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

    // TODO(fallaciousreasoning): Completely remove this.
    notifications: {
      create: function(id, options) {
        return new Promise(ok => chrome.notifications.create(id, options, ok));
      },
      clear: function(id) {
        return new Promise(ok => chrome.notifications.clear(id, ok));
      }
    },

    // TODO(fallaciousreasoning): Completely remove this.
    runtime: {
      getPlatformInfo: async function() {
        return { os: 'win' };
      },
      requestUpdateCheck: async function() {
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