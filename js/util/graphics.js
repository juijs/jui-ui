jui.define("util.graphics", [], function() {

	
	var GraphicsUtil = {
		
		gid : 0,
		
		isObject : function(obj) {
			return Object.prototype.toString.call( obj ) == "[object Object]";
		},
		
		isString : function(str) {
			return typeof str == 'string';
		},
		
		isArray : function(arr) {
			return Object.prototype.toString.call( arr ) == "[object Array]";
		},
		
		isFunction : function(func) {
			return Object.prototype.toString.call( func ) == "[object Function]";
		},
		
		getSize : function(dom) {
			var rect = dom.getBoundingClientRect()
			return { width : rect.width, height : rect.height } ;
		},
		
		next : function(prefix) {
			prefix = prefix || "graphics";
			return [prefix , (this.gid++)].join("-");
		}
	}
	
	var Graphics = { };
	
	
	function GraphicsRenderer(dom, type, attr) {
		attr = attr || {};
			
		switch(type){
		case 'svg': return new SVGRenderer(dom, attr); 
		case 'canvas': return new CanvasRenderer(dom, attr); 
		case 'webgl': return new WebGLRenderer(dom, attr); 
		}
	}
	
	function Renderer(context, type) {
		this.context = context;
		this.type = type; 
		this._gradients = {};	
		
		var _children = [];
		var _objects = {};
		
		this.group = function(obj) {
			obj.items = obj.items || [];
			for(var i = 0, len = obj.items.length; i < len; i++) {
				var o = obj.items[i];
				
				if (o.id) { _objects[o.id] = o; }
				
				o.renderer = this; 
			}
			
			obj._isGroup = true; 
			
			_children.push(obj);
		}
		
		this.add = function(obj) {
			
			
			if (obj.id) {
				_objects[obj.id] = obj;
			}
			
			obj.renderer = this; 
	
			_children.push(obj);
	
		}
		
		this.line = function(x1, y1, x2, y2, attr) {
			var obj = new Graphics.Line(x1, y1, x2, y2, attr);
			this.add(obj);
			
			return obj;
		}
		
		this.circle = function(cx, cy, radius, attr) {
			var obj = new Graphics.Circle(cx, cy, radius, attr);
			this.add(obj);
			
			return obj;
		}
		
		this.rect = function(x ,y, width, height, attr) {
			var obj = new Graphics.Rect(x ,y, width, height, attr);
			this.add(obj);
			
			return obj;
		}
		
		this.ellipse = function(cx, cy, rx, ry, attr) {
			var obj = new Graphics.Ellipse(cx, cy, rx, ry, attr);
			this.add(obj);
			
			return obj;
		}
		
		this.text = function(x, y, text, attr) {
			var obj = new Graphics.Text(x, y, text, attr);
			this.add(obj);
			
			return obj;
		}	
		
		this.get = function(id) {
			return _objects[id];
		}
		
		this.remove = function(id) {
			delete _objects[id];
			
			return this; 
		}
		
		this.renderObject = function() {
			
		}
		
		this.clear = function() {
			
		}
		
		this.size = function() {
			return { width : 0, height : 0 }
		}
		
		this.createGradient = function(gradientType, position, colors) {
			position = position.push(colors);		
			if (gradientType == 'linear') {
				return this.createLinearGradient.apply(this, position);
			} else if (gradientType == '') {
				return this.createRadialGradient.apply(this, position);
			}
			
			return "";
		}
		
		this.render = function() {
			this.clear();
			for(var i = 0, len = _children.length; i < len; i++) { 
				this.renderObject(_children[i]);	
			}
		}	
	}
	
	function SVGRenderer(dom, attr) {		// svg 에서는 context 는 dom 객체를 의미한다.
		
		if (typeof dom == 'string') {
			dom = document.getElementById(dom);
		} else if (dom instanceof HTMLElement) {
			
		} else if (dom.length) {
			dom = dom[0];
		}
		
		attr = attr || {};
		var context = this.create({type : 'svg', width: attr.width || 300, height: attr.height || 300, x : attr.x || 0, y : attr.y || 0});
		
		dom.appendChild(context);
		
		Renderer.call(this, context, 'svg'); 
		
		this.clear = function() {
			var newContext = this.context.cloneNode(false);
			var parent = this.context.parentNode;
			
			this.context.parentNode.removeChild(this.context);
			
			dom.appendChild(newContext);
			this.context = newContext;		
		}
		
		this.size = function() {
			return GraphicsUtil.getSize(this.context) ;
		}
		
	
		this.createDefs = function() {
			
			// defs 생성 
			var defs = this.context.getElementsByTagName("defs");
			
			var def = null;
			if (defs.length == 0) {
				var el = this.create({type : 'defs'});
				
				def = el;
				
				this.context.appendChild(el);
				
			} else {
				def = defs[0];
			}
	
			return def;
	
		}
	
		/**
		 *
		 * canvas.createLinearGradient(0, 0, 170, 0, [ [], [], [] ])
		 *  
		 */	
		this.createLinearGradient = function(x1, y1, x2, y2, colors) {
			var id = Graphics.next('gradient');
			
			var def = this.createDefs();
			
			var gradient = this.create({ type : 'linearGradient', id : id, x1 : x1, y1 : y1, x2 : x2, y2 : y2});
			
			def.appendChild(gradient);
			
			for(var i = 0, len = colors.length; i < len; i++) {
				var color = this.create({type : 'stop', offset : colors[i][0], "stop-color" : colors[i][1], "stop-opacity" : 1 });
				
				gradient.appendChild(color);	
			}
			
			this._gradients[id] = gradient;
			
			return "url(#" + id + ")";
		}
		
		this.createRadialGradient = function(cx, cy, r, fx, fy, colors) {
			var id = Graphics.next('gradient');
			
			var def = this.createDefs();
			
			var gradient = this.create({ type : 'radialGradient', id : id, cx : cx, cy : cy, r : r, fx : fx, fy : fy});
			
			def.appendChild(gradient);
			
			for(var i = 0, len = colors.length; i < len; i++) {
				var color = this.create({type : 'stop', offset : colors[i][0], "stop-color" : colors[i][1], "stop-opacity" : 1 });
				
				gradient.appendChild(color);	
			}
			
			this._gradients[id] = gradient;
			
			return "url(#" + id + ")";
		}	
		
		this.renderObject = function(obj) {
			
			if (obj._isGroup) {
				// batch drawing 
				
				var group = this.create({type : 'g', width: obj.width || 300, height: obj.height || 300, x : obj.x || 0, y : obj.y || 0});
				
				for(var i = 0, len = obj.items.length; i < len; i++) {
					group.appendChild(this.create(obj.items[i]));
				}
				
				this.context.appendChild(group);
				
			} else {
							
				this.context.appendChild(this.create(obj));			
			}
		}
	}
	
	SVGRenderer.prototype.create = function(obj) {
		
		var element = document.createElementNS("http://www.w3.org/2000/svg", obj.type.toLowerCase());
		
		if (obj) {
			this.setAttributes(element, obj);
			
			obj.el = element;
			
			if (obj.text) {
				element.appendChild(document.createTextNode(obj.text))
			}
		}
		
		return element;
	}
	
	SVGRenderer.prototype.setAttributes = function(element, obj) {
		for(var k in obj) {
			
			if (k == 'type') continue;
			if (k == 'renderer') continue;		
			if (k == 'children') continue;
			if (GraphicsUtil.isFunction(obj[k])) continue;		
			
			element.setAttributeNS(null, k, obj[k]);
		}
	}
	
	SVGRenderer.prototype.renderObject = function(obj) {
		var method = "renderObject" + obj.type;
		var element = this[method].call(this, obj);
		
		this.context.appendChild(element);			
	}
	
	SVGRenderer.prototype.renderObjectRect = function(obj) {
		return this.create("rect", obj);
	}
	
	SVGRenderer.prototype.renderObjectEllipse = function(obj) {
		return this.create("ellipse", obj);
	}
	
	SVGRenderer.prototype.renderObjectCircle = function(obj) {
		return this.create("ellipse", obj);
	}
	
	SVGRenderer.prototype.renderObjectLine = function(obj) {
		return this.create("line", obj);
	}
	
	SVGRenderer.prototype.renderObjectPath = function(obj) {
		return this.create("path", obj);
	}
	
	SVGRenderer.prototype.renderObjectPolyline = function(obj) {
		return this.create("polyline", obj);
	}
	
	SVGRenderer.prototype.renderObjectPolygon = function(obj) {
		return this.create("polygon", obj);
	}
	
	SVGRenderer.prototype.renderObjectText = function(obj) {
		var el = this.create("text", obj);
		
	
		el.appendChild(document.createTextNode(obj.text))
		
		return el; 
	}
	
	
	
	function CanvasRenderer(dom, context, attr) {  // canvas 에서는 context 는 실제 canvas 의 getContext('2d') 로 얻어온다.
	
		if (typeof dom == 'string') {
			dom = document.getElementById(dom);
		} else if (dom instanceof HTMLElement) {
			
		} else if (dom.length) {
			dom = dom[0];
		}
	
		attr = attr || { width: 300, height : 300};
	
		var el = document.createElement('canvas');
		
		el.setAttribute('width', attr.width);
		el.setAttribute('height', attr.height);
		
		dom.appendChild(el);
		
		this.canvas = el;
	
		context = el.getContext('2d');
	 
		Renderer.call(this, context, 'canvas');
	
		this.clear = function() {
			this.clearRect();
		}
		
		this.clearRect = function() {
			this.context.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height);
		}
	
	
		this._gradients = {};
		/**
		 *
		 * canvas.createLinearGradient(0, 0, 170, 0, [ [], [], [] ])
		 *  
		 */	
		this.createLinearGradient = function(x1, y1, x2, y2, colors) {
			var id = Graphics.next('gradient');
			
			var grd = this.context.createLinearGradient(x1, y1, x2, y2);
			for(var i = 0, len = colors.length; i < len; i++) {
				grd.addColorStop.apply(grd, colors[i]);
			}
			
			this._gradients[id] = grd;
			
			return grd;
		}
		
		this.createRadialGradient = function(x1, y1, r1, x2, y2, r2, colors){
			var id = Graphics.next('gradient');
			
			var grd = this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
			for(var i = 0, len = colors.length; i < len; i++) {
				grd.addColorStop.apply(grd, colors[i]);
			}
			
			this._gradients[id] = grd;
			
			return grd;
		}	
		
		this.renderObject = function(obj) {
			var method = "renderObject" + obj.type;
			this.renderObjectBase(obj);	
			this[method].call(this, obj);
		}	
	
			
	}
	
	CanvasRenderer.prototype.renderObjectBase = function(obj) {
		if (obj.fill) this.context.fillStyle = obj.fill;
		if (obj['stroke-width']) this.context.lineWidth = obj['stroke-width'];
		if (obj.stroke) this.context.strokeStyle = obj.stroke;
	}
	
	CanvasRenderer.prototype.renderObjectRect = function(obj) {
		this.context.fillRect(obj.x, obj.y, obj.width, obj.height);
	}
	
	CanvasRenderer.prototype.renderObjectCircle = function(obj) {
		
		var context = this.context;
	
		context.fillStyle = obj.fill;	
		context.beginPath();
	    context.arc(obj.cx, obj.cy, obj.r, 0, Math.PI * 2, true);
	    context.closePath();
		context.fill();
		if (obj.stroke) {
			context.stroke();
		}
	}
	
	CanvasRenderer.prototype.renderObjectEllipse = function(obj) {
		
		var context = this.context;
		
		context.fillStyle = obj.fill;	
	    context.beginPath();
	    context.moveTo(obj.x, obj.y + (y-startY)/2);
	    context.bezierCurveTo(startX, startY, x, startY, x, startY + (y-startY)/2);
	    context.bezierCurveTo(x, y, startX, y, startX, startY + (y-startY)/2);
	    context.closePath();
	    context.stroke();
		
		var context = this.context;
	
		context.fillStyle = obj.fill;	
		context.beginPath();
	    context.arc(obj.cx, obj.cy, obj.r, 0, Math.PI * 2, true);
	    context.closePath();
		context.fill();
		if (obj.stroke) {
			context.stroke();
		}
	}
	
	function WebGLRenderer() {
		
	}
	
	Graphics.RenderObject = function () {
	
		this.children = [];
		
		this.add = function(obj) {
			
			if (GraphicsUtil.isArray(obj)) {
				for(var i  = 0, len = obj.length; i < len; i++) {
					this.children.push(obj[i]);
				}			
			} else {
				this.children.push(obj);			
			}
			
			return this; 
		}
	
		this.attr = function(obj) {
			
			var isCreated = this.renderer && this.renderer.type == 'svg' && this.el;
			
			for(var k in obj) {
				
				if (k == 'type') continue;
				if (k == 'renderer') continue;
				if (GraphicsUtil.isFunction(obj[k])) continue;
				
				this[k] = obj[k];
				
				if (isCreated) {
					this.el.setAttributeNS(null, k, obj[k]);
				}
			}
			
			if (this.id) {
				// check object 
			}
			
			return this; 
		}
		
	} 
	
	Graphics.Rect = function(x ,y, width, height, attr) {
		
		Graphics.RenderObject.call(this);
		
		this.type = 'Rect';
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.attr(attr || {});	
	}
	
	Graphics.Circle = function(cx, cy, radius, attr) {
		
		Graphics.RenderObject.call(this);
		
		this.type = 'Circle';
		this.cx = cx;
		this.cy = cy;
		this.r = radius;
		
		this.attr(attr || {});
	}
	
	Graphics.Ellipse = function(cx, cy, rx, ry, attr) {
		
		Graphics.RenderObject.call(this);
		
		this.type = 'Ellipse';
		this.cx = cx;
		this.cy = cy;
		this.rx = rx;
		this.ry = ry;
		
		this.attr(attr || {});
	}
	
	Graphics.Line = function(x1, y1, x2, y2, attr) {
		Graphics.RenderObject.call(this);
		
		this.type = 'Line';
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		
		this.attr(attr || {});	
	}
	
	Graphics.Text = function(x, y, text, attr) {
		Graphics.RenderObject.call(this);
		
		this.type = 'Text';
		this.x = x;
		this.y = y;
		this.text = text;
		
		this.attr(attr || {});	
	}

	return {
		createRenderer : GraphicsRenderer,
		util : GraphicsUtil
	}
});