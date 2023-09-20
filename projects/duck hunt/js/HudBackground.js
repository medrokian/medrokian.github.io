var HudBackground = Base();

// Properties
HudBackground.prototype.x = 0;
HudBackground.prototype.y = 0;
HudBackground.prototype.width = 0;
HudBackground.prototype.height = 0;

// Visibility handling
HudBackground.prototype.visible = true;
HudBackground.prototype.hide = function() { this.visible = false; };
HudBackground.prototype.show = function() { this.visible = true; };

HudBackground.prototype.draw = function() {
	// Check visibility
	if (this.visible === false) {
		return false;
	}
	
	// Border color configuration
	game.context.fillStyle = '#88D800';
	
	// Draw border
	game.context.beginPath();
	game.context.fillRect(this.x+1, this.y, this.width-2, this.height);
	game.context.fillRect(this.x, this.y+1, this.width, this.height-2);
	
	// Background color configuration
	game.context.fillStyle = '#000';
	
	// Draw background
	game.context.fillRect(this.x+2, this.y+1, this.width-4, this.height-2);
	game.context.fillRect(this.x+1, this.y+2, this.width-2, this.height-4);
}