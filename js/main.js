require([
    "command",
    "editor",
    "storage/settingsProvider",
    "ui/dialog",
    "sessions",
    "util/i18n",
    "util/chromePromise",
    "fileManager",
    "api",
    "sequences",
    "ui"
  ], function(command, editor, Settings, dialog, sessions, i18n, chromeP) {

  //translate inline strings
  i18n.page();

  //these are modules that must be loaded before init:complete
  var loadedModules = {
    "editor": false,
    "fileManager": false,
    "sessions": false
  };

  //the settings manager may also fire init:restart to re-init components after startup
  command.fire("init:startup", function(mod) {
    //ignore callback in non-essential modules
    if (typeof loadedModules[mod] == "undefined") return;
    loadedModules[mod] = true;
    for (var key in loadedModules) {
      if (!loadedModules[key]) {
        return;
      }
    }
    //all specified modules are loaded, app is ready for init:complete
    command.fire("init:complete");
  });

  //export update notification preference, possibly others
  command.on("init:restart", async function() {
    var cfg = await Settings.pull("user");
    chromeP.storage.sync.set({
      updateNotifications: cfg.user.updateNotifications
    });
  });

  command.on("app:exit", async function() {
    var cancelled = false;
    var tabs = sessions.getAllTabs();
    for (var tab of tabs) {
      if (tab.modified && (!tab.file || !tab.file.virtual)) {
        var value = await dialog(
          i18n.get("dialogUnsaved", tab.fileName),
          [
            { label: i18n.get("dialogSave"), value: "save", shortcut: "s" },
            { label: i18n.get("dialogDiscard"), value: "discard", shortcut: "n" },
            { label: i18n.get("dialogCancel"), value: "cancel", shortcut: "c" }
          ]);
        if (!value || value == "cancel") {
          cancelled = true;
          break;
        }
        if (value == "save") {
          await tab.save();
        }
      }
    }
    if (!cancelled) window.close();
  });

  //It's nice to be able to launch the debugger from a command stroke
  command.on("app:debug", function() {
    debugger;
  });

  command.on("app:browse", function(url) {
    window.open(url, "target=_blank");
  });

});
