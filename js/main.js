$(function() {

  /*$(".tile").css("display", "none");
  $(".tile").each(function(index) {
    $(this).delay(index * 200).fadeIn(1000);
  }); --> CSS ANIMATION!*/

  var currentProject = "";


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
        $("#edittext").html(data);
        $("#edittext").velocity("fadeIn", {duration: 400, delay: 400});
      }
    });

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

  // open project
  $("#tilescontainer").on("click", ".tile", function() {
    openProject($(this).find(".tileoverlay").html());
  });

  $("#tilescontainer, #edittext").scroll(function() {
    $(".hidescrollbar").hide();
    clearTimeout($.data(this, "scrollCheck"));
    $.data(this, "scrollCheck", setTimeout(function() {
      $(".hidescrollbar").velocity("fadeIn", {duration: 500});
    }, 500));
  });

  $(".hidescrollbar").hover(function() {
    $(".hidescrollbar").hide();
  });

  $("#controlbar .ion-plus").click(function() {

  });

  // go back
  $("#controlbar .ion-chevron-left").click(function() {

    // from editor to project overview
    if ($("body").hasClass("editor")) {
      $("#edittext").velocity("fadeOut", {duration: 500, complete: function() {
        $("body").attr("class", "projects");
        $("#title").html("Arendelle Studio");
        $("#tilescontainer").velocity("fadeIn", {duration: 500});
      }});
    }

    // from screen to editor
    else if ($("body").hasClass("screen")) {
      $("#screen").velocity("fadeOut", {duration: 500, complete: function() {
        $("body").attr("class", "editor");
        $("#title").html(currentProject);
        $("#edittext").velocity("fadeIn", {duration: 500});
      }});
    }

  });

  // run project
  $("#controlbar .ion-play").click(function() {

    $("#edittext").velocity("fadeOut", {duration: 500, complete: function() {
      $("body").attr("class", "screen");
      $("#screen").velocity("fadeIn", {duration: 500});
      // TODO: insert engine here
    }});

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
