jui.define("svg", [ "util" ], function(_) {
	
	var _tagList = [
	
		// animation 
		'animate', 'animatecolor', 'animatemotion', 'animatetransform', 'mpath', 'set',
	
		// Shape
		'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'image',
		
		
		// Container
		'a', 'defs', 'glyph', 'g', 'marker', 'mask', 'pattern', 'svg', 'switch', 'symbol', 'use',
		
		// Descriptive
		'desc', 'metadata', 'title',
		
		
		// Filter  
		'feblend', 'fecolormatrix', 'fecomponenttransfer', 'fecomposite', 
		'feconvolvematrix', 'fediffuselighting', 'fedisplacementmap', 'feflood',
		'fefunca', 'fefuncb', 'fefuncg', 'fefuncr','fegaussianblur', 
		'feimage', 'femerge', 'femergenode', 'femorphology', 'feoffset', 
		'fespecularlighting', 'fetile', 'feturbulence',
		
		// Font 
		'font', 'font-face', 'font-face-format', 'font-face-name', 
		'font-face-src', 'font-face-uri', 'hkern', 'vkern',
		
		// Gradient 
		'lineargradient', 'radialgradient', 'stop',

		// Text
		 'altglyph', 'textpath', 'tref', 'tspan',
		
		 
		'clippath', 'color-profile', 'cursor', 'filter', 'foreignobject', 'script', 'style', 'view'
	]
	
	/**
	 * SVG Generator
	 */
	var SVG = function(tagName, namespace) {
		namespace = namespace || "http://www.w3.org/2000/svg";
		this.$el = $(document.createElementNS(namespace, tagName));
	}
	
	SVG.prototype = {

		create : function(tagName, namespace) {
			return new SVG(tagName, namespace);
		},
		
		add : function(tagName, namespace) {
			var element = this.create(tagName, namespace)
			this.append(element);
			return element; 
		},
		
		append : function(element) {
			this.$el.append(element.$el || element);
			return this; 
		},
		
		text : function(text) {
			this.$el.text(text);
			return this; 
		},
		
		  attr : function(attrs) {
		  
		    for(var key in attrs) {
		    
		      if (this[key]) { 
		        this[key].call(this, attrs[key]);      
		      } else {
		        this.set(key, attrs[key]);
		      }
		    }
		  
		    return this; 
		  },		
		
		get : function(key) {
			return this.$el.attr(key);
		},
	
		set : function(key, value, namespace) {
			namespace = namespace || null; 
	    	this.$el[0].setAttributeNS(namespace, key, value);
	    	return this; 
		},
	
		i : function(key) { 
    		return parseInt(this.get(key) || 0);
  		},
  
  		f : function(key) { 
    		return parseFloat(this.get(key) || 0);
  		},
  		
		fill : function(color) { 
			return this.set('fill', color); 
		},
		
		stroke : function(stroke) { 
			return this.set('stroke', stroke); 
		},
		
		strokeWidth : function(width) { 
			return this.set('stroke-width', width); 
		},
		
		fontSize : function(size) { 
			return this.set('font-size', size); 
		},
		
		fontFamily : function(font) { 
			return this.set('font-family', font); 
		},
		plus : function(key, value) {  
			return this.set(key, parseInt(this.get(key)) + value); 
		},
		minus : function(key, value) {  
			return this.set(key, parseInt(this.get(key)) - value); 
		},
		transform : function(value) { 
			return this.set('transform', value); 
		},
		  
		translate : function(x, y) { 
			return this.transform("translate(" + x + ", " + y + ")"); 
		},
		  
		go : function(x, y) {
			this.x(x).y(y);
		  	return this.translate(x, y);
		},
		
		rx : function(rx) { 
			return this.set('rx', rx); 
		},
		ry : function(ry) { 
			return this.set('ry', ry); 
		},
		x1 : function(x1) { 
			return this.set('x1', x1); 
		},
		x2 : function(x2) { 
			return this.set('x2', x2); 
		},
		y1 : function(y1) { 
			return this.set('y1', y1); 
		},
		y2 : function(y2) { 
			return this.set('y2', y2); 
		},
		  
		cx : function(x) {  
			return this.set('cx', x); 
		},
		cy : function(y) { 
			return this.set('cy', y);  
		},
		r : function(r) { 
			return this.set('r', r); 
		},
		 
		x : function(x) { 
			return this.set('x', x); 
		}, 
		y : function(y) { 
			return this.set('y', y); 
		},  
		width : function(width) { 
			return this.set('width', width); 
		},  
		height : function(height) { 
			return this.set('height', height); 
		},
		    
		href : function(href) {
			return this.set('href', href, "http://www.w3.org/1999/xlink");  
		},  
		  
		bound : function() {
		  
		  try {
		    var obj = this.el.getBBox();  
		    
		    return obj;      
		  } catch(e) {
		    return {
	         x : this.el.clientLeft,
	         y: this.el.clientTop,
	         width: this.el.clientWidth,
	         height: this.el.clientHeight
		   	};
		  }
		
		}
	};
	
	/*
	for(var i = 0, len = _tagList.length; i < len; i++) {
		var tag = _tagList[i];
		SVG.prototype[tag] = (function(_tag) {
			
			return function(attrs) {
				return this.add(_tag).attr(attrs);
			};
			
		})(tag);
	} */
	
	return {
		build: function(tagName, namespace) {
			return new SVG(tagName, namespace);
		}
	}
});