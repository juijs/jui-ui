jui.define("chartx.mini", [ "jquery", "chart.builder" ], function($, builder) {

    /**
     * @class chartx.realtime
     *
     * 심플 차트 구현
     *
     * @extends core
     */
    var UI = function(selector, options) {

      options.padding = 0; 
      if (options.axis) {
        for(var i = 0; i < options.axis.length; i++) {
          if (options.axis[i].x) { options.axis[i].x.hide = true; }
          if (options.axis[i].y) { options.axis[i].y.hide = true; }
          if (options.axis[i].c) { options.axis[i].c.hide = true; }
        }
      }
      return builder(selector, options);

    }

    return UI;
});