var Dog = Base();

// Visibility handling
Dog.prototype.visible = true;
Dog.prototype.hide = function() { this.visible = false; };
Dog.prototype.show = function() { this.visible = true; };

// Dog dimension
// 56 x 48
(function() {
	var spriteMap = [];
	var size = [56,48];
	var start = [0,56];
	for (var i=0; i < 2; i++) {
		for (var j=0; j < 6; j++) {
			spriteMap.push({
				position : [(start[0]+i*size[0]),(start[1]+j*size[1])],
				size : size
			});
		}
	}
	
	Dog.prototype.spriteMap = spriteMap;
})();

// Create the animations
(function() {
	var animations = {  walk : [], jump : [], fall : [], found1duck : [], found2ducks : [], laugh : [] };
	
	var i;
	// walking
	for (i=0; i<16; i++) {
		animations.walk.push({ duration:100, sprite:((i%4)+1), position:[i*2,133] });
	}
	// sniffing
	for (i=0; i<6; i++) {
		animations.walk.push({ duration:150, sprite:(i%2), position:[32, 133] });
	}
	
	// walking
	for (i=0; i<16; i++) {
		animations.jump.push({ duration:100, sprite:((i%4)+1), position:[32+i*2,133] });
	}
	// sniffing
	for (i=0; i<6; i++) {
		animations.jump.push({ duration:150, sprite:(i%2), position:[64, 133] });
	}
	animations.jump.push({ duration:500, sprite:5, position:[64,133] });
	// jumping
	for (i=0; i<24; i++) {
		animations.jump.push({ duration:20, sprite:6, position:[64+Math.round(i*0.5),125-i] });
	}
	// jump top
	var x = 72, y = 100;
	for (i=0; i<16; i++) {
		if (i<8) {
			x++;
			y--;
		}
		else if (i<16) {
			x++
		}
		else if (i<24) {
			x++;
			y++;
		}
		animations.jump.push({ duration:20, sprite:7, position:[x,y] });
	}
	
	// falling
	for (i=0; i<16; i++) {
		y+=2;
		animations.fall.push({ duration:20, sprite:7, position:[x,y] });
	}
	
	// found 1 duck
	var x=100; y=126;
	for (i=0; i<24; i++) {
		animations.found1duck.push({ duration:20, sprite:8, position:[x,y]});
		y--;
	}
	animations.found1duck.push({ duration:1000, sprite:8, position:[x,y]});
	for (i=0; i<24; i++) {
		animations.found1duck.push({ duration:20, sprite:8, position:[x,y]});
		y++;
	}
	
	// found 2 ducks
	var x=100; y=126;
	for (i=0; i<24; i++) {
		animations.found2ducks.push({ duration:20, sprite:9, position:[x,y]});
		y--;
	}
	animations.found2ducks.push({ duration:1000, sprite:9, position:[x,y]});
	for (i=0; i<24; i++) {
		animations.found2ducks.push({ duration:20, sprite:9, position:[x,y]});
		y++;
	}
	
	// laughing
	var x=100; y=126;
	for (i=0; i<24; i++) {
		animations.laugh.push({ duration:20, sprite:(Math.floor(i/5)%2==0?10:11), position:[x,y]});
		y--;
	}
	for (i=0; i<10; i++) {
		animations.laugh.push({ duration:100, sprite:(i%2?10:11), position:[x,y]});
	}
	for (i=0; i<12; i++) {
		animations.laugh.push({ duration:20, sprite:10, position:[x,y]});
		y+=2;
	}
	
	Dog.prototype.animations = animations;
})();

Dog.prototype.animationQueue = []; // queue of animations to launch
Dog.prototype.currentAnimation = false; // current animation record

/**
 * Adds an animation to the queue
 * @param {Object} animation Object containing animation informations (name, callback) 
 */
Dog.prototype.queueAnimation = function(animation, params) {
	this.animationQueue.push(animation);
}

Dog.prototype.getCurrentAnimationStep = function() {
	// Check if there is a current animation or an animation in the queue
	if (this.currentAnimation === false && this.animationQueue.length === 0) {
		return false;
	}
	
	// If there is a current animation
	if (this.currentAnimation !== false) {
		var currentAnimation = this.animations[this.currentAnimation.name]; // Get current animation steps
		var animationTime = (new Date()).getTime() - this.currentAnimation.start; // Compute time elapsed since the beggining of the animation
		
		// Find animation step
		var stepEnd = 0;
		for (var i=0; i < currentAnimation.length; i++) {
			var step = currentAnimation[i];
			stepEnd += step.duration;
			
			if (stepEnd > animationTime) {
				return i;
			}
		}
		
		// If we get here, animation is over
		// Launch callback & events
		if (this.currentAnimation.callback !== undefined) {
			try {
				this.currentAnimation.callback(this.currentAnimation);
			}
			catch(e) {}
		}
		this.fireEvent('animationEnd', this.currentAnimation);
		
		// Reset currentAnimation
		this.currentAnimation = false;
	}
	
	// Check if there is a next animation in the queue
	if (this.animationQueue.length > 0) {
		this.currentAnimation = this.animationQueue.shift();
		this.currentAnimation.start = (new Date()).getTime();
		return 0;
	}
	
	return false;
}

Dog.prototype.draw = function() {
	if (this.visible === false) {
		return false;
	}
	
	var stepIndex = this.getCurrentAnimationStep();
	
	if (stepIndex === false) {
		return false;
	}
	
	var animation = this.animations[this.currentAnimation.name];
	var step = animation[stepIndex];
	var sprite = this.spriteMap[step.sprite];
	
	var bipmap = new BipMap();
	bipmap.image = game.sprites;
	bipmap.drawSprite(sprite.position[0], sprite.position[1], sprite.size[0], sprite.size[1], step.position[0], step.position[1], sprite.size[0], sprite.size[1]);
};