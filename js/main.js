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
        }
    });
    return json;
  }

  var weapons = load_data("weapons");
  var monsters = load_data("monsters");
  var magic = load_data("magic");
  var armor = load_data("armor");

  function add_stat (name, value) {
    var block = "<div class='stat'>" +
      "<div class='stat_name'>"+name+"</div>" +
      "<div class='stat_value'name='"+name+"'>"+value+"</div>"+
      "</div>";
    return block;
  }

  function add_avatar (image) { 
    var block = '<div class="avatar"'+
    ' style="display: block;'+
    ' background-image: url('+
      image+
    ')></div>';
    console.log(block);
    return block;
  }

  function add_monster (monster) {
    
    var block = "";
    block += '<div class="card" style="display: block;">';
    block += add_avatar(monster.image);
    block += add_stat("health",monster.health);
    block += add_stat("attack",monster.attack);
    block += add_stat("defense",monster.defense);
    //$('#card-deck').append(block);
  }

  function build_deck () {
    for (i in monsters){
      add_monster(monsters[i]);
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
