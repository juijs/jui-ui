jui.define("chart.brush.equalizer", [], function() {

    /**
     * @class chart.brush.equalizer 
     *  
     * implements equalizer brush 
     *  
     * @extends chart.brush.core   
     */
    var EqualizerBrush = function(chart, axis, brush) {
        var g, zeroY, width, barWidth, half_width;

        this.drawBefore = function() {
            g = chart.svg.group();
            zeroY = axis.y(0);
            width = axis.x.rangeBand();
            half_width = (width - brush.outerPadding * 2) / 2;
            barWidth = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = axis.x(i) - half_width;

                for (var j = 0; j < brush.target.length; j++) {
                    var barGroup = chart.svg.group();
                    var startY = axis.y(data[brush.target[j]]),
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
                                fill : this.color(Math.floor(eIndex / brush.gap))
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
                                fill : this.color(Math.floor(eIndex / brush.gap))
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(barGroup, i, j);
                    g.append(barGroup);

                    startX += barWidth + brush.innerPadding;
                }
            });

            return g;
        }
    }

    EqualizerBrush.setup = function() {
        return {
            /** @cfg {Number} [innerPadding=10] Determines the inner margin of an equalizer.*/
            innerPadding: 10,
            /** @cfg {Number} [outerPadding=15] Determines the outer margin of an equalizer. */
            outerPadding: 15,
            /** @cfg {Number} [unit=5] Determines the reference value that represents the color.*/
            unit: 5,
            /** @cfg {Number} [gap=5] Determines the number of columns in an equalizer - expressed as a color.*/
            gap: 5
        };
    }

    return EqualizerBrush;
}, "chart.brush.core");
