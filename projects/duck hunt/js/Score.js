var Score = Base();

// Visibility handling
Score.prototype.visible = false;
Score.prototype.hide = function() { this.visible = false; };
Score.prototype.show = function() { this.visible = true; };

// Chars Properties
Score.prototype.charSpacing = 0;
Score.prototype.charSize =  [4,7];
Score.prototype.position = [128,40];

// Char map init
(function() {
	var charMap = {};
	for (var i=0; i < 10; i++) {
		charMap[(i+'')] = [Score.prototype.position[0]+Score.prototype.charSize[0]*i, Score.prototype.position[1]]
	}
	Score.prototype.charMap = charMap;
})();

Score.prototype.displayDuration = false;
Score.prototype.displayStart = false;

Score.prototype.score = 0;
Score.prototype.x = 0;
Score.prototype.y = 0;

/**
 * Set duck position (and compute score position depending of it)
 */
Score.prototype.setDuck = function(duck) {
	this.x = Math.floor(duck.x+(duck.width-(this.score<1000?3:4)*this.charSize[0])/2);
	this.y = Math.floor(duck.y+(duck.height-this.charSize[1])/2);
};

/**
 * Displays a modal view
 * @params {Number} duration Duration of display (if undefined, display is permanent)
 */
Score.prototype.display = function(duration) {
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

Score.prototype.draw = function() {
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

	// Draw text sprites
	var bipmap = new BipMap();
	bipmap.image = game.sprites;
	var text = this.score+'';
	
	for (var i=0; i<text.length; i++) {
		//game.conScore.fillRect(this.x + (this.charSize[0]+this.charSpacing)*i, this.y, this.charSize[0], this.charSize[1]);
		bipmap.drawSprite(this.charMap[text[i]][0], this.charMap[text[i]][1], this.charSize[0], this.charSize[1], this.x + (this.charSize[0]+this.charSpacing)*i, this.y);
	}
};