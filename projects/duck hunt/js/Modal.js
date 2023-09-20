var Modal = Base();

//Visibility handling
Modal.prototype.visible = true;
Modal.prototype.hide = function() { this.visible = false; };
Modal.prototype.show = function() { this.visible = true; };


Modal.prototype.type = false; // values : "game over", "fly away", "round", "perfect", "pause"
Modal.prototype.round = 0;
Modal.prototype.perfect = 10000;


Modal.prototype.displayDuration = false;
Modal.prototype.displayStart = false;

Modal.prototype.drawRound = function() {
	var bg = new ModalBackground();
	bg.set({
		x : 107,
		y : 43,
		width : 49,
		height : 33
	});
	
	var ROUND = new Text();
	ROUND.set({
		x : 112,
		y : 48,
		text : 'ROUND'
	});
	
	var number = new Text();
	number.set({
		x : (this.round < 10 ? 129 : 120),
		y : 64,
		text : this.round
	});
	
	bg.draw();
	ROUND.draw();
	number.draw();
};

Modal.prototype.drawGood = function() {
	// TODO
};

Modal.prototype.drawPerfect = function() {
	var bg = new ModalBackground();
	bg.set({
		x : 99,
		y : 43,
		width : 73,
		height : 33
	});
	
	var PERFECT = new Text();
	PERFECT.set({
		x : 104,
		y : 48,
		text : ['P','E','R','F','E','C','T','!!']
	});
	
	var points = new Text();
	points.set({
		x : 113,
		y : 64,
		text : this.perfect+''
	});
	
	bg.draw();
	PERFECT.draw();
	points.draw();
};

Modal.prototype.drawPause = function() {
	var bg = new ModalBackground();
	bg.set({
		x : 107,
		y : 43,
		width : 49,
		height : 33
	});
	
	var PAUSE = new Text();
	PAUSE.set({
		x : 112,
		y : 56,
		text : 'PAUSE'
	});

	bg.draw();
	PAUSE.draw();
};

Modal.prototype.drawGameOver = function() {
	var bg = new ModalBackground();
	bg.set({
		x : 91,
		y : 35,
		width : 81,
		height : 33
	});
	
	var GAMEOVER = new Text();
	GAMEOVER.set({
		x : 96,
		y : 48,
		text : 'GAME OVER'
	});

	bg.draw();
	GAMEOVER.draw();
};

Modal.prototype.drawFlyAway = function() {
	var bg = new ModalBackground();
	bg.set({
		x : 91,
		y : 51,
		width : 73,
		height : 17
	});
	
	var FLYAWAY = new Text();
	FLYAWAY.set({
		x : 96,
		y : 56,
		text : 'FLY AWAY'
	});

	bg.draw();
	FLYAWAY.draw();
};

/**
 * Displays a modal view
 * @params {Number} duration Duration of display (if undefined, display is permanent)
 */
Modal.prototype.display = function(duration) {
	if (duration === undefined) {
		this.displayDuration = false;
		this.displayStart = false;
		this.show();
		return true;
	}
	
	this.show();
	this.displayDuration = duration;
	this.displayStart = (new Date()).getTime();
}

Modal.prototype.draw = function() {
	// Check visibility
	if (this.visible !== true) {
		return false;
	}
	
	// Check visibility duration
	if (this.displayDuration !== false && this.displayStart !== false) {
		if (this.displayStart+this.displayDuration < (new Date()).getTime()) {
			this.hide();
			this.displayStart = false;
			this.displayDuration = false;
			return false;
		}
	}
	
	switch (this.type) {
		case 'game over':
			this.drawGameOver();
		break;
		case 'fly away':
			this.drawFlyAway();
		break;
		case 'round':
			this.drawRound();
		break;
		case 'good':
			this.drawGood();
		break;
		case 'perfect':
			this.drawPerfect();
		break;
		case 'pause':
			this.drawPause();
		break;
	}
};