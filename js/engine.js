var Engine = (function(global) {
//Predefine the variables that we will use.
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;
  canvas.width = 707;
  canvas.height = 606;
  document.getElementById('game-board').appendChild(canvas);

  //This function serves as the kickoff point for the game loop. 

  function main() {
    // requires FOR  smooth animation.
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;
    // Call our update/render functions.
    update(dt);
    render();
     // Set our lastTime variable.
    lastTime = now;
    // Use the browser's requestAnimationFrame function to call this.
    win.requestAnimationFrame(main);
  }
  // This function does some initial setup that should only occur once,
  function init() {
    game.initIntro();
    lastTime  =  Date.now();
    main();
  }
  // This function is called by update function.
 function update(dt) {
    if (game.gameOn) {
      updateMyEntities(dt);
      checkCollisions();
      updateScoringRow();
    }
  }
  // This is called on the our update function  which loops all of the
  // objects which defined in app.js.
  function updateMyEntities(dt) {
    everyEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
  }
 // Check for collisions
  function checkCollisions(){
    // Check for enemy collision.
    everyEnemies.forEach(function(enemy) {
      if(player.y - enemy.y == 10) {
        if(player.x < enemy.x + 75 && player.x + 75 > enemy.x){
          game.collideEfx.play();
          // If the player is carrying an item, drop it.
          if (player.carryItem) {
            Jane.drop();
          }
          player.reset();
        }
      }
    });
    //Check for collision between player and the Jane, and take the Jane.
    if(player.y === Jane.y && player.x === Jane.x) {
      Jane.pickup();
    }
  }
  function updateScoringRow() {
    // Check if player has reached the scoring row.
    if(player.y < 0) {
      // Verify player is at with an open position.
      var openSlot = true;
      allScorePositions.forEach(function(pos) {
        if(player.x === pos.x){
          openSlot = false;
        }
      });

      // If position is open, add one of Jane.
      if(openSlot && player.carryItem) {
        var score = new ScorePosition('Jane', player.x);
        allScorePositions.push(score);
        // If all positions filled, end game.
        if (allScorePositions.length == 7){
          gameOver();
        } else {
          // Play Jane drop sound effect
          game.JaneEfx.play();
          // Add another bug to the array.
          game.addAnEnemy();
          // Reset entities for next round.
          player.reset();
          Jane.reset();
          everyEnemies.forEach(function(enemy) {
            enemy.increaseRate();
          });
        }
      }else{
        // If the position is not open, put player back where they were.
        player.y += 83;
      }
    }
  }

  // When game ends, clear game entities and set up end scene
  function gameOver() {
    game.initEnd();
    everyEnemies = [];
    Jane.hide();
    game.gameOn = false;
  }

  // This function initially draws the our game level.
  function render() {
    // Call function to render the top row.
    var topRowTiles = [

    //Adding wall images.
      'images/tall-wall.png',

      //Adding block images.
      'images/wood-block.png',
      'images/wood-block.png',
      'images/wood-block.png',
      'images/wood-block.png',
      'images/wood-block.png',
      'images/tall-wall.png'
    ];

    // This array holds image that used special URL.
    var rowImages = [

    //Adding wood block and stone images.
      'images/wood-block.png',    
      'images/stone-block.png',   
      'images/stone-block.png',   
      'images/stone-block.png',   
      'images/stone-block.png',   
      'images/grass-block.png'    
    ],
    numRows = 6,
    numCols = 7,
    row, col;

    // Loop through the number of columns to draw the specific top row tiles
    for (col = 0; col < numCols; col++) {
      ctx.drawImage(Resources.get(topRowTiles[col]), col * 101, 0);
    }

    // Call images specially for  the top row design AFTER the row top
    // is rendered.
    ctx.drawImage(Resources.get('images/roof-se.png'), 0, -81);
    ctx.drawImage(Resources.get('images/roof-sw.png'), 606, -81);

    // Loop  for  the number of rows and column we defined up.
    for (row = 1; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    //If showing intro, render intro entities. Otherwise, render game entities.
    if (!game.gameOn) {
      renderIntro();
    } else {
      renderEntities();
    }
  }
  // This function is called to draw the introduction  and gameover scene. 
  function renderIntro() {
    if(typeof allScorePositions !== 'undefined') {
      renderScoringRow();
    }
    bubbleRect(205,177,300,100,25,10,'#fff','#000');
    allActors.forEach(function(actor) {
      actor.render();
    });
    renderStory();
  }
  // This function takes the information from the storyText array in app.js,
  function renderStory () {
    ctx.font = '16pt Arial';
    ctx.fillStyle = '#000';
    for (var i=0; i < game.storyText[game.storyIndex].length; i++){
      ctx.fillText(game.storyText[game.storyIndex][i],225,207 + i * 25);
    }
    ctx.strokeStyle = '#fff';

    var helpText = '';
    if (game.storyIndex < 9){
      helpText = 'Press Spacebar to continue';
    } else {
      helpText = 'Press Spacebar to play again';
      allActors[1].talking = true;
      if(!game.gongEfxPlayed) {
        game.gongEfx.play();
        game.gongEfxPlayed = true;
      }
    }
    ctx.lineWidth = 5;
    ctx.strokeText(helpText,225,515);
    ctx.fillText(helpText,225,515);
  }
  //Canvas rounded corner.
  function bubbleRect(x, y, width, height, radius, lineWidth, fill, stroke) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
  // This function is called by the render function and is called on each game
  //
  function renderEntities() {
    // Render Janes on top row from successful placements by player
    renderScoringRow();

    // Render item only if not picked up (Jane.visible = true)

    if(Jane.visible) {
      Jane.render();
    }

    everyEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  // Used by both renderIntro and renderEntities
  function renderScoringRow () {
    allScorePositions.forEach(function(pos) {
      pos.render();
    });
  }
  // load for our all images.
  Resources.load([
    'images/stone-block.png',
    'images/wood-block.png',
    'images/grass-block.png',
    'images/ghost.png',
    'images/Mike.png',
    'images/John.png',
    'images/Jane.png',
    'images/tall-wall.png',
    'images/roof-se.png',
     'images/John.png',
    'images/roof-sw.png',
    'images/blank.png',
     'images/Mike.png',
    'images/bubble-tip.png',
    'images/gong.png'
  ]);
  Resources.onReady(init);

  // Assign the canvas' context object to the global variable.
  global.ctx = ctx;
})(this);
