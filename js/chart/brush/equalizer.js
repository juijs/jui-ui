jui.define("chart.brush.equalizer", [], function() {

    var EqualizerBrush = function(brush) {
        var g, zeroY, count, width, barWidth, unit, gap, half_width;
        var outerPadding = brush.outerPadding || 15, innerPadding = brush.innerPadding || 10;

        this.drawBefore = function(chart) {
            g = chart.svg.group().translate(chart.x(), chart.y());

            zeroY = brush.y(0);
            count = chart.data().length;

            width = brush.x.rangeBand();
            half_width = (width - outerPadding * 2) / 2;
            barWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

            unit = brush.unit || 5;
            gap = brush.gap || 1;
        }

        this.draw = function(chart) {
            for (var i = 0; i < count; i++) {
                var startX = brush.x(i) - half_width;

                for (var j = 0; j < brush.target.length; j++) {
                    var barGroup = chart.svg.group();
                    var startY = brush.y(chart.data(i, brush.target[j])),
                        padding = 1.5,
                        eY = zeroY,
                        eIndex = 0;

                    if (startY <= zeroY) {
                        while (eY > startY) {
                            var unitHeight = (eY - unit < startY ) ? Math.abs(eY - startY) : unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY - unitHeight,
                                width : barWidth,
                                height : unitHeight,
                                fill : chart.color(Math.floor(eIndex / gap), brush.colors)
                            });

                            eY -= unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    } else {
                        while (eY < startY) {
                            var unitHeight = (eY + unit > startY ) ? Math.abs(eY - startY) : unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY,
                                width : barWidth,
                                height : unitHeight,
                                fill : chart.color(Math.floor(eIndex / gap), brush.colors)
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(brush, chart, barGroup, j, i);
                    g.append(barGroup);

                    startX += barWidth + innerPadding;
                }
            }
        }
    }

    return EqualizerBrush;
}, "chart.brush.core");
