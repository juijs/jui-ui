jui.define("chart.brush.equalizer", [], function() {

    var EqualizerBrush = function(chart, brush) {
        var g, zeroY, count, width, barWidth, half_width;

        this.drawBefore = function() {
            g = chart.svg.group();

            zeroY = brush.y(0);
            count = chart.data().length;

            width = brush.x.rangeBand();
            half_width = (width - brush.outerPadding * 2) / 2;
            barWidth = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
        }

        this.draw = function() {
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
                            var unitHeight = (eY - brush.unit < startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY - unitHeight,
                                width : barWidth,
                                height : unitHeight,
                                fill : chart.color(Math.floor(eIndex / brush.gap), brush)
                            });

                            eY -= unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    } else {
                        while (eY < startY) {
                            var unitHeight = (eY + brush.unit > startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY,
                                width : barWidth,
                                height : unitHeight,
                                fill : chart.color(Math.floor(eIndex / brush.gap), brush)
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(barGroup, j, i);
                    g.append(barGroup);

                    startX += barWidth + brush.innerPadding;
                }
            }

            return g;
        }

        this.drawSetup = function() {
            return {
                innerPadding: 10,
                outerPadding: 15,
                unit: 5,
                gap: 5
            }
        }
    }

    return EqualizerBrush;
}, "chart.brush.core");
