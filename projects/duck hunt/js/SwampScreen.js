var SwampScreen = Base();

// Stocks objects so we can reuse them
SwampScreen.prototype.gui = {
	sky:false,
	floor:false,
	grass:false,
	duck1:false,
	duck2:false,
	dog:false,
	hud:false,
	modal:false,
	flash:false
};

SwampScreen.prototype.values = {
	round:1, // Round number
	duck:0, // Duck index from 0 to 9
	bullet:3, // Number of bullets left
	goal:6, // Number of ducks that have to be shot to win the round
	hit:[0,0,0,0,0,0,0,0,0,0], // Records if ducks are shot or not
	score:0, // Player's score
	armed : false, // Boolean that controls if the player can fire his gun,
	timer : false
};

// Levels configuration
(function() {
	var config = [];
	for (var i=1; i < 100; i++) {
		var level = { 'speed' : 0, 'goal' : 0, 'points' : {}};
		
		// duck speed (the less the value is, the faster the duck fly)
		level.speed = (i<20 ? 7-(0.25*i) : 2);
		
		/* Goals
		1 through 10 	6 out of 10
		11 through 12 	7 out of 10
		13 through 14 	8 out of 10
		15 through 19 	9 out of 10
		20 through 99 	10 out of 10
		*/
		if (i <= 10) {
			level.goal = 6;
		}
		else if (i <= 12) {
			level.goal = 7;
		}
		else if (i <= 14) {
			level.goal = 8;
		}
		else if (i <= 19) {
			level.goal = 9;
		}
		else {
			level.goal = 10;
		}
		
		/* Points
		Round 	1-5 	6-10 	11-15 	16-20 	21-99
		Black	500 	800 	1000 	1000 	1000
		Blue 	1000 	1500 	2000 	2000 	2000
		Red 	1500 	2400 	3000 	3000 	3000
		Bonus 	10000 	10000 	15000 	20000 	30000
		*/
		if (i <= 5) {
			level.points = { 'black' : 500, 'blue' : 1000, 'red' : 1500, 'perfect' : 10000 };
		}
		else if (i <= 10) {
			level.points = { 'black' : 800, 'blue' : 1500, 'red' : 2400, 'perfect' : 10000 };
		}
		else if (i <= 15) {
			level.points = { 'black' : 1000, 'blue' : 2000, 'red' : 3000, 'perfect' : 15000 };
		}
		else if (i <= 20) {
			level.points = { 'black' : 1000, 'blue' : 2000, 'red' : 3000, 'perfect' : 20000 };
		}
		else {
			level.points = { 'black' : 1000, 'blue' : 2000, 'red' : 3000, 'perfect' : 30000 };
		}
		
		config[i] = level;
	}
	SwampScreen.prototype.config = config;
})();

