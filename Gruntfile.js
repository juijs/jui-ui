module.exports = function(grunt) {
    grunt.initConfig({
        watch : {
            scripts : {
                files : [ "js/**" ],
                tasks : [ "js" ],
                options : {
                    spawn : false
                }
            },
            styles: {
                files: [ "less/**" ],
                tasks: [ "css" ],
                options: {
                    spawn : false
                }
            }
        },
        qunit: {
            options: {
                timeout: 10000
            },
            all: [ "test/*.html", "test/*/*.html" ]
        },
        concat : {
            // jui all 
            dist : {
                src : [
                    // core
                    "js/base.js",
                    "js/core.js",

                    // util
                    "js/util/math.js",
                    "js/util/time.js",
                    "js/util/scale.js",
                    "js/util/color.js",
                    "js/util/svg.js",
                    "js/util/svg3d.js",

                    // ui
                    "js/ui/button.js",
                    "js/ui/combo.js",
                    "js/ui/datepicker.js",
                    "js/ui/dropdown.js",
                    "js/ui/modal.js",
                    "js/ui/notify.js",
                    "js/ui/paging.js",
                    "js/ui/tooltip.js",
                    "js/ui/layout.js",

                    // uix
                    "js/uix/autocomplete.js",
                    "js/uix/tab.js",
                    "js/uix/table.js",
                    "js/uix/tree.js",
                    "js/uix/window.js",
                    "js/uix/xtable.js",

                    // chart (core)
                    "js/chart/draw.js",
                    "js/chart/builder.js",

                    // chart.theme
                    "js/chart/theme/jennifer.js",
                    "js/chart/theme/gradient.js", // jennifer gradient style
                    "js/chart/theme/dark.js",
                    "js/chart/theme/pastel.js",

                    // chart.grid
                    "js/chart/grid/core.js",
                    "js/chart/grid/block.js",
                    "js/chart/grid/date.js",
                    "js/chart/grid/radar.js",
                    "js/chart/grid/range.js",
                    "js/chart/grid/rule.js",

                    // chart.brush
                    "js/chart/brush/core.js",
                    "js/chart/brush/bar.js",
                    "js/chart/brush/bubble.js",
                    "js/chart/brush/candlestick.js",
                    "js/chart/brush/ohlc.js",
                    "js/chart/brush/column.js",
                    "js/chart/brush/donut.js",
                    "js/chart/brush/equalizer.js",
                    "js/chart/brush/fullstack.js",
                    "js/chart/brush/line.js",
                    "js/chart/brush/path.js",
                    "js/chart/brush/pie.js",
                    "js/chart/brush/scatter.js",
                    "js/chart/brush/scatterpath.js",
                    "js/chart/brush/stackbar.js",
                    "js/chart/brush/stackcolumn.js",
                    "js/chart/brush/bargauge.js",
                    "js/chart/brush/circlegauge.js",
                    "js/chart/brush/fillgauge.js",
                    "js/chart/brush/area.js", // extends line
                    "js/chart/brush/stackline.js", // extends line
                    "js/chart/brush/stackarea.js", // extends area
                    "js/chart/brush/stackscatter.js", // extends scatter
                    "js/chart/brush/gauge.js", // extends donut
                    "js/chart/brush/fullgauge.js", // extends donut
                    "js/chart/brush/stackgauge.js", // extends donut
                    "js/chart/brush/waterfall.js",
                    "js/chart/brush/splitline.js",
                    "js/chart/brush/splitarea.js",
                    "js/chart/brush/rangecolumn.js",
                    "js/chart/brush/rangebar.js",

                    // chart.widget
                    "js/chart/widget/core.js",
                    "js/chart/widget/tooltip.js",
                    "js/chart/widget/title.js",
                    "js/chart/widget/legend.js",
                    "js/chart/widget/scroll.js",
                    "js/chart/widget/zoom.js",
                    "js/chart/widget/cross.js",

                    // chart wrapper
                    "js/chartx/realtime.js"
                ],
                dest : "jui.js"
            },
            // jui all 
            chart : {
                src : [
                    // core
                    "js/base.js",
                    "js/core.js",

                    // util
                    "js/util/math.js",
                    "js/util/time.js",
                    "js/util/scale.js",
                    "js/util/color.js",
                    "js/util/svg.js",
                    "js/util/svg3d.js",

                    // chart (core)
                    "js/chart/draw.js",
                    "js/chart/builder.js",

                    // chart.theme
                    "js/chart/theme/jennifer.js",
                    "js/chart/theme/gradient.js", // jennifer gradient style
                    "js/chart/theme/dark.js",
                    "js/chart/theme/pastel.js",

                    // chart.grid
                    "js/chart/grid/core.js",
                    "js/chart/grid/block.js",
                    "js/chart/grid/date.js",
                    "js/chart/grid/radar.js",
                    "js/chart/grid/range.js",

                    // chart.brush
                    "js/chart/brush/core.js",
                    "js/chart/brush/bar.js",
                    "js/chart/brush/bubble.js",
                    "js/chart/brush/candlestick.js",
                    "js/chart/brush/ohlc.js",
                    "js/chart/brush/column.js",
                    "js/chart/brush/donut.js",
                    "js/chart/brush/equalizer.js",
                    "js/chart/brush/fullstack.js",
                    "js/chart/brush/line.js",
                    "js/chart/brush/path.js",
                    "js/chart/brush/pie.js",
                    "js/chart/brush/scatter.js",
                    "js/chart/brush/stackbar.js",
                    "js/chart/brush/stackcolumn.js",
                    "js/chart/brush/bargauge.js",
                    "js/chart/brush/circlegauge.js",
                    "js/chart/brush/fillgauge.js",
                    "js/chart/brush/area.js", // extends line
                    "js/chart/brush/stackline.js", // extends line
                    "js/chart/brush/stackarea.js", // extends area
                    "js/chart/brush/stackscatter.js", // extends scatter
                    "js/chart/brush/gauge.js", // extends donut
                    "js/chart/brush/fullgauge.js", // extends donut
                    "js/chart/brush/stackgauge.js", // extends donut
                    "js/chart/brush/waterfall.js",
                    "js/chart/brush/splitline.js",
                    "js/chart/brush/splitarea.js",
                    "js/chart/brush/rangecolumn.js",
                    "js/chart/brush/rangebar.js",

                    // chart.widget
                    "js/chart/widget/core.js",
                    "js/chart/widget/tooltip.js",
                    "js/chart/widget/title.js",
                    "js/chart/widget/legend.js",
                    "js/chart/widget/scroll.js",
                    "js/chart/widget/zoom.js",
                    "js/chart/widget/cross.js",

                    // chart wrapper
                    "js/chartx/realtime.js"
                ],
                dest : "jui.chart.js"
            }            
        },

        uglify: {
            dist : {
                files : {
                    "jui.min.js" : [ "jui.js" ]
                }
            },
            chart : {
                files : {
                    "jui.chart.min.js" : [ "jui.chart.js" ]
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    "jui.min.css": "jui.css"
                }
            }
        },

        less: {
            dist: {
                files: {
                    "jui.css" : [
                        "less/_main.less"
                    ]
                }
            }
        },
        pkg: grunt.file.readJSON("package.json")
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("js", [ "concat", "uglify" ]);
    grunt.registerTask("css", [ "less", "cssmin" ]);
    grunt.registerTask("test", [ "qunit" ]);
    grunt.registerTask("default", [ "css", "test", "js" ]);
};
