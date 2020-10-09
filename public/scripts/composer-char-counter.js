// char counter function

$(document).ready(function() {
  $("#tweet-text").on("input",function() {
    $(".counter").val(140 - $("#tweet-text").val().length);
    $(".counter").val() < 0 ? $(".counter").css("color", "red") : $(".counter").css("color", "#545149");
  });
});
