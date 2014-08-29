jui.define("chart.brush.fillgauge", ["util.math"], function(math) {

    var BarGaugeBrush = function(brush) {
        this.drawBefore = function(chart) {
            var width = chart.width(), height = chart.height();
            var min = width;

            if (height < min) {
                min = height;
            }

            this.w = min / 2;
            this.centerX = width / 2;
            this.centerY = height / 2;
            this.outerRadius = this.w;

            this.min = typeof brush.min == 'undefined' ? 0 : parseFloat(brush.min);
            this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);

            this.value = typeof brush.value == 'undefined' ? 0 : brush.value;
            this.shape = typeof brush.shape == 'undefined' ? 'circle' : brush.shape;

            var clip = chart.svg.clipPath({
                id : "fill-gauge"
            })

            this.rect = chart.svg.rect({
                x : 0,
                y : 0,
                width : 0,
                height : 0
            })

            clip.append(this.rect);

            chart.defs.append(clip)

        }

        this.draw = function(chart) {

            var group = chart.svg.group({
                'class' : 'brush circle gauge',
                opacity : 0.5
            })

            group.translate(chart.x(), chart.y())

            var rate = (this.value - this.min) / (this.max - this.min);

            var h = chart.height() * rate;

            this.rect.attr({
                x : 0,
                y : chart.height() - h,
                width : chart.width(),
                height : h
            })

            if (this.shape == 'circle') {
                group.append(chart.svg.circle({
                    cx : this.centerX,
                    cy : this.centerY,
                    r : this.outerRadius,
                    fill : "#ececec"
                }))

                group.append(chart.svg.circle({
                    cx : this.centerX,
                    cy : this.centerY,
                    r : this.outerRadius,
                    fill : chart.theme.color(2),
                    "clip-path" : "url(#fill-gauge)"
                }))

            } else {
                group.append(chart.svg.rect({
                    x : 0,
                    y : 0,
                    width : chart.width(),
                    height : chart.height(),
                    fill : "#ececec"
                }))

                group.append(chart.svg.rect({
                    x : 0,
                    y : 0,
                    width : chart.width(),
                    height : chart.height(),
                    fill : chart.theme.color(2),
                    "clip-path" : "url(#fill-gauge)"
                }))

            }

        }
    }

    return BarGaugeBrush;
}, "chart.brush");