SwampScreen.prototype.init = function() {
	var _this = this;
	
	this.gui.sky = new Rectangle();
	this.gui.sky.set({
		x : 0,
		y : 0,
		width : game.canvas.width,
		height : 160,
		color : '#64B0FF'
	});
	
	this.gui.floor = new Rectangle();
	this.gui.floor.set({
		x : 0,
		y : 160,
		width : game.canvas.width,
		height : game.canvas.width-160,
		color : '#6B6D00'
	});
	
	this.gui.duck1 = new Duck();
	this.gui.duck1.hide();
	
	this.gui.grass = new BipMap();
	this.gui.grass.set({
		image : game.sprites,
		spriteX : 352,
		spriteY : 0,
		spriteWidth : 256,
		spriteHeight : 166,
		x : 0,
		y : 24,
		width : 256,
		height : 166
	});
	
	this.gui.dog = new Dog();
	
	this.gui.hud = new Hud();
	this.gui.hud.init();
	
	this.gui.modal = new Modal();
	
	this.gui.score = new Score();
	
	this.gui.flash = new Flash();
	
	// When a duck has finished dying, the dog comes to show the dead ducks
	this.gui.duck1.addEventListener('deathEnd', function(e) {
		// Sound of the duck touching the ground
		game.sound.stop('skeet_1');
		game.sound.play('drop');
		
		// Dog picks up the duck
		setTimeout( function() {
			game.sound.play('end_duck_round');
			_this.gui.dog.queueAnimation({ name : 'found1duck', x : e.x, callback : function() {
				_this.values.duck++;
				if (_this.values.duck < 10) {
					_this.start();
				}
				else {
					// Launch round ending
					_this.endRound();
				}
			} });
		}, 250);

	});
	
	// Catch the game click event the shoot ducks
	game.addEventListener('click', function(e) {
		if (_this.values.armed === false) {
			return false;
		}
		
		// Check if the shot must be processed
		if (_this.values.bullet === 0) {
			return false;
		}
		
		game.sound.play('blast');
		_this.gui.flash.start();
		_this.values.bullet--;
		
		var hit = _this.gui.duck1.checkHit(e.x, e.y);
		
		// If the duck is hit
		if (hit === true) {
			// Remove duck fly away timer
			clearTimeout(_this.values.timer);
			
			// Disabling gun
			_this.values.armed = false;
			
			// Adding points from hitting the duck
			var points = _this.config[_this.values.round].points[_this.gui.duck1.color];
			
			// Display the number of points scored
			_this.gui.score.score = points;
			_this.gui.score.setDuck(_this.gui.duck1);
			_this.gui.score.display(1000);
			
			// Increase the score
			_this.values.score += points;
			
			// Change the hit ducks grid
			_this.values.hit[_this.values.duck] = 1;
			
			// Launch dying duck animation
			_this.gui.duck1.die();
			
			// Duck fall sound
			setTimeout(function() {
				game.sound.play('skeet_1');
			}, 500);
		}
		// If the duck is not hit and the player is out of ammos
		else if (_this.values.bullet === 0) {
			_this.stop();
		}
		
		_this.changeHud();
	});
};

/**
 * Starts a duck's fly
 */
SwampScreen.prototype.start = function() {
	// Init values
	var _this = this;
	this.values.bullet = 3; // Reset ammos
	this.values.goal = this.config[this.values.round].goal; // Load goal of current level
	this.gui.sky.color = '#64B0FF'; // Reset the sky's color
	this.gui.duck1.color = ['black', 'blue', 'red'][Math.floor(Math.random()*3)];
	
	// Clean the screen
	game.layerManager.removeAll();
	
	// Add every element to the screen
	game.layerManager.addToTop('swamp.sky', this.gui.sky);
	game.layerManager.addToTop('swamp.floor', this.gui.floor);
	game.layerManager.addToTop('swamp.duck', this.gui.duck1);
	game.layerManager.addToTop('swamp.grass', this.gui.grass);
	game.layerManager.addToTop('swamp.dog', this.gui.dog);
	game.layerManager.addToTop('swamp.hud', this.gui.hud);
	game.layerManager.addToTop('swamp.modal', this.gui.modal);
	game.layerManager.addToTop('swamp.score', this.gui.score); // Number of points scored diplayed when a duck get shot
	game.layerManager.addToTop('swamp.flash', this.gui.flash); // Flashes that get trigerred when the player shoots a duck
	
	// Beginning animation
	if (this.values.duck === 0) {
		// Modal window announcing Round Number
		this.gui.modal.set({
			type : 'round',
			round : this.values.round+''
		});
		this.gui.modal.display(3000);
		
		// Dog animation to begin a round
		if (this.values.round === 1) {
			this.gui.dog.queueAnimation({ 'name' : 'walk' });
		}
		this.gui.dog.queueAnimation({ 'name' : 'jump', 'callback' : function() {
			// Barking sound
			game.sound.play('bark', 2);
			
			// Lower the dog layer for it to be behind the grass
			game.layerManager.lower('swamp.dog');
		} });
		
		this.gui.dog.queueAnimation({ 'name' : 'fall', 'callback' : function() {
			_this.gui.duck1.takeOff(_this.config[_this.values.round].speed);
			_this.values.armed = true;
			
			// Start end of flight timer
			_this.values.timer = setTimeout(function() {
				_this.stop();
			}, 5000);
		} });
		
		// Play start round music
		if (this.values.round === 1) {
			game.sound.play('start_round');
		}
	}
	else {
		game.layerManager.lower('swamp.dog');
		this.gui.duck1.takeOff(this.config[this.values.round].speed);
		this.values.armed = true;
		
		// Start end of flight timer
		_this.values.timer = setTimeout(function() {
			_this.stop();
		}, 5000);
	}
};

