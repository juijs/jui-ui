jui.define("chartx.mini", [ "jquery", "chart.builder" ], function($, builder) {

    /**
     * @class chartx.mini
     *
     * 심플 차트 구현
     *
     * @extends core
     */
    var UI = function(selector, data, options) {

      options = options || { type : "column" };

      if (typeof options == 'string') {
        options = { type : options };
      }

      options.type = options.type || "column";
      
      var beforeData = data;
      $(selector).each(function() {
        
        if ($(this).data('type')) {
          options.type = $(this).data('type');
        }
        
        if (beforeData == 'html') {
          $(this).attr('data', $(this).text());
          data = ($(this).text() || $(this).attr('data')).split(",");
          for(var i = 0; i < data.length; i++) {
            data[i] = parseFloat(data[i]);
          }
          $(this).empty();
        }
        var obj = [];
        var domain = [];
        var pieObj = [{}];
        for(var i = 0; i < data.length; i++) {
          obj.push({ "key" : data[i] });
          domain.push("key" + i);
          pieObj[0]["key" + i] = data[i];
        }

        var realData = obj;
        var target = "key";

        if (options.type == "pie" || options.type == 'donut') {
          realData = pieObj;
          target = false;
        }

        var opt = $.extend(true, {
          padding : 0,
          height : 18,
          axis : {
            data : realData,
            x : { type : 'block', domain : domain, hide : true, full : ( options.type != 'column')   },
            y : { type : 'range', domain : 'key', hide : true },
            c : { type : 'panel', hide : true }
          },
          brush : {
            type : "column",
            target : target
          }
        }, { brush : options });

        // 개별 차트 생성 
        builder(this, opt);
      })
      

    }

    return UI;
});