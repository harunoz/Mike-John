// Create "game" variable.
var Game = function() {
  // Initialize game variables
  this.paused = false;
  this.gameOn = false;
  this.storyIndex = 0;

  /* Create array of text items to be spoken by Mıke and John */
  this.storyText = [
    ['Hi Mike! I need your help',
      'Can you save my daughters?'],


    ['Yeah I can Do it!',
      'Lets do it!'],



    ['Lets begin, be carefull!',  'Ghosts are dangerous.'],


    ['Yes I will!'],
    ['You can use "W" "A" "S" "D"','for controls.'],


    ['For pause use "P"',
      'For reset the game use "R"'],
    ['Lets begin!'],



    ['Lets begin John.'],


    ['Then lets kill some ghosts'],
    ['My girls are finally here',
      'Thanks for your help!']
  ];

  //Preload for the audio
  this.JaneEfx = new Audio('audio/sfx_Jane.wav');
  this.collideEfx = new Audio('audio/sfx_collide.wav');
  this.gongEfx = new Audio('audio/sfx_gong.wav');
  this.gongEfxPlayed = false;
};

//Toogle between paused / unpaused
Game.prototype.togglePause = function() {
  this.paused = !this.paused;
};

// Increase number of enemies at end of succesful run
Game.prototype.addAnEnemy = function() {

  var rows = 4;
  var count = everyEnemies.length + 1;

  // Loop to top if count > rows available.
  if (count > rows) {
    count -= rows;
  }

  // Add the new enemy to the everyEnemies array
  var enemy = new Enemy(-100, (count * 83) - 21);
  everyEnemies.push(enemy);
};

// Initialize game reset variables.
Game.prototype.gameReset = function() {
  //reset gong sound effect
  this.gongEfxPlayed = false;

  // Place all enemy objects in an array called everyEnemies
  everyEnemies = [];
  for(var i=1; i<4; i++){
    var enemy = new Enemy(0-i*101, 83*i-21);
    everyEnemies.push(enemy);
  }

  // Create array to hold items in scoring position. 
  allScorePositions = [];
  var score = new ScorePosition('blank',0);
  allScorePositions.push(score);
  var score2 = new ScorePosition('blank',606);
  allScorePositions.push(score2);

  //Randomization for Jane item.
    Jane = new Item('Jane', -100, -100);
  Jane.reset();

  // Place the player object.
  player = new Player(303, 404);

  // Turn on game indicator. This will start game rendering.
  this.gameOn = true;
};

// Switch speaker on intro dialog
Game.prototype.speakerToggle = function() {
  allActors.forEach(function(actor) {
    actor.talking = !actor.talking;
  });
};

// Initialize for into chracters.
Game.prototype.initIntro = function() {
  allActors= [];
  var actor1 = new Actor('John', 202, 238);
  actor1.talking = true;
  allActors.push(actor1);
  var actor2 = new Actor('Mike', 404, 238);
  allActors.push(actor2);
};

// For end of game, show additional sprite
Game.prototype.initEnd = function() {
  var actor3 = new Actor('gong', 303, 238);
  allActors.push(actor3);
};


//Enemy class that our player must avoid.
var Enemy = function(x, y) {
  this.sprite = 'images/ghost.png';
  this.x = x;
  this.y = y;
  this.rate = 100 + Math.floor(Math.random() * 150);
};

//Update enemies position required method for game
Enemy.prototype.update = function(dt) {
  if (!game.paused){
    this.x = this.x + (dt * this.rate);
  }

  // When ghost goes off one side, reappear on the other side
  if (this.x > 700){
    this.x = -100;
  }
};

// Randomize start location of enemy
Enemy.prototype.reset = function() {
  this.x = 0 - Math.random() * 200;
};

// Increase speed of enemies slightly
Enemy.prototype.increaseRate = function() {
  this.rate += 50;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player class
var Player = function(x,y) {
  this.sprite = 'images/Mike.png';
  this.x = x;
  this.y = y;
  this.carryItem = false;
};

// Reset player's position to start location
Player.prototype.reset = function() {
  // Set player to start position
  this.x = 303;
  this.y = 404;
};

// Handle keyboard input during gameplay.

Player.prototype.handleInput = function(key) {
  switch(key) {
    case 'up':
      if (this.y > 0 && !game.paused){
        this.y -= 83;
      }
      break;
    case 'down':
      if (this.y < 404 && !game.paused) {
        this.y += 83;
      }
      break;
    case 'left':
      if (this.x > 0 && !game.paused) {
        this.x -= 101;
      }
      break;
    case 'right':
      if (this.x < 606 && !game.paused){
        this.x += 101;
      }
      break;
    case 'pause':
      game.togglePause();
      break;
    case 'restart':
      game.gameReset();
      break;
  }
};

//Draw player on the screen with render
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Create the item class that our player going to pick.
var Item = function (name, x, y) {
  this.name = name;
  this.sprite = 'images/' + name + '.png';
  this.x = x;
  this.y = y;
  this.visible = true;
};

// Steps to be carried out when an item is picked up by the player
Item.prototype.pickup = function() {
  // Set parameters for objects
  this.visible = false;
  player.carryItem = true;


  // Hide item off screen (to be reused on reset)
  this.x = -101;
  this.y = -101;
};

// Drop item on game board, update entities to match state.
Item.prototype.drop = function() {
  this.visible = true;
  player.carryItem = false;
  this.x = player.x;
  this.y = player.y;
};

// Reset will set item on game board to be picked up.
Item.prototype.reset = function() {
  this.x = Math.floor(Math.random() * 5) * 101;
  this.y = Math.ceil(Math.random() * 4) * 83 - 11;
  this.visible = true;
};

// Hide item when no longer needed (end game, etc.)
Item.prototype.hide = function() {
  this.visible = false;
  player.carryItem = false;
};

// Draw the item on the game board
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Creating for holding positions of items.
var ScorePosition = function(name, x) {
  this.x = x;
  this.y = -11;
  this.sprite = 'images/' + name + '.png';
};

//Draw items on scoring row
ScorePosition.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Creating for actors, (Mıke and Janes).
var Actor = function(name, x, y) {
  this.sprite = 'images/' + name + '.png';
  this.x = x;
  this.y = y;
  this.talking = false;
};

//Draw the actor on the game board, If specific actor talking put balon upside.
Actor.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  if(this.talking) {
    ctx.drawImage(Resources.get('images/bubble-tip.png'),
      this.x + 29, this.y + 38);
  }
};

//Handle keyboard
Actor.prototype.handleInput = function(key) {
  switch(key) {
    case 'spacebar':
      if (game.storyIndex < 8){
        game.storyIndex++;
        game.speakerToggle();
      } else {
        game.storyIndex = 9;
        document.getElementById('instructions').className = '';
        game.gameReset();
      }
      break;
  }
};

//Initialize game (implicity global)
game = new Game();

//This listens for key presses
document.addEventListener('keydown', function(e) {
  var allowedKeys;
  if (!game.gameOn) {
    allowedKeys = {
      32: 'spacebar'
    };
    allActors[0].handleInput(allowedKeys[e.keyCode]);
  } else {
    allowedKeys = {
      32: 'spacebar',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      65: 'left',      // A
      68: 'right',     // D
      83: 'down',      // S
      80: 'pause',
      82: 'restart',
      87: 'up'         // W
    };
    player.handleInput(allowedKeys[e.keyCode]);
  }
  if (e.keyCode in allowedKeys){
    e.preventDefault();
  }
});
