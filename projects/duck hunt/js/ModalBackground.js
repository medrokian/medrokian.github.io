var ModalBackground = Base();

// Properties
ModalBackground.prototype.x = 0;
ModalBackground.prototype.y = 0;
ModalBackground.prototype.width = 0;
ModalBackground.prototype.height = 0;

// Visibility handling
ModalBackground.prototype.visible = true;
ModalBackground.prototype.hide = function() { this.visible = false; };
ModalBackground.prototype.show = function() { this.visible = true; };

ModalBackground.prototype.draw = function() {
	// Check visibility
	if (this.visible === false) {
		return false;
	}
	
	// Border color configuration
	game.context.fillStyle = '#FFF';
	
	// Draw border
	game.context.beginPath();
	game.context.fillRect(this.x+2, this.y, this.width-4, this.height);
	game.context.fillRect(this.x+1, this.y+1, this.width-2, this.height-2);
	game.context.fillRect(this.x, this.y+2, this.width, this.height-4);
	
	// Background color configuration
	game.context.fillStyle = '#000';
	
	// Draw background
	game.context.fillRect(this.x+3, this.y+1, this.width-6, this.height-2);
	game.context.fillRect(this.x+2, this.y+2, this.width-4, this.height-4);
	game.context.fillRect(this.x+1, this.y+3, this.width-2, this.height-6);
}