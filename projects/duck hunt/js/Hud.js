var Hud = Base();

Hud.prototype.values = {
	round:1,
	bullet:3,
	hit:[0,0,0,0,0,0,0,0,0,0],
	goal:6,
	score:0
};

Hud.prototype.gui = {
	bg1:false,
	SHOT:false,
	bullet:false,
	bg2:false,
	hit:false,
	duck:false,
	goal:false,
	bg3:false,
	SCORE:false,
	score:false,
	round:false
};

Hud.prototype.init = function() {
	this.gui.bg1 = new HudBackground();
	this.gui.bg1.set({
		x : 21,
		y : 197,
		width : 29,
		height : 21
	});
	
	this.gui.SHOT = new BipMap();
	this.gui.SHOT.set({
		image : game.sprites,
		spriteX : 176,
		spriteY : 40,
		spriteWidth : 21,
		spriteHeight : 7,
		x : 25,
		y : 208,
		width : 21,
		height : 7
	});
	
	this.gui.bullet = new BipMap();
	this.gui.bullet.set({
		image : game.sprites,
		spriteX : 168,
		spriteY : 40,
		spriteWidth : 4,
		spriteHeight : 7,
		x : 26,
		y : 200,
		width : 4,
		height : 7
	});
	
	this.gui.bg2 = new HudBackground();
	this.gui.bg2.set({
		x : 61,
		y : 197,
		width : 117,
		height : 21
	});
	
	this.gui.HIT = new Text();
	this.gui.HIT.set({
		x : 64,
		y : 200,
		text : 'HIT',
		color : '#88D800'
	});
	
	this.gui.duck = new Text();
	this.gui.duck.set({
		x : 95,
		y : 199,
		text : ['duck'],
		color : '#FFF'
	});
	
	this.gui.goal = new Text();
	
	var goalArray = [];
	for (var i=0; i<this.values.goal; i++) {
		goalArray.push('ruler');
	}
	
	this.gui.goal.text = goalArray;
	this.gui.goal.set({
		x : 96,
		y : 208,
		text : goalArray,
		color : '#64B0FF'
	});
	
	this.gui.bg3 = new HudBackground();
	this.gui.bg3.set({
		x : 189,
		y : 197,
		width : 53,
		height : 21
	});

	this.gui.SCORE = new Text();
	this.gui.SCORE.set({
		x : 200,
		y : 208,
		text : 'SCORE'
	});
	
	this.gui.score = new Text();
	this.gui.score.set({
		x : 192,
		y : 200
	});
	
	this.gui.round = new Text();
	this.gui.round.set({
		x : 24,
		y : 184,
		color : '#88D800'
	});
};

Hud.prototype.draw = function() {
	// Draw all elements
	this.gui.bg1.draw();
	this.gui.SHOT.draw();
	for (var i=0; i<this.values.bullet; i++) {
		this.gui.bullet.x = 26 + i*8;
		this.gui.bullet.draw();
	}
	
	this.gui.bg2.draw();
	this.gui.HIT.draw();

	for (var i=0; i<10; i++) {
		this.gui.duck.x = 95 + i*8;
		this.gui.duck.color = (this.values.hit[i] === 1 ? '#D82800' : '#FFF');
		this.gui.duck.draw();
	}
	
	this.gui.goal.draw();
	
	this.gui.bg3.draw();
	this.gui.SCORE.draw();
	
	var score = this.values.score;
	var scoreText = '000000'
	if (score > 0) {
		if (score > 0 && score < 10) {
			scoreText = '00000';
		} else if (score >= 10 && score < 100) {
			scoreText = '0000';
		} else if (score >= 100 && score < 1000) {
			scoreText = '000';
		} else if (score >= 1000 && score < 10000) {
			scoreText = '00';
		} else if (score >= 10000 && score < 100000) {
			scoreText = '0';
		} else if (score >= 100000) {
			scoreText = '';
		}
		scoreText += score;
	}
	
	this.gui.score.text = scoreText;
	this.gui.score.draw();
	
	this.gui.round.text = 'R='+this.values.round;
	this.gui.round.draw();
};