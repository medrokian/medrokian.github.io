var BipMap = Base();
 
/* Image handling */
BipMap.prototype.image = false;
BipMap.prototype.load = function(src, callback) {
	this.image = new Image();
	
	// Reference to this to call in the image.onload
	var _this = this;
	
	// Image loader
	this.image.onload = function() {
		// Load error handling
		if(!this.complete) {
			console.error('BipMap.load error');
			_this = undefined;
			return false;
		}
		
		// Fire internal event
		_this.fireEvent('load');
		
		// Fire callback
		if (callback !== undefined) {
			callback();
		}
		
		// Remove external references (avoid memory leaks)
		callback = undefined;
		_this = undefined;
	}
	
	// Start loading
	this.image.src = src;
}


/* Sprites managing */
BipMap.prototype.spriteX = false;
BipMap.prototype.spriteY = false;
BipMap.prototype.spriteWidth = false;
BipMap.prototype.spriteHeight = false;
BipMap.prototype.x = false;
BipMap.prototype.y = false;
BipMap.prototype.width = false;
BipMap.prototype.height = false;

BipMap.prototype.setSprite = function(x, y, width, height) {
	this.spriteX = x;
	this.spriteY = y;
	this.spriteWidth = width;
	this.spriteHeight = height;
};
	
BipMap.prototype.moveSprite = function(x, y) {
	this.spriteX = x;
	this.spriteY = y;
};

BipMap.prototype.position = function(x, y) {
	this.x = x;
	this.y = y;
};

BipMap.prototype.size = function(width, height) {
	this.width = width;
	this.height = height;
}

/**
 * Draw a BipMap with the properties set
 */
BipMap.prototype.draw = function() {
	// Draw the sprite in the canvas
	game.context.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
};

/**
 * Draws a sprite without setting the properties
 */
BipMap.prototype.drawSprite = function(spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height) {
	// Check parameters
	if (spriteX === undefined || spriteY === undefined || spriteWidth === undefined || spriteHeight === undefined) {
		return false;
	}
	
	// Default parameters
	if (x === undefined) {
		x = 0;
	}
	if (y === undefined) {
		y = 0;
	}
	if (width === undefined) {
		width = spriteWidth;
	}
	if (height === undefined) {
		height = spriteHeight;
	}
	
	// Draw the sprite
	game.context.drawImage(this.image, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height);
};