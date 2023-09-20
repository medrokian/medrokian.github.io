var Duck = Base();

//Visibility handling
Duck.prototype.visible = true;
Duck.prototype.hide = function() { this.visible = false; };
Duck.prototype.show = function() { this.visible = true; };

// Duck Properties
Duck.prototype.color = 'black'; // Possible values : "black", "blue", "red"
Duck.prototype.action = 'fly'; // Possibles values : "fly", "die", "leave"
Duck.prototype.x = false;
Duck.prototype.y = false;
Duck.prototype.width = 34;
Duck.prototype.height = 32;
Duck.prototype.currentMovement = false; // index of the current movement
Duck.prototype.currentSpeed = false; // microseconds between every movement
Duck.prototype.currentMovementStart = false; // microtime of the last movement
Duck.prototype.currentMovementBeginning = false; // microtime of the beggining of the movement

Duck.prototype.area = { // Area in which a duck can fly
	'minX' : -4,
	'maxX' : 260,
	'minY' : 0,
	'maxY' : 170
};

// Movements configuration
Duck.prototype.startX = [50,130,200]; // Points from which the ducks can take off

(function(){
	//Every possible duck movement (x and y movements) indexed clockwise from 0 to 16 (0 is down, 4 is left, 8 is up, 12 is right)
	var movement = [[0,1],[-1,2],[-1,1],[-2,1],[-1,0],[-2,-1],[-1,-1],[-1,-2],[0,-1],[1,-2],[1,-1],[2,-1],[1,0],[2,1],[1,1],[1,2]];
	Duck.prototype.movement = movement;
	
	var movementGrouped = [[1,3],[5,7],[9,11],[13,14,15]];
	var movementSimilar = [];
	for (var i=0; i<movementGrouped.length; i++) {
		for (var j=0; j<movementGrouped[i].length; j++) {
			movementSimilar[movementGrouped[i][j]] = movementGrouped[i];
		}
	}
	Duck.prototype.movementSimilar = movementSimilar;
	
	// Compute document movement distances
	var movementDistance = [];
	for (var i=0; i<movement.length;i++) {
		// We pythagorize the movement coordinates to get the movement distance 
		movementDistance[i] = Math.sqrt(Math.pow(movement[i][0],2)+Math.pow(movement[i][1],2));
		
		// We round it to nearest 0.1 (for performance)
		movementDistance[i] = Math.round(movementDistance[i]*10)/10;
	}
	
	Duck.prototype.movementDistance = movementDistance;
})();

Duck.prototype.cleanMovement = function(movement) {
	return (movement+16)%16;
};

//Duck dimension
//34x32
(function(){
	var spriteMap = {};
	var size = [Duck.prototype.width,Duck.prototype.height];
	var start = [112,56];
	var colors = ['black', 'red', 'blue'];

	for (var i=0; i<colors.length; i++) {
		spriteMap[colors[i]] = [];
	}
	
	for (var i=0; i<6; i++) {
		var color = colors[Math.floor(i/2)];
		
		for (var j=0; j<9; j++) {
			spriteMap[color].push({
				position : [(start[0]+i*size[0]),(start[1]+j*size[1])],
				size : size
			});
		}
	}
	Duck.prototype.spriteMap = spriteMap;
})();

// Create the animations
(function(){
	var animations = {
		rightup : [],
		right : [],
		shot : [],
		fall : [],
		leftup : [],
		left : [],
		up : []
	};
	
	var animationConfig = [{
		name : 'rightup',
		sprites : 3,
		interval : 100
	},
	{
		name : 'right',
		sprites : 3,
		interval : 100
	},
	{
		name : 'shot',
		sprites : 1,
		interval : 500
	},
	{
		name : 'fall',
		sprites : 2,
		interval : 100
	},
	{
		name : 'leftup',
		sprites : 3,
		interval : 100
	},
	{
		name : 'left',
		sprites : 3,
		interval : 100
	},
	{
		name : 'up',
		sprites : 3,
		interval : 100
	}];
	
	var spriteIndex = 0;
	for (var i=0; i<animationConfig.length; i++) {
		var animation = animationConfig[i];
		
		for (var j=0; j<animation.sprites; j++) {
			animations[animation.name].push({ duration:animation.interval, sprite:spriteIndex++ });
		}
	}
	
	Duck.prototype.animations = animations;
})();

Duck.prototype.movementAnimation = ['up','leftup','left','left','left','left','left','leftup','up', 'rightup','right','right','right','right','right','rightup'];

/**
 * Launches the duck's flying action
 */
