define([
  "command",
  "storage/settingsProvider"
], function(command, Settings) {

  var setTheme = async function() {
    var data = await Settings.pull("user");
    var themes = {
      "dark": "css/caret-dark.css",
      "twilight": "css/caret-twilight.css",
      "light": "css/caret.css"
    };
    var theme = data.user.uiTheme || "light";
    var url = themes[theme] || themes.dark;
    document.querySelector("#theme").setAttribute("href", url);
  };
  setTheme();
  command.on("init:restart", setTheme);
  
  if (document.fullscreenElement) {
    document.body.classList.add("fullscreened");
  }

  command.on("app:restart", function() {
    location.reload();
  });

  //developer command for reloading CSS
  command.on("app:reload-css", function() {
    var link = document.querySelector("link#theme");
    link.href = link.href;
  });

  //handle immersive fullscreen
  var onFullscreen = function() {
    document.body.classList.add("fullscreened");
    Settings.pull("user").then(function(data) {
      if (data.user.immersiveFullscreen) {
        document.body.classList.add("immersive");
        editor.resize();
      }
    });
  }

  // Handle fullscreen changes.
  document.addEventListener('fullscreenchange', event => {
    if (document.fullscreenElement)
     onFullscreen();
  });

  //kill middle clicks if not handled
  document.body.addEventListener("click", function(e) {
    if (e.button == 1) {
      e.preventDefault();
    }
  });

});