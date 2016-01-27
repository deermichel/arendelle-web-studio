$(function() {

  /*$(".tile").css("display", "none");
  $(".tile").each(function(index) {
    $(this).delay(index * 200).fadeIn(1000);
  }); --> CSS ANIMATION!*/

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

  function addProjectTile(title, preview) {

    /*dropbox.makeUrl(title + "/.preview.png", {download: true}, function(error, result) {*/
    dropbox.readFile(title + "/.preview.png", {blob: true}, function(error, data) {
      if (error) {
        alert(error);
      } else {

        $("#tilescontainer").append(
          // "<div class='tile'><div class='tileoverlay'>Title</div><img src='img/demo.jpg'></div>"

          $("<div>").attr("class", "tile").append(
            $("<div>").attr("class", "tileoverlay").html(title)
          ).append(
            $("<img>").attr("src", URL.createObjectURL(data))
          )
          .hide().velocity("fadeIn", {duration: 1000})

        );

      }
    });

  }


  // MAIN


  authDropbox(function() {
    dropbox.readdir("/", function(error, entries) {
      if (error) {
        alert(error);
      } else {
        $("body").attr("class", "projects");
        for (var i = 0; i < entries.length; i++) {
          addProjectTile(entries[i]);
        }
        sayHello();
      }
    });
  });

  $("#tilescontainer").on("click", ".tile", function() {
    $("#tilescontainer").velocity("fadeOut", {duration: 500, complete: function() {
      $("body").attr("class", "editor");
      $("#edittext").velocity("fadeIn", {duration: 500});
    }});
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

  $("#controlbar .ion-chevron-left").click(function() {
    $("#edittext").velocity("fadeOut", {duration: 500, complete: function() {
      $("body").attr("class", "projects");
      $("#tilescontainer").velocity("fadeIn", {duration: 500});
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
