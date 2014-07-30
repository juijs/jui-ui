jui.defineUI("chart.chart", [ "chart.grid.basic" ], function(BasicGrid) {

    var UI = function() {
       
        var _grid = [];  
        var _brush = [];
       
		this.init = function() {
			
		
			this.parent.init.call(this);

			//console.log(this.options);
			
	      	// 데이타 설정 
	      	var data = this.get('data');
	      	var series = this.get('series');
	      	var grid = this.get('grid');
	      	var brush = this.get('brush');
	      	var series_list = [];
	      	
	      	// series_list 
	      	for(var key in series) {
	      		series_list.push(key);
	      	}
	      	
	      	// series 데이타 구성
	      	for(var i = 0, len = data.length; i < len; i++ ) {
	      		var row = data[i];
	      		
	      		for(var key in series) {
	      			var obj = series[key];
	      			var value = row[key];
	      			
	      			obj.data = obj.data || [];
	      			obj.min = obj.min || 0;
	      			obj.max = obj.max || 0;
	      			obj.data.push(value);
	      			
	      			if (value < obj.min) {
	      				obj.min = value;
	      			} else if (value > obj.max) {
	      				obj.max = value; 
	      			}
	      		}
	      	}
	      	
	      	// grid 최소, 최대 구성
	      	if (typeof brush == 'string') {
	      		brush = [{ type : brush }];
	      	} else if (typeof brush == 'object' && !brush.length) {
	      		brush = [brush];
	      	}
	      	
	      	for(var i = 0, len = brush.length; i < len; i++) {
	      		var b = brush[i];
	      		b.cls = 'brush';
	      		var g = b.grid = grid[b.grid || 0];
	      		b.chart = this; 
			
				if (!b.series) {
					b.series = series_list;
				} else if (typeof b.series == 'string') {
					b.series = [b.series];
				}
	      	}
	      	
	      	//console.log(data, series, grid, brush);
	      	_grid = grid;
	      	_brush = brush;
	      			
		}       
		
		this.setDomain = function(axis) {
			if (typeof axis.series == 'string') {
				axis.series = [axis.series];
			}
			var series = this.get('series');
			if (axis.series && axis.series.length) {
				var max = 0;
				var min = 0;
				
				for(var i = 0; i < axis.series.length; i++) {
					var _max = series[axis.series[i]].max;
					var _min = series[axis.series[i]].min;
					if (max < _max) max = _max;		
					if (min > _min) min = _min;		
				}			
				
				
				var unit = Math.ceil((max - min) / axis.step);
				
				var start = 0;
				while(start < max) {
					start += unit; 
				}
				
				var end = 0;
				while(end > min) {
					end -= unit; 
				}
				
				axis.domain = [end, start];
				axis.step = Math.abs(start/unit) + Math.abs(end/unit);	
			}

		}
		
		this.renderChart = function() {
			var grid = this.get('grid');
			// draw grid
			
			if (grid.x) {		// bottom
				this.setDomain(grid.x);				
				this.x = new BasicGrid('bottom', grid.x).render(this);
			}  
			
			if (grid.y) {		// left
				this.setDomain(grid.y);								
				this.y = new BasicGrid('left', grid.y).render(this);
			}
			
			if (grid.x1) {		// top
				this.setDomain(grid.x1);								
				this.x1 = new BasicGrid('top', grid.x1).render(this);
			}
			
			if (grid.y1) {		// right 
				this.setDomain(grid.y1);								
				this.y1 = new BasicGrid('right', grid.y1).render(this);
			}
			
			
			// draw brush 
			for(var i = 0; i < _brush.length; i++) {
				var Obj = jui.include("chart.brush." + _brush[i].type);
				
				_brush[i].x = (_brush[i].x1) ? this.x1 : this.x;
				_brush[i].y = (_brush[i].y1) ? this.y1 : this.y;
				
				new Obj(_brush[i]).render(this);
			}
		}
    }

    UI.setting = function() {
        return {
            options: {
                "type": "svg",
                "width": "100%",
                "height": "100%",
                
                // style 
                "padding": 30,
                "barPadding": 10,
                "seriesPadding": 1,
                "titleHeight": 50,
                "titleYWidth": 50,
                "titleXHeight": 50,                
                
                // chart 
                "tick": 5,
                "title": "",
                "titleY": "",
                "titleX": "",
                "theme": {},
                "labels": [],
                "series": {},
                "grid" : [],
                "brush": [],
                "data": []
            }
        }
    }

    return UI;
}, "chart.core");