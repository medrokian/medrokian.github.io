/**
 * Base object that contains event handling functions
 */
var Base = function() {
	return function() {
		// Event handling
		var listeners = {};
		
		var checkEvent = function() {};
		var checkHandler = function() {};
		
		this.addEventListener = function(event, handler) {
			if (listeners[event] === undefined) {
				listeners[event] = [];
			}
			
			listeners[event].push(handler);
		};
		
		this.removeEventListener = function(event, handler) {
			if (listeners[event] === undefined || listeners[event].length === 0) {
				return false;
			}
			
			// Find the handler in the listener list
			var matches = [];
			for (var i=0; i < listeners[event].length; i++) {
				if (listeners[event][i] === handler) {
					matches.push(i);
				}
			}
			
			// Removes the matches
			for (var j=0; j < matches.length; j++) {
				listeners[event].splice(matches[j], 1);
			}
		};
		
		this.fireEvent = function(event, data) {
			if (listeners[event] === undefined || listeners[event].length === 0) {
				return false;
			}
			
			for (var i=0; i< listeners[event].length; i++) {
				listeners[event][i](data);
			}
		};
		
		// Properties setter
		this.set = function(properties) {
			for (var i in properties) {
				this[i] = properties[i];
			}
		};
	};
};