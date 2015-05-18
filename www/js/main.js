$(document).ready(function() {

  /* SETUP */
  function load_data(file) {
    var json = null;
    url = "../sets/json/" + file + ".json";
    $.ajax({
      'async': false,
      'global': false,
      'url': url,
      'dataType': "json",
      'success': function(data) {
        json = data;
      }
    });
    return json;
  }

  var player = {
    "health"  : 10,
    "defense" : 1,
    "attack"  : 1,
    "loot"    : 0
  }

  var weapons = load_data("weapons");
  var monsters = load_data("monsters");
  var magic = load_data("magic");
  var armor = load_data("armor");
  
  function shuffle(){
    $("#card-deck").each(function(){
        var divs = $(this).find('.card');

        for(var i = 0; i < divs.length; i++) $(divs[i]).remove();            
        var i = divs.length;
        if ( i == 0 ) return false;
        while ( --i ) {
           var j = Math.floor( Math.random() * ( i + 1 ) );
           var tempi = divs[i];
           var tempj = divs[j];
           divs[i] = tempj;
           divs[j] = tempi;
         }
        for(var i = 0; i < divs.length; i++) $(divs[i]).appendTo(this);
    });                    
  }

  /* PLAYER FUNCTIONS */

  function reset_player (player) {
    player = {
      "health"  : 11,
      "defense" : 2,
      "attack"  : 2,
      "loot"    : 1
    }
  }

  function update_player (player) {
    $('#player-health').html(player.health);
    $('#player-defense').html(player.defense);
    $('#player-attack').html(player.attack);
    $('#player-loot').html(player.loot);
  }

  function game_over () {
    window.alert('game');
  }

  /* CARD FUNCTIONS */

  function add_stat(name, value) {
    var block = "<div class='stat'>" +
      "<div class='stat-name'>" + name + "</div>" +
      "<div class='stat-value' name='" + name + "'>" + value + "</div>" +
      "</div>";
    return block;
  }

  function add_avatar(image) {
    var block = '<div class="avatar"' +
      ' style="background-image: url(';
    // 'assets/monster/';
    block = block + image;
    block = block + ')"></div>';
    return block;
  }

  function add_card_monster(monster) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + monster.name +
      ' card-type="monster">');

    var monster_card = $('#' + monster.name);

    // Top Label
    monster_card.append(
      '<div class="card-name">' +
      monster.name +
      '</div>');

    // Image
    monster_card.append(
      add_avatar(monster.image));

    // Stats
    monster_card.append(
      '<div class="card-stats">');

    monster_card.find(".card-stats").append(
      add_stat("health", monster.health),
      add_stat("attack", monster.attack),
      add_stat("defense", monster.defense)
    );

    // Description
    monster_card.append(
      '<div class="card-description">'+
      monster.description+
      '</div>');
  }

  function add_card_armor(armor) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + armor.id +
      ' card-type="armor">');

    var armor_card = $('#' + armor.id);

    // Top Label
    armor_card.append(
      '<div class="card-name">' +
      armor.name +
      '</div>');

    // Image
    armor_card.append(
      add_avatar(armor.image));

    // Stats
    armor_card.append(
      '<div class="card-stats">');

    armor_card.find(".card-stats").append(
      add_stat("defense", armor.defense),
      add_stat("durability", armor.durability),
      add_stat("value", armor.value)
    );

    // Description
    armor_card.append(
      '<div class="card-description">'+
      armor.description+
      '</div>');
  }

  function add_card_weapon(weapon) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + weapon.id +
      ' card-type="armor">');

    var weapon_card = $('#' + weapon.id);

    // Top Label
    weapon_card.append(
      '<div class="card-name">' +
      weapon.name +
      '</div>');

    // Image
    weapon_card.append(
      add_avatar(weapon.image));

    // Stats
    weapon_card.append(
      '<div class="card-stats">');

    weapon_card.find(".card-stats").append(
      add_stat("attack", weapon.attack),
      add_stat("durability", weapon.durability),
      add_stat("value", weapon.value)
    );

    // Description
    weapon_card.append(
      '<div class="card-description">'+
      weapon.description+
      '</div>');
  }

  function build_deck() {
    $('.card').each(function () {
      $(this).remove();
    });

    for (i in monsters) {
      add_card_monster(monsters[i]);
    }
    for (i in armor) {
      add_card_armor(armor[i]);
    }
    for (i in weapons) {
      add_card_weapon(weapons[i]);
    }
  }

  // Animations
  var swiperight = function() {
    $(this).addClass('rotate-left').delay(700).fadeOut(1);
    $('.card').find('.status').remove();
    $(this).append('<div class="status run-away">Run Away!</div>');
    if ($(this).is(':first-child')) {
      game_over();
    }
  };

  var swipeleft = function() {
    $(this).addClass('rotate-right').delay(700).fadeOut(1);
    $('.card').find('.status').remove();
    $(this).append('<div class="status fight">Fight!</div>');
    if ($(this).is(':first-child')) {
      game_over();
    }
  };

  $("#play-game").on("click", play_game);

  function play_game () {
    reset_player();
    build_deck();
    shuffle(); 
    update_player(player);
    $(".card").on("swiperight", swiperight);
    $(".card").on("swipeleft", swipeleft);
  }

});