var Game = Base();

// Public properties
Game.prototype.canvas = false;
Game.prototype.context = false;
Game.prototype.layerManager = false;
Game.prototype.sprites = false;
Game.prototype.sound = false;

/**
 * Launch the game
 * @param Object params Several parameters for game initialization
 *    - canvasId : id of the target canvas (needed)
 *    - fpsId : id of the element where fps are displayed
 *    - sound : if true, sounds will be played during the game
 */
Game.prototype.init = function(params) {
	// Game config
	var canvasWidth = 256;
	var canvasHeight = 224;
	var fpsTarget = 60;
	
	// Canvas target checks
	if (!params.canvasId) {
		return false;
	}
	
	this.canvas = document.getElementById(params.canvasId);
	if (!this.canvas) {
		return false;
	}
	
	// Canvas dimensions
	this.canvas.width = canvasWidth;
	this.canvas.height = canvasHeight;
	
	// Canvas interactions
	var _this = this;
	this.canvas.addEventListener('mousedown', function(e) {
		// Convert click position to canvas resolution
		_this.fireEvent('click', { x : Math.round(((e.clientX-e.target.offsetLeft)*e.target.height)/e.target.clientHeight), y : Math.round(((e.clientY-e.target.offsetTop)*e.target.height)/e.target.clientHeight) });
	});
	
	// Get context
	this.context = this.canvas.getContext("2d");
	
	// Load sprites
	this.sprites = new Image();
	this.sprites.src = 'images/sprites.png';
	
	// Load sounds
	this.sound = new Sound();
	if (!!params.sound) {
		this.sound.init();
	}
	
	// Create LayerManager
	this.layerManager = new LayerManager();
	
	// Game loading
	var main = new MainScreen();
	main.addEventListener('choice', function(e) {
		// Remove main screen
		main.remove();
		
		// Stop all sounds (mainly main scren music)
		game.sound.stopAll();
		
		if (e.choice === 'A') {
			var swamp = new SwampScreen();
			swamp.init();
			swamp.start();
		}
	});
	main.insert();
	
	// Fps counter initialization
	var fpsCount = false;
	var fpsCounter = 0;
	var fpsElement = false;
	if (params.fpsId) {
		fpsElement = document.getElementById(params.fpsId);
		if (fpsElement) {
			fpsCount = true;
		}
	}
	
	// Game Loop
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame        || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){ window.setTimeout(callback, 1000/fpsTarget);};
    })();
	
	(function animloop(){
		requestAnimFrame(animloop);
		game.context.clearRect(0,0, game.canvas.width, game.canvas.height);
		game.layerManager.draw();
		
		if (fpsCount === true) {
			fpsCounter++;
		}
	})();

	// Launch FPS counter
	if (fpsCount === true) {
		setInterval(function() {
			fpsElement.innerHTML = fpsCounter+' fps';
			fpsCounter = 0;
		}, 1000);
	}
};

/**
 * Checks FullScreen API availability
 */
Game.prototype.checkFullScreen = function() {
	return !!(this.canvas.requestFullScreen || this.canvas.webkitRequestFullScreen || this.canvas.mozRequestFullScreen);
}

//
Game.prototype.goFullScreen = function() {
	// Check FullScreen API availability
	if (!this.checkFullScreen()) {
		return false
	}
	
	if(this.canvas.requestFullScreen) {
		this.canvas.requestFullScreen();
	}
	else if (this.canvas.webkitRequestFullScreen) {
		this.canvas.webkitRequestFullScreen();
	}
	else if (this.canvas.mozRequestFullScreen) {
		this.canvas.mozRequestFullScreen();
	}
	else {
		return false;
	}
};