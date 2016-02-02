// TODO: remove all console.log()

// enforce https
// TODO: remove debug localhost
if (window.location.host != "127.0.0.1:3000" && window.location.protocol != "https:") {
  window.location.protocol = "https:" + window.location.href.substring(window.location.protocol.length);
}


$(function() {

  var currentProject = "";
  var fileSystem;

  var aceEditor = ace.edit("edittext");
  aceEditor.setTheme("ace/theme/vibrant_ink");
  aceEditor.$blockScrolling = Infinity;
  aceEditor.setOption("wrap", true);
  // aceEditor.getSession().setMode("ace/mode/arendelle");

  history.replaceState({
    mode: "projects"
  }, null, "");


  function sayHello() {

    dropbox.getAccountInfo(function(error, info) {
      if (error) {
        alert(error);
      } else {

        $("#title").velocity({opacity: 0}, {duration: 500, complete: function() {
          $("#title").html("Hello, " + info.name);
          $("#title").velocity({opacity: 1}, {duration: 500})
            .velocity({opacity: 0}, {delay: 1500, duration: 500, complete: function() {
              $("#title").html("Arendelle Studio");
              $("#title").velocity({opacity: 1}, {duration: 500});
            }});
        }});

      }
    });

  }

  function addProjectTile(title, index) {

    // create html
    var newTile =
      // "<div class='tile'><div class='tileoverlay'>Title</div><img src='img/demo.jpg'></div>"

      $("<div>").attr("class", "tile").append(
        $("<div>").attr("class", "tileoverlay").html(title)
      ).append(
        $("<img>")
      )
      .hide().velocity("fadeIn", {duration: 1000, delay: index*200})

    .appendTo("#tilescontainer");

    // check if project is valid
    dropbox.stat(title + "/project.config", function(error) {
      if (error) {
        if (error.status == 404) {
          $(newTile).remove();
        } else {
          alert(error);
        }
      }
    });

    // add preview images
    /*dropbox.makeUrl(title + "/.preview.png", {download: true}, function(error, result) {*/
    dropbox.readFile(title + "/.preview.png", {blob: true}, function(error, data) {
      if (error) {
        if (error.status != 404) alert(error);
      } else {
        $(newTile).find("img").attr("src", URL.createObjectURL(data)).velocity({opacity: 1}, {duration: 1000});
      }
    });

  }

  function openProject(title) {

    currentProject = title;

    // fade out project tiles and update controlbar
    $("#tilescontainer").velocity("fadeOut", {duration: 400, complete: function() {
      $("body").attr("class", "editor");
      // TODO: fix sayHello() overwriting #title problem
      $("#title").html(currentProject);
    }});

    // load project and open editor
    dropbox.readFile(currentProject + "/main.arendelle", function(error, data) {
      if (error) {
        if (error.status != 404) alert(error);
      } else {

        loadFileSystem();

        // $("#edittext").html(data);
        aceEditor.setValue(data, -1);
        $("#editorcontainer").velocity("fadeIn", {duration: 400, delay: 400, complete: function() {
          aceEditor.resize();
          aceEditor.focus();
        }});
      }
    });

  }

  function runProject() {

    $("#editorcontainer").velocity("fadeOut", {duration: 500, complete: function() {
      $("body").attr("class", "screen");
      $("#screen").velocity("fadeIn", {duration: 500});
      // TODO: insert engine here
    }});

  }

  function loadFileSystem() {

    fileSystem = new Arendelle.Directory("", currentProject);
    loadFolderIntoFileSystem(fileSystem);

  }
  function loadFolderIntoFileSystem(folder) {

    dropbox.readdir(currentProject + "/" + folder.Path, function(error, entries, folderStat, entriesStat) {
      if (error) {
        alert(error);
      } else {

        for (var i = 0; i < entries.length; i++) {

          if (entriesStat[i].isFolder) {

            // folder
            var newFolder = new Arendelle.Directory(folder.Path + "/" + entries[i], entries[i]);
            folder.AppendFileObject(newFolder);
            loadFolderIntoFileSystem(newFolder);

          } else {

            // file
            loadFileIntoFileSystem(entries[i], folder);

          }

        }

      }
    });

  }
  function loadFileIntoFileSystem(name, folder) {

    var fileType = name.split(".")[1];
    var space;
    if (fileType == "arendelle") {
      space = false;
    } else if (fileType == "space") {
      space = true;
    } else {
      return; // unsupported filetype
    }

    dropbox.readFile(currentProject + "/" + folder.Path + "/" + name, function(error, data) {
      if (error) {
        alert(error);
      } else {
        var path = folder.Path.replace(/^\//, ''); // TODO: remove
        var file = new Arendelle.File(name.split(".")[0], path, data, space);
        folder.AppendFileObject(file);
        refreshFileBrowser();
      }
    });

  }
  function refreshFileBrowser() {
    console.log(fileSystem);
  }


  // MAIN


  // login to dropbox and load projects
  authDropbox(function() {
    dropbox.readdir("/", function(error, entries) {
      if (error) {
        alert(error);
      } else {
        $("body").attr("class", "projects");
        for (var i = 0; i < entries.length; i++) {
          addProjectTile(entries[i], i);
        }
        sayHello();
      }
    });
  });

  // create project
  $("#controlbar .ion-plus").click(function() {});

  // open project
  $("#tilescontainer").on("click", ".tile", function() {
    openProject($(this).find(".tileoverlay").html());

    // change state
    history.pushState({
      mode: "editor",
      project: currentProject
    }, null, "");

  });

  // run project
  $("#controlbar .ion-play").click(function() {
    runProject();

    // change state
    history.pushState({
      mode: "screen",
      project: currentProject
    }, null, "");

  });

  // scrollbar
  function showScrollbar() {
    $(".hidescrollbar").hide();
    clearTimeout($.data(window.document, "scrollCheck"));
    $.data(window.document, "scrollCheck", setTimeout(function() {
      $(".hidescrollbar").velocity("fadeIn", {duration: 500});
    }, 500));
  }
  $("#tilescontainer").scroll(showScrollbar);
  aceEditor.getSession().on("changeScrollTop", showScrollbar);
  $(".hidescrollbar").hover(function() {
    $(".hidescrollbar").hide();
  });

  // history changes
  $(window).on("popstate", function(e) {

    var state = e.originalEvent.state;
    // console.log(state);
    if (state) {

      // editor -> projects
      if (state.mode == "projects" && $("body").hasClass("editor")) {
        aceEditor.setValue("");
        $("#editorcontainer").velocity("fadeOut", {duration: 500, complete: function() {
          $("body").attr("class", "projects");
          $("#title").html("Arendelle Studio");
          $("#tilescontainer").velocity("fadeIn", {duration: 500});
        }});
      }

      // editor -> screen
      if (state.mode == "screen" && $("body").hasClass("editor")) {
        runProject();
      }

      // projects -> editor
      if (state.mode == "editor" && $("body").hasClass("projects")) {
        openProject(state.project);
      }

      // screen -> editor
      if (state.mode == "editor" && $("body").hasClass("screen")) {
        $("#screen").velocity("fadeOut", {duration: 500, complete: function() {
          $("body").attr("class", "editor");
          $("#title").html(currentProject);
          $("#editorcontainer").velocity("fadeIn", {duration: 500, complete: function() {
            aceEditor.resize();
            aceEditor.focus();
          }});
        }});
      }

    }

  });

});



// APIs
var dropbox = new Dropbox.Client({key: "nz8lcuw00q5zwzr"});
function authDropbox(then) {
  dropbox.authenticate(function(error, client) {
    if (error) {
      alert(error);
    } else {
      then();
    }
  });
}
