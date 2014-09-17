module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
        options: {
            timeout: 10000
        },
        all: [ 'test/*.html', 'test/*/*.html' ]
    },
    concat : {
        dist : {
            src : [
                // core
                "js/base.js",
                "js/core.js",

                // util
                "js/util/math.js",
                "js/util/time.js",
                "js/util/scale.js",
                "js/util/svg.js",

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
                "js/chart/core.js",
                "js/chart/basic.js",

                // chart.theme
                "js/chart/theme/jennifer.js",
                "js/chart/theme/dark.js",
                "js/chart/theme/light.js",                
                "js/chart/theme/d3.js",
                "js/chart/theme/d20.js",
                "js/chart/theme/flat.js",
                "js/chart/theme/flat2.js",                
                "js/chart/theme/seoul.js",
                "js/chart/theme/candy.js",
                "js/chart/theme/holo.js",
                "js/chart/theme/sns.js",
                "js/chart/theme/google.js",
                "js/chart/theme/korea.js",
                "js/chart/theme/korea2.js",

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

                // chart.widget
                "js/chart/widget/tooltip.js"
            ],
            dest : "jui.js"
        }
    },

    uglify: {

      dist : {
        files : {
            "jui.min.js" : [ "jui.js" ]
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'jui.min.css': 'jui.css'
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
    pkg: grunt.file.readJSON('package.json')
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'less',
    'cssmin',
    "qunit",
  	"concat",    
    'uglify'
  ]);
};
