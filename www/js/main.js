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
  var card_deck = {}
  
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
    player.health = parseInt(10)
    player.defense = parseInt(0)
    player.attack = parseInt(1)
    player.loot = parseInt(0)
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

  function set_equipment_image (image, type){
    $('#'+type).find('img').remove();
    $('#'+type).append("<img src="+image+">")
  }

  function game_over () {
    window.alert('game')
  }

  /* CARD CONSTRUCTION FUNCTIONS */

  function add_stat(name, value) {
    var block = "<div class='stat'>" +
      "<div class='stat-name'>" + name + "</div>" +
      "<div class='stat-value' id='" + name + "'>" + value + "</div>" +
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

  function card_deck_add(card,type){
    card.type = type
    card_deck[card.id] = card
  }

  function add_card_monster(monster) {

    card_deck_add(monster, 'monster')

    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + monster.id +
      ' card-type="monster">')

    var monster_card = $('#' + monster.id)

    // Add background
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

    card_deck_add(armor, 'armor')

    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + armor.id +
      ' card-type="armor">')

    var armor_card = $('#' + armor.id)

    // Add background
    if (armor.background) {
      armor_card.css('background-image',"url('"+armor.background+"')")
    }

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

    card_deck_add(weapon, 'weapon')

    // Add a card to the deck named after the monster
    $('#card-deck').append('<div class="card"' +
      ' id=' + weapon.id +
      ' card-type="weapon">')

    var weapon_card = $('#' + weapon.id)

    // Add background
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

  function build_deck(card_deck) {

    // Nuke Deck
    $('.card').each(function () {
      $(this).remove()
    })

    card_deck = {}

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


  /* CARD FUNCTIONS */

  function get_card_action(card, swipe_right) {
    var card_type = $("#card-deck .card")
                      .first()
                      .attr('card-type')

    if(swipe_right){
      switch(card_type) {
        case "monster":
          return 'fight'
        default:
          return 'run'
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

  function get_card_attr(card,attr){
    card_id = $(card).attr('id')
    t = card_deck[card_id]
    return t[attr]
  }

  function do_combat(card_id, player) {

    card = card_deck[card_id]
    // player attack
    damage = 0;
    if (player.attack > card.defense) {
      damage = Math.abs(parseInt(player.attack) - parseInt(card.defense))
    } 
    card.health = parseInt(card.health) - damage
    card_deck[card_id] = card
    card_div = $('#'+card.id+' #health').html(card.health)

    if (card.health < 1 ) {
      return true
    }

    if (parseInt(player.health) < 1) {
      game_over()
    }
    if (card.health > 0){
      // attack player 
    }

  }

  function card_swipe (card, next_card, swipe_left){
    
    var remove_card = true
    var card_type = $(card).attr('card-type')
    var card_id = $(card).attr('id')

    if(card_type == 'monster') {
      if(swipe_left){ 
        card_animation(card, 'tada')
        remove_card = do_combat(card_id, player)
      } else {
        // Run Away
        card_animation(card, 'zoomOutRight')
      }
    } else{
      if(swipe_left){ 
        equip_card(card);
      } else {
        loot_card(card);
      }
    }

    if(remove_card){
      setTimeout(function() {
        if ($(card).is(':last-child')) {
          $('#card-deck .card').first().hide().remove()
          game_over()
        } else {
          $('#card-deck .card').first().hide().remove()
          card_animation(next_card, 'flipInX')
          update_hints()
        }
      }, 1000)
    }

  }

  function equip_card(card) {
    card_animation(card, 'slideOutUp rotate-right')

    set_equipment_image(
      get_card_attr(card,'image'),
      get_card_attr(card,'type')
    )

    switch(get_card_attr(card,'type')) {
      case "weapon":
        player.attack = 1 + parseInt(get_card_attr(card,'attack'))
        break
      case "armor":
        player.defense = 0 + parseInt(get_card_attr(card,'defense'))
        break
    } 
    update_player(player)
  }

  function loot_card(card) {
      card_animation(card, 'slideOutDown rotate-left')
      var value = get_card_attr(card,'value')
      player.loot = player.loot + parseInt(value)
      update_player(player)
  }

  var swiperight = function() {
    card_swipe(this,$('#card-deck .card').first().next(), false)
  }

  var swipeleft = function() {
    card_swipe(this,$('#card-deck .card').first().next(), true)
  }

  /* CARD ANIMATIONS */
  function card_animation(card, animation){
    animationName = 'animated '+animation
    $(card).show()
    $(card).addClass(animationName)
      .one(animationEnd, 
        function () { $(card).removeClass(animationName) })
  }


  // PLAY GAME
  $("#play-game").on("click", play_game)

  function play_game () {
    
    reset_player(player)
    build_deck(card_deck)
    shuffle(card_deck)
    
    first_card = $('#card-deck :first-child')
    card_animation(first_card, 'flipInX')

    update_player(player)
    update_hints()

    $(".card").on("swiperight", swiperight)
    $(".card").on("swipeleft", swipeleft)

  }

});