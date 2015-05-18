$(document).ready(function() {

  var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

  /* SETUP */
  function load_data(file) {
    var json = null
    url = "../sets/json/" + file + ".json"
    $.ajax({
      'async': false,
      'global': false,
      'url': url,
      'dataType': "json",
      'success': function(data) {
        json = data
      }
    })
    return json
  }

  var player = {
    "health"  : 10,
    "defense" : 1,
    "attack"  : 1,
    "loot"    : 0
  }

  var weapons = load_data("weapons")
  var monsters = load_data("monsters")
  var magic = load_data("magic")
  var armor = load_data("armor")
  
  function shuffle(){
    $("#card-deck").each(function(){
        var divs = $(this).find('.card')

        for(var i = 0; i < divs.length; i++) $(divs[i]).remove()   
        var i = divs.length
        if ( i == 0 ) return false
        while ( --i ) {
           var j = Math.floor( Math.random() * ( i + 1 ) )
           var tempi = divs[i]
           var tempj = divs[j]
           divs[i] = tempj
           divs[j] = tempi
         }
        for(var i = 0; i < divs.length; i++) $(divs[i]).appendTo(this);
    })                   
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

  /* UPDATE FUNCTIONS */

  function update_player (player) {
    $('#player-health').html(player.health)
    $('#player-defense').html(player.defense)
    $('#player-attack').html(player.attack)
    $('#player-loot').html(player.loot)
  }

  function update_hints () {
    var hint_left = "Equip"
    var hint_right = "Loot"
    var card_type = $("#card-deck .card").first().attr('card-type')

    switch(card_type) {
      case "monster":
        hint_left = "Fight!";
        hint_right = "Run Away!";
        break
      case "weapon":
        break
      case "armor":
        break
      default:
        hint_left = "Keep"
    }
    $('#hint-left').html(hint_left)
    $('#hint-right').html(hint_right)

  }

  function game_over () {
    window.alert('game')
  }

  /* CARD CONSTRUCTION FUNCTIONS */

  function add_stat(name, value) {
    var block = "<div class='stat'>" +
      "<div class='stat-name'>" + name + "</div>" +
      "<div class='stat-value' name='" + name + "'>" + value + "</div>" +
      "</div>"
    return block
  }

  function add_avatar(image) {
    var block = '<div class="avatar"' +
      ' style="background-image: url('
    // 'assets/monster/';
    block = block + image
    block = block + ')"></div>'
    return block
  }

  function add_card_monster(monster) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + monster.name +
      ' card-type="monster">')

    var monster_card = $('#' + monster.name)

    // Add background
    console.log(monster.background);
    if (monster.background) {
      monster_card.css('background-image',"url('"+monster.background+"')")
    }

    // Top Label
    monster_card.append(
      '<div class="card-name">' +
      monster.name +
      '</div>')

    // Image
    monster_card.append(
      add_avatar(monster.image))

    // Stats
    monster_card.append(
      '<div class="card-stats">')

    monster_card.find(".card-stats").append(
      add_stat("health", monster.health),
      add_stat("attack", monster.attack),
      add_stat("defense", monster.defense)
    )

    // Description
    monster_card.append(
      '<div class="card-description">'+
      monster.description+
      '</div>')
  }

  function add_card_armor(armor) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + armor.id +
      ' card-type="armor">')

    var armor_card = $('#' + armor.id)

    // Top Label
    armor_card.append(
      '<div class="card-name">' +
      armor.name +
      '</div>')

    // Image
    armor_card.append(
      add_avatar(armor.image))

    // Stats
    armor_card.append(
      '<div class="card-stats">')

    armor_card.find(".card-stats").append(
      add_stat("defense", armor.defense),
      add_stat("durability", armor.durability),
      add_stat("value", armor.value)
    )

    // Description
    armor_card.append(
      '<div class="card-description">'+
      armor.description+
      '</div>')
  }

  function add_card_weapon(weapon) {
    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + weapon.id +
      ' card-type="armor">')

    var weapon_card = $('#' + weapon.id)

    // Add background
    console.log(weapon.background);
    if (weapon.background) {
      weapon_card.css('background-image',"url('"+weapon.background+"')")
    }

    // Top Label
    weapon_card.append(
      '<div class="card-name">' +
      weapon.name +
      '</div>')

    // Image
    weapon_card.append(
      add_avatar(weapon.image))

    // Stats
    weapon_card.append(
      '<div class="card-stats">')

    weapon_card.find(".card-stats").append(
      add_stat("attack", weapon.attack),
      add_stat("durability", weapon.durability),
      add_stat("value", weapon.value)
    )

    // Description
    weapon_card.append(
      '<div class="card-description">'+
      weapon.description+
      '</div>')
  }

  function build_deck() {
    $('.card').each(function () {
      $(this).remove()
    })

    for (i in monsters) {
      add_card_monster(monsters[i])
    }
    for (i in armor) {
      add_card_armor(armor[i])
    }
    for (i in weapons) {
      add_card_weapon(weapons[i])
    }
  }

  function get_card_action(card, swipe_right) {
    var card_type = $("#card-deck .card")
                      .first()
                      .attr('card-type')

    if(swipe_right){
      switch(card_type) {
        case "monster":
          return 'fight'
        default:
          return 'run';
      }
    }else{
      switch(card_type) {
        case "monster":
          return 'keep'
        default:
          return 'loot'
      }
    }
  }


  // SWIPES

  function card_swipe (card, next_card, swipe_left){
    
    var remove_card = false
    var card_type = $(card).attr('card-type')

    if(card_type == 'monster') {
      if(swipe_left){ 
        card_animation(card, 'tada fight')
      } else {
        // Run Away
        card_animation(card, 'zoomOutRight')
        remove_card = true
      }
    } else{
      if(swipe_left){ 
        remove_card = true
        console.log(card_type, "swipe_left")
      } else {
        remove_card = true
        console.log(card_type, "swipe_right")
      }
    }

    if(remove_card){
      if ($(this).is(':last-child')) {
        game_over()
      } else {
        setTimeout(function() {
          $('#card-deck .card').first().hide().remove()
          card_animation(next_card, 'flipInX')
          update_hints()
        }, 500)
      }
    }

  }

  /* CARD ANIMATIONS */
  function card_animation(card, animation){
    animationName = 'animated '+animation
    $(card).show()
    $(card).addClass(animationName)
      .one(animationEnd, 
        function () { $(card).removeClass(animationName) })
  }


  var swiperight = function() {
    card_swipe(this,$('#card-deck .card').first().next(), false)
  };

  var swipeleft = function() {
    card_swipe(this,$('#card-deck .card').first().next(), true)
  };

  // PLAY GAME
  $("#play-game").on("click", play_game)

  function play_game () {
    
    reset_player()
    build_deck()
    shuffle()
    
    first_card = $('#card-deck :first-child')
    card_animation(first_card, 'flipInX')

    update_player(player)
    update_hints()

    $(".card").on("swiperight", swiperight)
    $(".card").on("swipeleft", swipeleft)
  }

});