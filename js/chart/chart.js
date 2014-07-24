jui.defineUI("chart.chart", [
    "chart.grid.basic",
    "chart.brush.line",
    "chart.brush.point",
    "chart.brush.bar"
], function(BasicGrid, LineBrush, PointBrush, BarBrush ) {

	var g_list = {
		basic : BasicGrid
	}
	
	var b_list = {
		line : LineBrush,
		point : PointBrush,
		bar : BarBrush
	}

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
	      	
	      	// grid별 brush series 구성 
	      	if (typeof grid == 'object' && !grid.length) {
	      		grid = [grid];
	      	}
	      	
	      	for(var i = 0, len = grid.length; i < len; i++) { 
	      		var g = grid[i];
	      		
	      		g.type = g.type || 'basic';
	      		g.tick = g.tick || 5;       	
	      		g.format = g.format || "";
	      		g.style = g.style || {};	
	      		
	      		if (typeof g.min == 'undefined') g.emptyMin = true;   
	      		if (typeof g.max == 'undefined') g.emptyMax = true;   
	      	}
	      	
	      	// grid 최소, 최대 구성
	      	if (typeof brush == 'string') {
	      		brush = [{ type : brush }];
	      	} else if (typeof brush == 'object' && !brush.length) {
	      		brush = [brush];
	      	}
	      	
	      	for(var i = 0, len = brush.length; i < len; i++) {
	      		var b = brush[i];
	      		var g = b.grid = grid[b.grid || 0];
	      		b.chart = this; 
			
				if (!b.series) {
					b.series = series_list;
				} else if (typeof b.series == 'string') {
					b.series = [b.series];
				}
				
	      		for(var j = 0; j < b.series.length; j++ ) {
	      			var s = series[b.series[j]]
		      		if (g.emptyMin) {
		      			g.min = g.min || 0;
		      		
		      			if (s.min < g.min) g.min = s.min;
		      		}
		      		
		      		if (g.emptyMax) {
		      			g.max = g.max || 0;
		      		
		      			if (s.max > g.max) g.max = s.max;
		      		}
	      		}
	      	}
	      	
	      	//console.log(data, series, grid, brush);
	      	_grid = grid;
	      	_brush = brush;
	      			
		}       
		
		this.renderChart = function() {
			// draw grid
	      	for(var i = 0, len = _grid.length; i < len; i++) {
	      		var g = _grid[i];
	      		
	      		if (g.type) {
	      			var Grid = g_list[g.type];
	      			new Grid(g).render(this);
	      		} else {
	      			if (typeof g.render == 'function') {
	      				g.render(this);
	      			}	
	      		}
				
	      	} 
	      	
	      	// draw brush 
	      	for(var i = 0, len = _brush.length; i < len; i++) {
	      		var b = _brush[i];
	      		
	      		if (b.type) {
	      			var Brush = b_list[b.type];
	      			new Brush(b).render(this);
	      		} else {
	      			if (typeof b.render == 'function') {
	      				b.render(this);
	      			}	
	      		}
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