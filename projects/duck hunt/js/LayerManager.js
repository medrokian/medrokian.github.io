/**
 * LayerManager
 * Manages elements into layers and help to draw them in the right order.
 * Level 0 is the top.
 * Level Max is the bottom.
 */
var LayerManager = function() {
	this.layers = [];
	this.names = {};
	
	/**
	 * Checks if the layer object has all the properties to be added
	 */
	this.checkLayer = function(layer) {
		if (layer === null || typeof layer !== 'object') {
			return false;
		}
		
		if (layer.draw === undefined) {
			return false;
		}
		
		return true;
	};
	
	/**
	 * Checks if the name is a valid layer name
	 */
	this.checkName = function(name) {
		return typeof(input)=='string';
	};

	/**
	 * Checks if the level is a valid level number
	 */
	this.checkLevel = function(level) {
		return (typeof(input)=='number' && parseInt(input)==input);
	};
};

/*****************************/
/* Layer collection handling */
/*****************************/
LayerManager.prototype.addToLevel = function(name, layer, level) {
	// Check layer
	if (this.checkLayer(layer) === false) {
		return false;
	}
	
	// Check if the specified level is correct
	if (parseInt(level).isNan() || level < 0 || level > this.layers.length) {
		return false;
	}

	// Add the layer
	this.layers.splice(level, 0, layer);
	
	// Change the index
	for (var i in this.names) {
		if (this.names.hasOwnProperty(i)) {
			if (this.names[i] >= level) {
				this.names[i]++;
			}
		}
	}
	
	// Insert the new index
	this.names[name] = level;
};

LayerManager.prototype.addUnder = function(name, layer, refereeName) {
	// Search the referee
	if (this.names[refereeName] === undefined) {
		return false;
	}
	
	// Add the layer
	var level = this.names[refereeName]+1;
	this.addToLevel(name, layer, level);
};

LayerManager.prototype.addOnto = function(name, layer, refereeName) {
	// Search the referee
	if (this.names[refereeName] === undefined) {
		return false;
	}

	// Add the layer
	this.addToLevel(name, layer, this.names[refereeName]);
};

LayerManager.prototype.addToTop = function(name, layer) {
	// Check layer
	if (this.checkLayer(layer) === false) {
		return false;
	}
	
	// Add the layer to top
	this.layers.unshift(layer);
	
	// Every layer have to move to i+1
	for (var i in this.names) {
		if (this.names.hasOwnProperty(i)) {
			this.names[i]++;
		}
	}
	
	// Add the new layer's name to the index
	this.names[name] = 0;
};

LayerManager.prototype.addToBottom = function(name, layer) {
	// Check layer
	if (this.checkLayer(layer) === false) {
		return false;
	}

	// Add the layer
	this.layers.push(layer);
	
	// Change the index
	this.names[name] = this.layers.length-1;
};

LayerManager.prototype.remove = function(name) {
	// Search for the level of the layer
	var level = this.names[name];
	
	// Remove the layer
	this.layers.splice(level, 1);
	
	// Remove the layer from names
	delete this.names[name];
	
	// Change the index
	for (var i in this.names) {
		if (this.names.hasOwnProperty(i)) {
			if (this.names[i] > level) {
				this.names[i]--;
			}
		}
	}
};

LayerManager.prototype.removeAll = function() {
	// Remove all layers
	//this.layers.splice(0, this.layers.length);
	this.layers = [];
	
	// Empty the index
	for (var j in this.names) {
		if (this.names.hasOwnProperty(j)) {
			delete this.names[j];
		}
	}
};

/******************/
/* Layer ordering */
/******************/

LayerManager.prototype.intervertByName = function(name1, name2) {
	// Search layers names
	if (this.names[name1] === undefined || this.names[name2] === undefined) {
		return false;
	}
	
	// fetching levels
	var level1 = this.names[name1];
	var level2 = this.names[name2];
	
	// Getting first layer
	var layer1 = this.layers[level1];
	
	// Interverting
	this.layers[level1] = this.layers[level2];
	this.layers[level2] = layer1;
	
	// Updating index
	this.names[name1] = level2;
	this.names[name2] = level1;
};

LayerManager.prototype.intervertByLevel = function(level1, level2) {
	// Check layers
	if (this.layers[level1] === undefined || this.layers[level2] === undefined) {
		return false;
	}
	
	// Getting first layer
	var layer1 = this.layers[level1];
	
	// Interverting
	this.layers[level1] = this.layers[level2];
	this.layers[level2] = layer1;
	
	// Updating index
	for (var i in this.names) {
		if (this.names.hasOwnProperty(i)) {
			switch (this.names[i]) {
				case level1:
					this.names[i] = level2;
					break;
				case level2:
					this.names[i] = level1;
					break;
			}
		}
	}
};

LayerManager.prototype.raise = function(name) {
	// Check layer's name
	if (this.names[name] === undefined) {
		return false;
	}
	
	var oldLevel = this.names[name];
	
	// Check if not already min level
	if (oldLevel === 0) {
		return false;
	}
	
	this.intervertByLevel(oldLevel, oldLevel-1);
};

LayerManager.prototype.lower = function(name) {
	// Check layer's name
	if (this.names[name] === undefined) {
		return false;
	}
	
	var oldLevel = this.names[name];
	
	// Check if not already min level
	if (oldLevel === this.layers.length-1) {
		return false;
	}
	
	this.intervertByLevel(oldLevel, oldLevel+1);
};

LayerManager.prototype.raiseToTop = function(name) {
	// Check layer's name
	if (this.names[name] === undefined) {
		return false;
	}
	
	this.changeLevel(name, 0);
};

LayerManager.prototype.lowerToBottom = function(name) {
	// Check layer's name
	if (this.names[name] === undefined) {
		return false;
	}
	
	this.changeLevel(name, this.layers.length-1);
};

LayerManager.prototype.lowerUnder = function(name1, name2) {
	// Search layers names
	if (this.names[name1] === undefined || this.names[name2] === undefined) {
		return false;
	}
	
	// Move layer1 to level2
	this.changeLevel(name1, this.names[name2]);
}
/*****************/
/* Layer getters */
/*****************/
LayerManager.prototype.getLayer = function(name) {
	// Search for layer
	if (this.names[name] === undefined) {
		return false;
	}
	
	var level = this.names[name];
	return this.layers[level];
};

LayerManager.prototype.getLayerByLevel = function(level) {
	// Check level is used
	if (this.layers[level] === undefined) {
		return false;
	}
	
	return this.layers[level];
};

/*****************/
/* Layer methods */
/*****************/
LayerManager.prototype.getLayerLevel = function(name) {
	// Search for layer
	if (this.names[name] === undefined) {
		return false;
	}
	
	return this.names[name];
};

/*******************/
/* Drawing methods */
/*******************/
LayerManager.prototype.drawLevel = function(level) {
	// Check level
	if (this.layers[level] === undefined) {
		return false;
	}
	
	// Draw layer
	this.layers[level].draw();
};

LayerManager.prototype.drawLayer = function(name) {
	// Search layer
	if (this.names[name] === undefined) {
		return false;
	}
	
	// Draw layer
	this.layers[this.names[name]].draw();
};

LayerManager.prototype.draw = function() {
	if (this.layers.length === 0) {
		return false;
	}
	
	// Run the layers for bottom to top and draw them
	for (var i=this.layers.length-1; i >= 0; i--) {
		this.layers[i].draw();
	}
};