/**
 * Stops a duck's fly (make it fly away)
 */
SwampScreen.prototype.stop = function() {
	var _this = this;
	
	var sunsetDuration = 2000;
	
	// Ends duck flight timer (it can already be over, but the duck can also fly away if the player shot 3 bullets)
	clearTimeout(_this.values.timer);
	
	if (_this.gui.duck1.action !== 'fly') {
		return false;
	}
	
	// The duck flies away
	this.gui.duck1.flyAway();
	
	// Modal window for FLY AWAY
	this.gui.sky.color = '#FFCCC5';
	this.gui.modal.type = 'fly away';
	this.gui.modal.display(sunsetDuration);
	
	// Laughing dog animation
	setTimeout(function() {
		if (_this.gui.duck1.action !== 'leave') {
			return false;
		}

		_this.values.armed = false;
		_this.gui.sky.color = '#64B0FF';
		game.sound.play('laugh');
		_this.gui.dog.queueAnimation({ name : 'laugh', callback : function() {
			// Launch next duck of next round
			if (_this.values.duck < 10) {
				_this.values.duck++;
				_this.start();
			}
			else {
				// Launch round ending
				_this.endRound();
			}
		}});
	}, sunsetDuration);
};

/**
 * Ends a round
 */
SwampScreen.prototype.endRound = function(callback) {
	var _this = this;
	
	// Counts killed ducks
	var killed = 0;
	for (var i=0; i < this.values.hit.length; i++) {
		if (this.values.hit[i] === 1) {
			killed++;
		}
	}
	
	// Game Over detection
	if (killed < this.values.goal) {
		// Game Over display
		game.sound.play('lose');
		this.gui.modal.type = 'game over';
		this.gui.modal.display(3000);
		
		
		// Display laughing dog
		setTimeout(function() {
			game.sound.play('win');
			_this.gui.dog.queueAnimation({ name : 'laugh', callback : function() {
				// Back to the main screen
				_this.remove();
				MainScreen.insert();
			}});
		}, 3000);
	}
	else {
		var timer = 0;
		
		// Moving ducks on the left
		var scheduleHit = function(hit, delay, sound) {
			window.setTimeout(function() {
				if (sound === true) {
					game.sound.play('point');
				}
				
				// Display ducks in a certain position
				_this.values.hit = hit;
				_this.changeHud();
			}, delay);
		};
		for (var i=0; i <= (10-killed); i++) {
			var newHit = [];
			var missed = 0;
			for (var j=0; j < 10; j++) {
				if (this.values.hit[j] === 1) {
					newHit.push(this.values.hit[j]);
				}
				else if (missed < i) {
					missed++;
					continue;
				}
				else {
					newHit.push(this.values.hit[j]);
				}
			}
			
			// Complete the grid
			for (j=0; j<(10-newHit.length); j++) {
				newHit.push(0);
			}
			
			// Schedule HUD change
			scheduleHit(newHit, timer, true);
			timer+=500;
		}
		
		// Round won sound
		setTimeout(function() {
			game.sound.play('next_round');
		}, timer);
		
		// Blinking killed ducks
		for (var i=0; i<16; i++) {
			if (i%2===0) {
				scheduleHit([0,0,0,0,0,0,0,0,0,0], timer);
			}
			else {
				scheduleHit(newHit, timer);
			}
			timer += 250;
		}
		
		// Perfect detection
		if (killed === 10) {
			setTimeout(function() {
				// Display perfect modal
				game.sound.play('high_score');
				_this.gui.modal.type = 'perfect';
				_this.gui.modal.perfect = _this.config[_this.values.round].points.perfect;
				_this.gui.modal.display(3000);
				_this.values.score += _this.config[_this.values.round].points.perfect;
				_this.changeHud();
			}, timer);
			timer += 3000;
		}
		
		// Launches next round
		setTimeout(function() {
			_this.values.round++;
			_this.values.duck = 0;
			_this.values.hit = [0,0,0,0,0,0,0,0,0,0];
			_this.start();
		}, timer);
	}
};

SwampScreen.prototype.changeHud = function() {
	this.gui.hud.values = this.values;
};

SwampScreen.prototype.remove = function() {
	game.layerManager.removeAll();
};
