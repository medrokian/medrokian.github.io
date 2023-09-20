var MainScreenTitle = Base();

// Visibility handling
MainScreenTitle.prototype.visible = true;
MainScreenTitle.prototype.hide = function() { this.visible = false; };
MainScreenTitle.prototype.show = function() { this.visible = true; };

// Properties
MainScreenTitle.prototype.charImage = 'images/sprites.png';
MainScreenTitle.prototype.charSpacing = 8;
MainScreenTitle.prototype.charSize =  [32,40]
MainScreenTitle.prototype.charMap = {
	'D' : [128,0],
	'U' : [160,0],
	'C' : [192,0],
	'K' : [224,0],
	'H' : [256,0],
	'N' : [288,0],
	'T' : [320,0]
};

MainScreenTitle.prototype.text = '';
MainScreenTitle.prototype.x = 0;
MainScreenTitle.prototype.y = 0;

MainScreenTitle.prototype.draw = function() {
	if (this.visible === false) {
		return false;
	}
	
	var bipmap = new BipMap();
	bipmap.image = game.sprites;
	for (var i=0; i<this.text.length; i++) {
		bipmap.drawSprite(this.charMap[this.text[i]][0], this.charMap[this.text[i]][1], this.charSize[0], this.charSize[1], this.x + (this.charSize[0]+this.charSpacing)*i, this.y);
	}
};