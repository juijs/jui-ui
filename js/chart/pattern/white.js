jui.define("chart.pattern.white", ["util.svg"], function(SVG){

    /**
     * @class chart.pattern.white 
     * 
     * pattern default sample  
     */

    function CreateCirclePattern (id, size) {
        size = parseInt(size || 1);
        var el = SVG.createElement({
            type : "pattern",
            attr : { id : 'pattern-white-circle' + id,  x : 10, y : 10, width : 10, height : 10, patternUnits : "userSpaceOnUse" },
            children : [
                { type : 'rect', attr : { width : 10, height : 10, fill : '#ffffff' }},
                { type : 'circle', attr : { cx : size, cy : size, r : size,  fill : '#000000' }}
            ]
        });

        return el; 
    }
    

    return {

        /**
         * @property circle
         *
         * create svg element by json
         *
         * @return {util.svg.element}
         */
        circle : SVG.createElement({
            type: "pattern",
            attr: { id: 'pattern-white-circle', width: 15, height: 15, patternUnits: "userSpaceOnUse" },
            children: [
                { type: 'rect', attr: { width: 50, height: 50, fill: '#282828' }},
                { type: 'circle', attr: { cx: 3, cy: 4.3, r: 1.8, fill: '#393939' }},
                { type: 'circle', attr: { cx: 3, cy: 3, r: 1.8, fill: 'black' }},
                { type: 'circle', attr: { cx: 10.5, cy: 12.5, r: 1.8, fill: '#393939' }},
                { type: 'circle', attr: { cx: 10.5, cy: 11.3, r: 1.8, fill: 'black' }}
            ]
        }),
        
        /**
         * @method rect
         *
         * create svg element by chart's svg  
         * 
         * @return {util.svg.element}
         */        
        rect : function() {
          var chart = this;
          return chart.svg.pattern({ width : 20, height : 20, patternUnits : "userSpaceOnUse"}, function() {
              chart.svg.rect({ width : 20, height : 20 , fill : '#00a9f1'});
              chart.svg.rect({ width : 20, height : 10 , fill : '#26baf4'});
          });
        },
        
        circle1 : function() { return CreateCirclePattern.call(this, 1, 1); },
        circle2 : function() { return CreateCirclePattern.call(this, 2, 1.5); },
        circle3 : function() { return CreateCirclePattern.call(this, 3, 2); },
        circle4 : function() { return CreateCirclePattern.call(this, 4, 2.5); },
        circle5 : function() { return CreateCirclePattern.call(this, 5, 3); },
        circle6 : function() { return CreateCirclePattern.call(this, 6, 3.5); },
        circle7 : function() { return CreateCirclePattern.call(this, 7, 4); },
        circle8 : function() { return CreateCirclePattern.call(this, 8, 4.5); }
    }
    
})
