$(function() {

  /*$(".tile").css("display", "none");
  $(".tile").each(function(index) {
    $(this).delay(index * 200).fadeIn(1000);
  }); --> CSS ANIMATION!*/

  $("#content").click(function() {
    //alert("did");
    //var client = new Dropbox.Client({key: "nz8lcuw00q5zwzr"});
    //client.authenticate();
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
    $("#tilescontainer").append(
      // "<div class='tile'><div class='tileoverlay'>Title</div><img src='img/demo.jpg'></div>"

      $("<div>").attr("class", "tile").append(
        $("<div>").attr("class", "tileoverlay").html("Title")
      ).append(
        $("<img>").attr("src", "img/demo.jpg")
      )
      .hide().velocity("fadeIn", {duration: 1000})

    );
  });

  $("#controlbar .ion-chevron-left").click(function() {
    $("#edittext").velocity("fadeOut", {duration: 500, complete: function() {
      $("body").attr("class", "projects");
      $("#tilescontainer").velocity("fadeIn", {duration: 500});
    }});
  });

})
