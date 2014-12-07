var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch")
        .setup({width: 1000, height: 600, scaleToFit: true})
        .controls().touch()
        
Q.input.mouseControls();
Q.gravityY = 0;
Q.gravityX = 0;

Q.Sprite.extend("Player",{
    init: function(p) {
        this._super(p, { 
            sheet: "healthy", 
            x: 410, 
            y: 90,
            type: Q.SPRITE_FRIENDLY
        });
        this.add('mouseControls, 2d');

        this.on("hit.sprite",function(collision) {
            if(collision.obj.isA("Tower")) {
                Q.stageScene("endGame",1, { label: "You Won!" }); 
                this.destroy();
            }
        });
    },
    
    step: function(dt) {
        this.p.x = Q.inputs['mouseX'];
        this.p.y = Q.inputs['mouseY'];
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
            frame: 2,
            type: Q.SPRITE_FRIENDLY
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
    stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'tiles' }));
    var testButton = stage.insert(new Q.Button({x: 100, y: 100}));
    var player = stage.insert(new Q.Player());

  
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