Duck.prototype.takeOff = function(speed) {
	this.action = 'fly';
	
	// Choose a start position
	var position = this.startX[Math.floor(Math.random()*this.startX.length)];
	this.x = position;
	this.y = this.area.maxY-this.height;
	
	// Choose direction
	var movementTakeOff = [5,7,9,11];
	this.currentMovement = movementTakeOff[Math.floor(Math.random()*movementTakeOff.length)];
	this.currentMovementStart = (new Date()).getTime();
	this.currentMovementBeggining = (new Date()).getTime();
	this.currentSpeed = speed;

	this.show();
};

/**
 * Launches the duck's flying away action
 */
Duck.prototype.flyAway = function() {
	this.action = 'leave';
	
	// Shot duck animation
	var movementLeave = [7,8,9];
	this.currentMovement = movementLeave[Math.floor(Math.random()*movementLeave.length)];
	this.currentMovementStart = (new Date()).getTime();
	this.currentMovementBeggining = (new Date()).getTime();
};

/**
 * Launches the duck's diying action
 */
Duck.prototype.die = function() {
	this.action = 'die';
	
	// Shot duck animation
	this.currentMovement = 0;
	this.currentMovementStart = (new Date()).getTime();
	this.currentMovementBeggining = (new Date()).getTime();
	this.currentSpeed = 8;
};

/**
 * Checks if the duck position is out of the frame
 * @returns false if there is no collision, or the rebound direction if there is a collision 
 */
Duck.prototype.checkCollision = function() {
	var rebound = 0;
	var collision = 0;
	
	if (this.y < this.area.minY) {
		//rebound += 0;
		collision++;
	}
	if (this.y+this.height > this.area.maxY) {
		rebound += 8;
		collision++;
	}
	if (this.x < this.area.minX) {
		rebound += 12;
		collision++;
	}
	if (this.x+this.width > this.area.maxX) {
		rebound += 4;
		collision++;
	}
	
	// If there is no collision at all, we return false
	if (collision === 0) {
		return false;
	}
	
	// If there is a collision with several borders (t=duck is in a corner), we return the movement to get out
	if (collision.out === 2) {
		rebound /= 2; // Rebound is the sum of the directions needed to escape, we've got two of them so we need to divide by 2 to have the average direction to get out of the corner
		return rebound;
	}
	
	// If the current movement is the same as the rebound, it means that the duck is currently getting out
	if (this.currentMovement === rebound) {
		return false;
	}
	
	// There is a collision with one border, we return the rebound direction
	// The rebound movement is symetric to the opposite of the incoming movement by the reaction movement
	var opposite = this.cleanMovement(this.currentMovement+8);
	return this.cleanMovement(rebound + (rebound-opposite));
}

Duck.prototype.move = function() {
	// Check properties
	if (this.currentMovement === false || this.currentMovementStart === false || this.currentSpeed === false || this.x === false || this.y === false) {
		return false;
	}

	// Check that it's time to move the duck
	var now = (new Date()).getTime();
	if ((now - this.currentMovementStart) < (this.currentSpeed*this.movementDistance[this.currentMovement])) {
		return true;
	}
	
	// Compute number of duck move to do since last movement
	var nbCycle = Math.floor((now - this.currentMovementStart)/(this.currentSpeed*this.movementDistance[this.currentMovement])); // Compute how many movement cycles have passed
	if (nbCycle === 0) {
		return true;
	}
	
	this.currentMovementStart = now;
	for (var i=0; i<nbCycle; i++) {
		// Move duck to the cycle
		this.x += this.movement[this.currentMovement][0];
		this.y += this.movement[this.currentMovement][1];
		
		// Check collision
		var rebound = this.checkCollision();
		if (rebound === false) {
			continue;
		}
		
		// We roll a dice from 0 to 9
		var dice = Math.floor(Math.random()*10);
		
		switch (dice) {
			// Duck makes a U-turn
			case 0:
				rebound = this.cleanMovement(this.currentMovement+8);
			break;
			// Slight trajectory change
			case 1:
			case 2:
			case 3:
			case 4:
				var similar = this.movementSimilar[rebound];
				rebound = similar[Math.floor(Math.random()*similar.length)];
			break;
		}

		this.currentMovement = rebound;
		this.currentMovementBeggining = now;
		
		// The duck moves to get out of collision
		this.x += this.movement[this.currentMovement][0];
		this.y += this.movement[this.currentMovement][1];
		
		return true;
	}
	
	return true;
};

/**
 * Process the dying animation and 
 */
