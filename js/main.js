$(function() {

  /*$(".tile").css("display", "none");
  $(".tile").each(function(index) {
    $(this).delay(index * 200).fadeIn(1000);
  });*/

  $("#tilescontainer").on("click", ".tile", function() {
    $("#tilescontainer").fadeOut(500, function() {
      $("#controlbar").attr("class", "editor");
      $("#edittext").fadeIn(500);
    });
  });

  $("#tilescontainer, #edittext").scroll(function() {
    $(".hidescrollbar").hide();
    clearTimeout($.data(this, "scrollCheck"));
    $.data(this, "scrollCheck", setTimeout(function() {
      $(".hidescrollbar").fadeIn(500);
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
      .hide().fadeIn(1000)

    );
  });

  $("#controlbar .ion-chevron-left").click(function() {
    $("#edittext").fadeOut(500, function() {
      $("#controlbar").attr("class", "projects");
      $("#tilescontainer").fadeIn(500);
    });
  });

})
