


var Q = Quintus({
    dataPath: 'http://' + document.domain + ':' + location.port + '/data/'
})
    .include("Sprites, Scenes, Input, 2D, Touch, UI")
    .setup({width: 1024, height: 640, scaleToFit: true})
    .controls()
    .touch();


Q.input.mouseControls();
Q.gravityY = 0;
Q.gravityX = 0;








Q.Sprite.extend("GhostPlayer", {
   init: function(p) {
       this._super(p, {
           sheet: "ghost",
           cx: 0,
           cy: 0,
           y: 1000
       });
    },

    step: function(dt) {
        this.p.x = Q.inputs['mouseX'];
        this.p.y = Q.inputs['mouseY'];        
    }
});

Q.MovingSprite.extend("Player",{
    init: function(p) {
        this._super(p, {
            sheet: "healthy", 
            x: 410,
            y: 90,
            cx: 16,
            cy: 16,
            scale: 0.5,
            type: Q.SPRITE_FRIENDLY,
            
            followCursor: true,
            collisionWarning: false
        });
        this.add('mouseControls, 2d');
        this.on("hit", this,"collision");
        this.on("hit.sprite", function(collision) {
            if (collision.obj.isA("Spike")) {
                Q.stageScene("endGame",1, { label: "You got hit by spikes" });
                this.destroy();            
            }
        });
    },

    collision: function(col) {
        // .. do anything custom you need to do ..
        // Move the sprite away from the collision
        this.p.followCursor = false;
        console.dir(col.separate);
        this.p.x -= col.separate[0];
        this.p.y -= col.separate[1];
        console.log('col');
    },

    step: function(dt) {
        // follow mouse if mouse isn't going through wall
        if (!this.p.collisionWarning) {
            this.p.x = Q.inputs['mouseX'];
            this.p.y = Q.inputs['mouseY'];
        }
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
            type: Q.SPRITE_UI,
            cx:16,
            cy:16
        });

        this.on("touch", function(t) {
            //console.log('button touched.');
            var buttonFrame = t.obj.p.frame;

            Q.select("Trap", Q.activeStage.i).items.forEach(function(trap) {
                if (trap.p.frame == buttonFrame) {
                    Q.stage(0).insert(new Q.Spike({
                        y: trap.p.y + 16,
                        x: trap.p.x + 16,
                        //frame: t.obj.p.frame // match frame
                    }));

                    trap.destroy();
                    t.obj.destroy();
                    // @todo socket delete button & trap
                }
            });
        });
    }
});

Q.Sprite.extend("Trap", {
   init: function(p) {
       this._super(p, {
           sheet: 'tiles',
           type: Q.SPRITE_UI,
           cx: 0,
           cy: 0,
           z: 100
       });
   }
});

Q.Sprite.extend("Spike", {
    init: function(p) {
        this._super(p, {
            sheet: 'spikes',
            type: Q.SPRITE_ENEMY,
            scale: 4,
            z: -10,

            lifeSpan: 0.5,
            age: 0,
            born: 0
        });

        this.on("hit", this, function(collision) {
            console.log('collision');
            if(collision.obj.isA("Player")) { 
                Q.stageScene("endGame",1, { label: "You Died" }); 
                collision.obj.destroy();
            }
        });
    },

    step: function(dt) {
        // live and enjoy being a spike for a short time, then die.
        if (this.p.born) {
            if (this.p.age >= this.p.lifeSpan) {
                // kill if life over
                this.destroy();
            }
            else {
                // age and rotate
                this.p.age = Q.stage(0).time - this.p.born > this.p.lifeSpan
                this.p.angle += 500 * dt;
            }
        }
        else {
            // get birthed
            this.p.born = Q.stage(0).time;
        }
    }
});

Q.Sprite.extend("Enemy", {
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



Q.scene("level1", function(stage) {
    //var net = stage.insert(new Q.Netty());
    

                   
    var trapButton1 = stage.insert(new Q.Button({
        x: 32*1+16, 
        y: 32*1+16,
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

    var trap1 = stage.insert(new Q.Trap({
        x: 32*10+16,
        y: 32*10+16,
        frame: 10
    }));

    var player = stage.insert(new Q.Player({
        x: 32*30+16,
        y: 32*5+16
    }));
});

Q.scene('endGame', function(stage) {
    var player = stage.insert(new Q.GhostPlayer());

    var box = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));

    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
    var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
    button.on("click", function() {
        Q.clearStages();
        Q.stageScene('level1');
        });
    box.fit(20);
});


var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('join', function(join) {
    console.log('player ' + join.id + ' joined with ' + join.cursor + '. msg: ' + join.msg + ' ' + join.nextRound);
        //        var box = Q.stage(0).insert(new Q.UI.Container({
        //            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        //        }));
        //        var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
        //                                        label: join.msg }));
});

// get map from server
socket.on("start", function(round) {
    console.log('start signal received');

    console.log(round.levelName);
    // Save level to the current session's store

    // download and cache level
    //mazeUrl = 'http://' + document.domain + ':' + location.port + '/data/' + round.levelName;

    // load the level
    Q.load(round.levelName, function() {
        Q.stageScene("level1");
        var border = Q.scene(0).collisionLayer(new Q.TileLayer({ 
            dataAsset: round.levelName,
            sheet: 'tiles',
        }));
    });
});

Q.load("cursors.png, cursors.json, tiles.png", function() {
    Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });
    Q.compileSheets("cursors.png", "cursors.json");
});

Quintus.Netty = function(Q) {
    Q.connect = function() {
        return io.connect('http://' + document.domain + ':' + location.port);
    }
};


document.addEventListener('beforeunload', function() {
    socket.close(); 
});