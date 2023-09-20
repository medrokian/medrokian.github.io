var MainScreen = Base();

MainScreen.prototype.insert = function() {
	var bg = new Rectangle();
	bg.set({
		x : 0,
		y : 0,
		width : game.canvas.width,
		height : game.canvas.height,
		color : '#000'
	});
	game.layerManager.addToBottom('title.bg', bg);
	
	var title1 = new MainScreenTitle();
	title1.set({
		x : 32,
		y : 16,
		text : 'DUCK'
	});
	game.layerManager.addToTop('title.title1', title1);
	
	var titleLine = new Rectangle();
	titleLine.set({
		x : 32,
		y : 64,
		width : 192,
		height : 2,
		color : '#EA9E22'
	});
	game.layerManager.addToTop('title.titleLine', titleLine);
	
	
	var title2 = new MainScreenTitle();
	title2.set({
		x : 72,
		y : 72,
		text : 'HUNT'
	});
	game.layerManager.addToTop('title.title2', title2);
	
	var copyrightText = '1984 NINTENDO CO.,LTD.'.split('');
	copyrightText.unshift('copy');
	var copyright = new Text();
	copyright.set({
		text : copyrightText,
		x : 40,
		y : 200
	});
	game.layerManager.addToTop('title.copyright', copyright);
	
	var gameA = new Text();
	gameA.set({
		text : 'GAME A   1 DUCK',
		x : 64,
		y : 128,
		color : '#EA9E22'
	});
	game.layerManager.addToTop('title.gameA', gameA);
	
	var gameB = new Text();
	gameB.set({
		text : 'GAME B   2 DUCKS',
		x : 64,
		y : 144,
		color : '#EA9E22'
	});
	game.layerManager.addToTop('title.gameB', gameB);
	
	var gameC = new Text();
	gameC.set({
		text : 'GAME C   CLAY SHOOTING',
		x : 64,
		y : 160,
		color : '#EA9E22'
	});
	game.layerManager.addToTop('title.gameC', gameC);
	
	var arrow = new Text();
	arrow.set({
		text : ['arrow'],
		x : 48,
		y : 128
	});
	game.layerManager.addToTop('title.arrow', arrow);
	
	var topScore = new Text();
	topScore.set({
		text : 'TOP SCORE = 12000',
		x : 57,
		y : 184,
		color : '#5CE430'
	});
	game.layerManager.addToTop('title.topScore', topScore);
	
	/* Flashes that get trigerred when the player shoots a duck */
	var flash = new Flash();
	game.layerManager.addToTop('title.flash', flash);
	
	var _this = this;
	var clickHandler = function(e) {
		flash.start();
		
		setTimeout(function() {
			_this.fireEvent('choice', { choice : 'A' });
			game.removeEventListener('click', clickHandler);
		},250);
	};
	game.addEventListener('click', clickHandler);
	
	// Play main screen music
	game.sound.play('start_game');
};

MainScreen.prototype.remove = function() {
	game.layerManager.removeAll();
};
