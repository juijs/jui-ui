jui.define("chart.brush.fillgauge", [ "jquery" ], function($) {

	var FillGaugeBrush = function(chart, brush) {
        var w, centerX, centerY, outerRadius, clipId;
        var rect;

        function setDirection(direction) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

            if (direction == "vertical") {
                var height = chart.height() * rate;
                var width = chart.width();
                var x = 0;
                var y = chart.height() - height;
            } else {		// horizontal
                var height = chart.height();
                var width = chart.width() * rate;
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
                fill : chart.color(0, brush),
                d : path,
                "clip-path" : "url(#" + clipId + ")"
            }));
        }

        this.drawBefore = function() {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            outerRadius = w;
            clipId = chart.createId("fill-gauge");

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
				"class" : "brush fill gauge",
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
                        width : chart.width(),
                        height : chart.height(),
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.width(),
                        height : chart.height(),
                        fill : chart.color(0, brush),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                }
            }

            return group;
		}

        this.drawSetup = function() {
            return {
                min: 0,
                max: 100,
                value: 0,
                shape: "circle", // or rectangle
                direction: "vertical",
                svg: "",
                path: ""
            }
        }
	}

	return FillGaugeBrush;
}, "chart.brush.core");
