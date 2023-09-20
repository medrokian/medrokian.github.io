var Text = Base();

// Visibility handling
Text.prototype.visible = true;
Text.prototype.hide = function() { this.visible = false; };
Text.prototype.show = function() { this.visible = true; };

// Properties
Text.prototype.color = '#FFF';
Text.prototype.charSpacing = 0;
Text.prototype.charSize =  [8,8];

(function() {
	var charMap = {};
	var addLine = function(line, chars) {
		for (var i=0; i < chars.length; i++) {
			charMap[chars[i]] = [Text.prototype.charSize[0]*i, Text.prototype.charSize[1]*line];
		}
	};
	
	addLine(0, ' !"#$%&\'(-*+,-./');
	addLine(1, '0123456789:;<=>?');
	addLine(2, '@ABCDEFGHIJKLMNO');
	addLine(3, 'PQRSTUVWXYZ[\\]^_');
	addLine(4, '`abcdefghijklmno'); 
	
	var line = 'pqrstuvwxyz{|}~'.split('');
	line.push('triangle');
	addLine(5, line);
	
	addLine(6, ['duck', 'ruler', 'arrow', 'copy', '!!']);
	Text.prototype.charMap = charMap;
})();

Text.prototype.text = '';
Text.prototype.x = 0;
Text.prototype.y = 0;

Text.prototype.draw = function() {
	if (this.visible === false) {
		return false;
	}

	game.context.fillStyle = this.color;
	var bipmap = new BipMap();
	bipmap.image = game.sprites;

	for (var i=0; i<this.text.length; i++) {
		game.context.fillRect(this.x + (this.charSize[0]+this.charSpacing)*i, this.y, this.charSize[0], this.charSize[1]);
		bipmap.drawSprite(this.charMap[this.text[i]][0], this.charMap[this.text[i]][1], this.charSize[0], this.charSize[1], this.x + (this.charSize[0]+this.charSpacing)*i, this.y);
	}
};