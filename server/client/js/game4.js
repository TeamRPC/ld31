var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch")
        .setup({width: 1024, height: 640, scaleToFit: true})
        .controls().touch()
        
Q.input.mouseControls();
Q.gravityY = 0;
Q.gravityX = 0;

Q.MovingSprite.extend("Player",{
    init: function(p) {
        this._super(p, {
            sheet: "healthy", 
            x: 410,
            y: 90,
            cx: 0,
            cy: 0,
            type: Q.SPRITE_FRIENDLY,
            
            moveTargetX: 512,
            moveTargetY: 512,
            moveTargetReached: false,
            moveInProgress: false,
            moveStepsAllowed: 3,
            moveStepsElapsed: 0
            
        });
        this.add('mouseControls, 2d');

        this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
                Q.stageScene("endGame",1, { label: "You Won!" }); 
                this.destroy();
            }
            else if (collision.ob.isA("Wall")) {
                Q.stageScene("endGame",1, { label: "You touched a wall and died!" });
                this.destroy();            
            }
        });
        
        
        
    },
    
    step: function(dt) {
                
        // get x, y of playerCursor
        // get x, y of cursor
        // get delta x, delta y
        // rads = arctan(deltaX, deltaY)
        // degs = rads * 180/pi
        
        // find the angle playerCursor needs to travel 
        // to get to cursor
        // ---------------
        
        // if movement is in progress,
        // see if we've reached the target
        //this.p.moveInProgress;

//    
  
        var speedMultiplier = 18;
        var playerCursorX = this.p.x;
        var playerCursorY = this.p.y;
        var cursorX = Q.inputs['mouseX'];
        var cursorY = Q.inputs['mouseY'];
        
        // if cursor is not in same position as player cursor
        // start moving towards cursor
        if (playerCursorX != cursorX && playerCursorY != cursorY) {
            
            //console.log('playerCursor not on cursor. ' + playerCursorX + ' ' + playerCursorY);
            
            // if playerCursor is not already moving towards
            // cursor, start moving playerCursor
            if (!this.p.moveInProgress) {
                
                //console.log('not already moving');
                
                var dir_x = cursorX - playerCursorX;
                var dir_y = cursorY - playerCursorY;

                this.p.vx = dir_x * speedMultiplier;
                this.p.vy = dir_y * speedMultiplier;  
                
                this.p.moveInProgress = true;                
                
            }
            // playerCursor is already moving towards cursor.
            else {
                // do nothing and let it keep moving.
                // keep track of how many steps we've done since 
                // playerCursor started moving towards cursor.
  
                this.p.moveStepsElapsed += 1;

                // if the steps taken are greater than the allowed
                // amount of steps, stop moving.
                if (this.p.moveStepsElapsed >= this.p.moveStepsAllowed) {
                    //console.log('youve had your chance');
                    this.p.vx = 0;
                    this.p.vy = 0;
                    this.p.moveStepsElapsed = 0;
                    this.p.moveInProgress = false;
                }
            }
                
            
            // stop if it reached its original target.
            // or if 30 steps have elapsed without
            // reaching the target
            if (playerCursorX == this.p.moveTargetX || playerCursorY == this.p.moveTargetY) {
                
                console.log('gaol reached');
                this.p.vx = 0;
                this.p.vy = 0;
                this.p.moveInProgress = false;
                
            }
        }
        
        // playerCursor is at same place as cursor
//        else {
//            console.log('MATCHED');
//        }
            

//    
//        var deltaX = playerCursorX - Q.inputs['mouseX'];
//        var deltaY = playerCursorY - Q.inputs['mouseY'];
//        
//        var rads = Math.atan2(deltaY, deltaX);
//        var degrees = rads * 180 / Math.PI;
//        
//        this.p.angle = degrees;
        // ---------------
    
            
            
            //        var theta = Math.ata2(        
        // move sprite to x, y pos of cursor
        // if cursor has moved since last step
//        var nowx = Q.inputs['mouseX'];
//        var nowy = Q.inputs['mouseY'];
//        if (nowx != this.p.lastx || nowy != this.p.lasty) {
          //  this.p.x = Q.inputs['mouseX'] + 16;
          //  this.p.y = Q.inputs['mouseY'] + 16;
//            this.p.lastx = nowx;
//            this.p.lasty = nowy;
//        }
        
    }    
});

Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});

Q.Sprite.extend("Button", {
    init: function(p) {
        this._super(p, { 
            sheet: 'tiles',
            type: Q.SPRITE_UI
        });
        
        this.on("touch", function(t) {
            console.log('button touched.');
            //console.dir(t);
        });
    }
});

Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100 });
    this.add('2d, aiBounce');
    
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You Died" }); 
        collision.obj.destroy();
      }
    });
    
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      }
    });
  }
});

Q.scene("level1",function(stage) {
    
    var border = stage.collisionLayer(new Q.TileLayer({ 
        dataAsset: 'level.json',
        sheet: 'tiles' }));
    //border.p.y -= 9;
    //border.p.x += 41;
    
    var trapButton1 = stage.insert(new Q.Button({
        x: 32+16, 
        y: 32+16,
        frame: 10,
    }));
    
    var trapButton2 = stage.insert(new Q.Button({
        x: 32+16,
        y: 32*4+16,
        frame: 11,
    }));
    
    var trapButton3 = stage.insert(new Q.Button({
        x: 32+16,
        y: 32*8+16,
        frame: 12
    }));
    
    var trapButton4 = stage.insert(new Q.Button({
        x: 32+16,
        y: 32*13+16,
        frame: 13
    }));
    
    var trapButton5 = stage.insert(new Q.Button({
        x: 32+16,
        y: 32*17+16,
        frame: 14
    }));
    
    var flag = stage.insert(new Q.Button({
        x: 32*8+16,
        y: 32*8+16,
        frame: 15
    }));
    
    var player = stage.insert(new Q.Player({
        x: 32*30+16,
        y: 32*5+16
    }));

    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Tower({ x: 180, y: 50 }));
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
  box.fit(20);
});

Q.load("cursors.png, cursors.json, level.json, tiles.png", function() {
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
  Q.compileSheets("cursors.png","cursors.json");
  Q.stageScene("level1");
});
