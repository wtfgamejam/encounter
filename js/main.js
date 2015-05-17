$(document).ready(function() {

  var load_data = function(file) {
    var json = null;
    url = "../sets/json/" + file + ".json";
    $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'dataType': "json",
        'success': function (data) {
            json = data;
            console.log(data);
        }
    });
    return json;
  }

  var weapons = load_data("weapons");
  var monsters = load_data("monsters");
  var magic = load_data("magic");
  var armor = load_data("armor");

  console.log(weapons);
  console.log(monsters);
  console.log(magic);
  console.log(armor);

  var build_deck = function() {
    for (i in monsters){
      console.log(monsters[i]);
    }
  }

  build_deck();

  var swiperight = function() {
    $(this).addClass('rotate-left').delay(700).fadeOut(1);
    $('.card').find('.status').remove();
    $(this).append('<div class="status fight">Fight!</div>');

    if ($(this).is(':last-child')) {
      $('.card:nth-child(1)').removeClass('rotate-left rotate-right').fadeIn(300);
    } else {
      $(this).next().removeClass('rotate-left rotate-right').fadeIn(400);
    }
  };

  var swipeleft = function() {
    $(this).addClass('rotate-right').delay(700).fadeOut(1);
    $('.card').find('.status').remove();
    $(this).append('<div class="status run-away">Run Away!</div>');

    if ($(this).is(':last-child')) {
      $('.card:nth-child(1)').removeClass('rotate-left rotate-right').fadeIn(300);
    } else {
      $(this).next().removeClass('rotate-left rotate-right').fadeIn(400);
    }
  };

  $(".card").on("swiperight", swiperight);
  $(".card").on("swipeleft", swipeleft);

});