Duck.prototype.agonize = function() {
	// Check properties
	if (this.currentMovement === false || this.currentMovementStart === false || this.currentSpeed === false || this.x === false || this.y === false) {
		return false;
	}
	
	// Check if the duck is in the shot phase
	var now = (new Date()).getTime();
	if ((now-this.currentMovementStart) < 500) {
		return this.spriteMap[this.color][6];
	}
	
	// Checks if the duck touched the ground
	if (this.y+this.height > this.area.maxY) {
		this.fireEvent('deathEnd', this);
		this.hide();
		return false;
	}
	
	// Move the duck down
	this.y += 2;
	
	// Find the right sprite to display
	var animation = this.animations.fall;
	var time = (new Date()).getTime() - this.currentMovementBeggining;
	
	var step = 0;
	var animationTime = 0;
	for (var animationTime=0; animationTime<time; animationTime+=animation[step].duration) {
		step = (step+1)%animation.length;
	}

	return this.spriteMap[this.color][animation[step].sprite];
};

Duck.prototype.leave = function() {
	// Check properties
	if (this.currentMovement === false || this.currentMovementStart === false || this.currentSpeed === false || this.x === false || this.y === false) {
		return false;
	}

	// Check that it's time to move the duck
	var now = (new Date()).getTime();
	if ((now - this.currentMovementStart) < (this.currentSpeed*this.movementDistance[this.currentMovement])) {
		return true;
	}
	
	// Compute duck position
	var nbCycle = Math.floor((now - this.currentMovementStart)/(this.currentSpeed*this.movementDistance[this.currentMovement])) // Compute how many movement cycles have passed
	
	if (nbCycle === 0) {
		return true;
	}
	
	this.currentMovementStart = now;
	for (var i=0; i<nbCycle; i++) {
		// Move duck to the cycle
		this.x += this.movement[this.currentMovement][0];
		this.y += this.movement[this.currentMovement][1];
		
		// Check collision
		var collision = this.checkCollision();
		if (collision === true) {
			this.fireEvent('leaveEnd', this);
			this.hide();
			return false;
		}
		/*
		// We roll a dice from 0 to 9
		var dice = Math.floor(Math.random()*10);
		
		switch (dice) {
			// Duck makes a U-turn
			case 0:
				rebound = this.cleanMovement(this.currentMovement+8);
			break;
			// Slight trajectory change
			case 1:
			case 2:
			case 3:
			case 4:
				var similar = this.movementSimilar[rebound];
				rebound = similar[Math.floor(Math.random()*similar.length)];
			break;
		}

		this.currentMovement = rebound;
		this.currentMovementBeggining = now;
		
		// The duck moves to get out of collision
		this.x += this.movement[this.currentMovement][0];
		this.y += this.movement[this.currentMovement][1];
		
		return true;
		*/
	}
	
	return true;
};

/**
 * Returns the sprite of the current movement
 */
Duck.prototype.getSprite = function() {
	if (this.currentMovement === false) {
		return false;
	}
	
	var animation = this.animations[this.movementAnimation[this.currentMovement]];
	var time = (new Date()).getTime() - this.currentMovementBeggining;
	
	var step = 0;
	var animationTime = 0;
	for (var animationTime=0; animationTime<time; animationTime+=animation[step].duration) {
		step = (step+1)%animation.length;
	}

	return this.spriteMap[this.color][animation[step].sprite];
};

/**
 * Checks if a shot coordinates can make a hit on the duck
 */
Duck.prototype.checkHit = function(x,y) {
	return x>this.x && x < (this.x+this.width) && y > this.y && y < (this.y+this.height);
}

Duck.prototype.draw = function() {
	// Check visibility
	if (this.visible === false) {
		return false;
	}
	
	// Shot duck case
	var sprite = false;
	if (this.action === 'fly') {
		// Compute next position
		if (false === this.move()) {
			return false;
		}

		// Get current sprite
		sprite = this.getSprite();
	}
	else if (this.action === 'die') {
		// Compute next position
		sprite = this.agonize();
	}
	else if (this.action === 'leave') {
		// Compute next position
		if (false === this.leave()) {
			return false;
		}

		// Get current sprite
		sprite = this.getSprite();
	}
	
	if (sprite === false) {
		return false;
	}
	
	var bmp = new BipMap();
	bmp.set({
		image : game.sprites,
		spriteX : sprite.position[0],
		spriteY : sprite.position[1],
		spriteWidth : sprite.size[0],
		spriteHeight : sprite.size[1],
		x : this.x,
		y : this.y,
		width : sprite.size[0],
		height : sprite.size[1]
	});
	bmp.draw();
};