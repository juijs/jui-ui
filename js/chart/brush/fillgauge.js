jui.define("chart.brush.fillgauge", [ "jquery", "util.base" ], function($, _) {

	var FillGaugeBrush = function(chart, axis, brush) {
        var self = this;
        var w, centerX, centerY, outerRadius, clipId;
        var rect;

        function setDirection(direction) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

            if (direction == "vertical") {
                var height = chart.area('height') * rate;
                var width = chart.area('width');
                var x = 0;
                var y = chart.area('height') - height;
            } else {		// horizontal
                var height = chart.area('height');
                var width = chart.area('width') * rate;
                var x = 0;
                var y = 0;
            }

            rect.attr({
                x : x,
                y : y,
                width : width,
                height : height
            });
        }

        function createPath(group, path) {
            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : chart.theme("gaugeBackgroundColor"),
                d : path
            }));

            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : self.color(0),
                d : path,
                "clip-path" : "url(#" + clipId + ")"
            }));
        }

        this.drawBefore = function() {
            var axis = axis || {};
            
            var obj = axis.c(),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;
            clipId = _.createId("fill-gauge");

            var clip = chart.svg.clipPath({
                id : clipId
            });

            rect = chart.svg.rect({
                x : 0,
                y : 0,
                width : 0,
                height : 0
            });

            clip.append(rect);
            chart.defs.append(clip);
        }
		
		this.draw = function() {
			var group = chart.svg.group({
				opacity : 0.8
			});

			setDirection(brush.direction);

            if (brush.svg != "" || brush.path != "") {
                if (brush.svg != "") {
                    $.ajax({
                        url : brush.svg,
                        async : false,
                        success : function(xml) {
                            var path = $(xml).find("path").attr("d");
                            createPath(group, path);
                        }
                    });
                } else {
                    createPath(group, brush.path);
                }
            } else {
                if (brush.shape == "circle") {
                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.color(0, brush),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                } else if (brush.shape == "rectangle") {
                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : this.color(0),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                }
            }

            return group;
		}
	}

    FillGaugeBrush.setup = function() {
        return {
            /** @cfg {Number} [min=0] Determines the minimum size of a fill gauge.*/
            min: 0,
            /** @cfg {Number} [max=100] Determines the maximum size of a fill gauge.*/
            max: 100,
            /** @cfg {Number} [value=0] Determines the value of a fill gauge. */
            value: 0,
            /** @cfg {String} [shape="circle"] Determines the shape of a fill gauge (circle, rectangle).*/
            shape: "circle", // or rectangle
            /** @cfg {String} [direction="vertical"] Determines the direction in which a fill gauge is to be filled (vertical, horizontal). */
            direction: "vertical",
            /** @cfg {String} [svg=""] Sets the shape of a fill gauge with a specified URL as an SVG tag. */
            svg: "",
            /** @cfg {String} [path=""] Sets the shape of a fill gauge with a specified pass tag.*/
            path: ""
        };
    }

	return FillGaugeBrush;
}, "chart.brush.core");
