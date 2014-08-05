jui.define("chart.grid", [ "util" ], function(_) {
    var Grid = function() {
    	
    	this.drawRange = function(chart, orient, domain, range, step, format, nice) {
    		step = step || 10;

            var g = chart.svg.group();
    		var scale = this.scale.linear().domain(domain).range(range);

    		var ticks = scale.ticks(step, nice || false);
    		var values = []
    		
    		var max = domain[0];
    		var min = domain[0];
    		
    		for(var i = 0; i < domain.length; i++) {
    			if (domain[i] > max) max = domain[i];
    			else if (domain[i] < min) min = domain[i];
    		}

			if (orient == 'left') {
				
				var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: width,
                    y1: 0,
                    x2: width,
                    y2: scale(Math.min(max, min)),
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 

	    			if (format) {
	    				values[i] = format(values[i]);
	    			}
	    			
                    g.append(chart.svg.group({
                        "transform" : "translate(0, " + values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: barX,
                            y1: 0,
                            x2: width + chart.area.width,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.2
                        });

                        chart.svg.text({
                            x: barX-bar,
                            y: bar,
                            'text-anchor' : 'end'
                        },ticks[i] + "")
                    }));
	    		}									
				
			} else if (orient == 'bottom') {
				var height = 30;
				var bar = 6; 
				var barY = bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: scale(Math.max(max, min)),
                    y2: 0,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}

                    g.append(chart.svg.group({
                        "transform" : "translate(" + values[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: bar,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: bar * 4,
                            'text-anchor' : 'middle'
                        },ticks[i] + "")
                    }));
	    		}
				
			} else if (orient == 'top' ) {
				var height = 30;
				var bar = 6; 
				var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: height,
                    x2: scale(Math.max(max, min)),
                    y2: height,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}

                    g.append(chart.svg.group({
                        "transform" : "translate("+ values[i] + ", " + barY + ")"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 6,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: -4,
                            'text-anchor' : 'middle'
                        },ticks[i] + "")
                    }));
	    		}				
				
			} else if (orient == 'right') {
				
				var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: scale(Math.min(max, min)),
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
				
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]); 
	    			
	    			if (format) {
	    				values[i] = format(values[i]);
	    			}

                    g.append(chart.svg.group({
                        "transform" : "translate(0, " + values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: bar,
                            y2: 6,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar + 2,
                            y: bar,
                            'text-anchor' : 'start'
                        },ticks[i] + "")
                    }));
	    		}					
			}

    		return {g : g, scale : scale, ticks : ticks, values : values};
    	}
    	
    	/*
    	 * this.drawBlock(['apple', 'orange', 'banana', 'gruit'], [0, width]));
    	 * 
    	 */
    	this.drawBlock = function(chart, orient, domain, range) {

    		var g = chart.svg.group();
    		var scale = this.scale.ordinal().domain(domain);

   			var max = range[0];
    		var min = range[0];
    		
    		for(var i = 0; i < range.length; i++) {
    			if (range[i] > max) max = range[i];
    			else if (range[i] < min) min = range[i];
    		}

    		var points = scale.rangePoints(range).range();
    		var band = scale.rangeBand();
    		var values = [];
    		
    		if (orient == 'top') {
    			
				var height = 30;
				var bar = 6; 
				var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: height,
                    x2: max,
                    y2: height,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate("+ points[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: barY,
                            x2: 0,
                            y2: height,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: band / 2,
                            y: 20,
                            'text-anchor' : 'middle'
                        },domain[i])
                    }));
	    		}
				
    		} else if (orient == 'bottom') {
				var height = 30;
				var bar = 6; 
				var barY = height - bar; 

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: max,
                    y2: 0,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate("+ points[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: bar,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: band / 2,
                            y: 20,
                            'text-anchor' : 'middle'
                        }, domain[i])
                    }));
	    		}

    		} else if (orient == 'left') {
				var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: width,
                    y1: 0,
                    x2: width,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate(0, "+ points[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: barX,
                            y1: 0,
                            x2: width,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar * 4,
                            y: band / 2,
                            'text-anchor' : 'end'
                        }, domain[i])
                    }));
	    		}

    		} else if (orient == 'right') {
				var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < points.length; i++) {
	    			values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate(0, "+ points[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: bar,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar,
                            y: band / 2,
                            'text-anchor' : 'start'
                        }, domain[i])
                    }));
	    		}
    		}

    		return {g : g, scale : scale, values : values};
    	}
    	
    	this.drawDate = function(chart, orient, domain, range, step, format) {
    		var g = chart.svg.group();
    		var scale = this.scale.time().domain(domain).rangeRound(range);
    		
   			var max = range[0];
    		var min = range[0];
    		
    		for(var i = 0; i < range.length; i++) {
    			if (range[i] > max) max = range[i];
    			else if (range[i] < min) min = range[i];
    		}    		
    		
    		if (typeof format  == 'string') {
    			var str = format; 
    			format = function(value) {
    				return _.dateFormat(value, str);
    			}
    		}
    		
    		var ticks = scale.ticks(step[0], step[1]); // step = [this.time.days, 1];
    		var values = [];

    		
    		if (orient == 'top') {
    			var height = 30;
				var bar = 6; 
				var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: height,
                    x2: max,
                    y2: height,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate("+ values[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: barY,
                            x2: 0,
                            y2: height,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: bar * 3,
                            'text-anchor' : 'middle'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
	    		}
    		} else if (orient == 'bottom') {
    			var height = 30;
				var bar = 6; 
				var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: max,
                    y2: 0,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate("+ values[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: bar,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: bar * 3,
                            'text-anchor' : 'middle'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
	    		}    			

    		} else if (orient == 'left') {
    			var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: width,
                    y1: 0,
                    x2: width,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate(0,"+ values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: barX,
                            y1: 0,
                            x2: width,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar,
                            y: bar,
                            'text-anchor' : 'end'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
	    		}    
    			
    		} else if (orient == 'right') {
    			var width = 30;
				var bar = 6; 
				var barX = width - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));
    			
				for(var i = 0; i < ticks.length; i++) {
	    			values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate(0,"+ values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: bar,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar * 2,
                            y: bar,
                            'text-anchor' : 'start'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
	    		}    
    		}

    		return {g : g, scale : scale, ticks : ticks, values : values};    		
    	}
    }

    return Grid;
}, "chart.draw");