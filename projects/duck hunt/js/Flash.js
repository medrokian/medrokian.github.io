var Flash = new Base();

//Visibility handling
//Flash.prototype.visible = true;
//Flash.prototype.hide = function() { this.visible = false; };
//Flash.prototype.show = function() { this.visible = true; };

// Flash steps 0:off 1:black 2:white 3 black
Flash.prototype.step = 0;

Flash.prototype.rectangle = false;

Flash.prototype.start = function() {
	this.step=1;
	
	if (this.rectangle === false) {
		this.rectangle = new Rectangle();
		this.rectangle.set({
			x : 0,
			y : 0,
			width : game.canvas.width,
			height : game.canvas.height
		});
	}
};

Flash.prototype.draw = function() {
	if (this.step === 0 || this.rectangle === false) {
		return false;
	}
	
	switch (this.step) {
		case 1:
			this.rectangle.color = '#000';
			this.step++;
		break;
		
		case 2:
			this.rectangle.color = '#FFF';
			this.step++;
		break;
		case 3:
			this.rectangle.color = '#000';
			this.step++;
		break;
		case 4:
			this.step = 0;
			return false;
		break;
	}
	
	this.rectangle.draw();
};