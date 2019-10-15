define([
    "util/chromePromise"
  ], function(chromeP) {
  
  /*
  
  The File object provides storage backed by the local HDD via the chrome.fileSystem API.
    
  */
  
  var noop = function() {};
  
  var File = function(entry) {
    this.entry = entry || null;
    this.onWrite = noop;
  };
  
  File.prototype = {
    open: async function(mode) {
      var self = this;
      //mode is "open" or "save"
      var modes = {
        "open": "openFile",
        "save": "saveFile"
      };
      
      var entry = await chromeP.fileSystem.chooseEntry({ type: modes[mode] });
      //cancelling acts like an error, but isn't.
      if (!entry) throw Error('Failed to open file!');
      this.entry = entry;
    },
    
    read: async function() {
      if (!this.entry)
        throw new Error("File not opened");
      
      const file = await this.entry.getFile();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    },
    
    write: async function(data) {
      //guard against cases where we accidentally write before opening
      if (!this.entry) {
        await this.open('save');
      }

      var isWritable = this.entry.createWriter;
      if (!isWritable) {
        throw new Error('File is not writable');
      }

      const writer = await this.entry.createWriter({ createIfNotExists: true });
      
      const blob = new Blob([data]);
      await writer.write(0, blob);
      await writer.truncate(data.length);
      await writer.close();
    },
    
    stat: function() {
      var self = this;
      return new Promise(function(ok, fail) {
        if (self.entry) {
          return self.entry.file(function(f) {
            ok(f);
          });
        }
        fail("No file entry");
      });
    },
    
    retain: function() {
      // TODO(fallaciousreasoning): Add support for retaining files (probably by saving to indexeddb).
      return {
        type: "file",
        id: undefined
      };
    },
    
    restore: async function(id) {
      var isRestorable = await chromeP.fileSystem.isRestorable(id);
      if (isRestorable) {
        var entry = await chromeP.fileSystem.restoreEntry(id);
        if (!entry) throw "restoreEntry() failed for " + id;
        this.entry = entry;
        return entry;
      } else {
        throw "isRestorable() returned false for " + id;
      }
    },
    
    getPath: async function() {
      if (!this.entry) throw "No backing entry, cannot get path";
      var path = await chromeP.fileSystem.getDisplayPath(this.entry);
      return path;
    }
  };
  
  return File;

});