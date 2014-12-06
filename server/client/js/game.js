// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {

    //var socket = io.connect('http://' + document.domain + ':' + location.port);

    // Set up an instance of the Quintus engine  and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
    // Maximize this game to whatever the size of the browser is
        .setup({ width: 800, height: 450, maximize: true })
    // And turn on default input controls and touch input (for UI)
        .controls().touch();

    Q.input.keyboardControls();

    // ## Background Sprite
    Q.Sprite.extend("Background", {
        init: function(p) {
            this._super(p, {
                type: Q.SPRITE_NONE
            });
        }
    });    




    
    // ## Player Sprite
    // The very basic player sprite, this is just a normal sprite
    // using the player sprite sheet with default controls added to it.
    Q.Sprite.extend("Player", {
	// the init constructor is called on creation
	init: function(p) {
	    // You can call the parent's constructor with this._super(..)
	    this._super(p, {
		type: Q.SPRITE_PLAYER,
		sheet: "cursors",  // Setting a sprite sheet sets sprite width and height
		sprite: "healthy",
		x: 500,           // You can also set additional properties that can
		y: 100,            // be overridden on object creation

		hp: 6,
	    });
	    this.add('2d, Touch, animation');
	}
    });


    Q.Sprite.extend("Enemy", {
	init: function(e) {
	    this._super(e, {
		type: Q.SPRITE_PLAYER,
		sheet: "cursors",
		sprite: "diseased",
		x: 600,
		y: 120,

		hp: 6,
	    });
	    this.add('2d, animation');
	}
    });


    // the entire game is on this one (screen) level
    Q.scene("one", function(stage) {


	// Add in a tile layer, and make it the collision layer
//        var tiles = stage.collisionLayer(new Q.TileLayer({
//            dataAsset: 'level.json',
//            sheet:     'tiles' }));

//	tiles.p.y += 10; // adjust tiles a little
	
	// Add in the controllable player
	var player = stage.insert(new Q.Player());
	console.log('player added');

	
	stage.insert(new Q.Enemy({ x: 100, y: 200 }));


    });



    // asset loading
    Q.load(["cursors.png", "cursors.json", "level.json", "tiles.png"], function() {
	// return a Q.SpriteSheet or create a new sprite sheet
	Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });
	
	// Or from a .json asset that defines sprite locations
	Q.compileSheets("cursors.png", "cursors.json");
    });
	

    // start the game
    Q.stageScene("one");


});

		    
