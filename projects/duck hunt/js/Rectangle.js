var Rectangle = Base();

// Properties
Rectangle.prototype.x = 0;
Rectangle.prototype.y = 0;
Rectangle.prototype.width = 0;
Rectangle.prototype.height = 0;
Rectangle.prototype.color = false;
/*
Rectangle.prototype.borderColor = false;
Rectangle.prototype.borderWidth = 1;
Rectangle.prototype.backgroundColor = false;
*/
// Visibility handling
Rectangle.prototype.visible = true;
Rectangle.prototype.hide = function() { this.visible = false; };
Rectangle.prototype.show = function() { this.visible = true; };

// Property settings
/*Rectangle.prototype.set = function(properties) {
	for (var i in properties) {
		if (properties.hasOwnProperty(i) && this.hasOwnProperty(i))	{
			this[i] = properties[i];
		}
	}
}*/

Rectangle.prototype.draw = function() {
	// Check visibility
	if (this.visible === false) {
		return false;
	}
	
	this.fireEvent('draw', { target : this });
	
	// Draw rectangle
	game.context.fillStyle = this.color;
	game.context.fillRect(this.x, this.y, this.width, this.height);
	/*game.context.beginPath();
	game.context.moveTo(this.x, this.y);
	game.context.lineTo(this.x + this.width, this.y);
	game.context.lineTo(this.x + this.width, this.y + this.height);
	game.context.lineTo(this.x, this.y + this.height);
	game.context.lineTo(this.x, this.y);
	
	// Draw the rectangle
	if (this.borderColor !== false) {
		game.context.strokeStyle = this.borderColor;
		game.context.lineWidth = this.borderWidth;
		game.context.stroke();
	}
	
	// Paint the rectangle
	if (this.backgroundColor !== false) {
		game.context.fillStyle = this.backgroundColor;
		game.context.fill();
	}
	
	game.context.closePath();*/
}