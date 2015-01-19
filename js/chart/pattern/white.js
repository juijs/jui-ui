jui.define("chart.pattern.white", ["util.svg"], function(SVG){

    /**
     * @class chart.pattern.white 
     * 
     * pattern default sample  
     * 
     * @singleton
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
        rect : SVG.createElement({
            type: "pattern",
            attr: { id: 'pattern-white-rect', width: 20, height: 20, patternUnits: "userSpaceOnUse" },
            children: [
                { type: 'rect', attr: { width: 20, height: 20, fill: '#00a9f1' }},
                { type: 'rect', attr: { width: 20, height: 10, fill: '#26baf4' }}
            ]
        }),

        circle1 : function() { return CreateCirclePattern.call(this, 1, 1); },
        circle2 : function() { return CreateCirclePattern.call(this, 2, 1.5); },
        circle3 : function() { return CreateCirclePattern.call(this, 3, 2); },
        circle4 : function() { return CreateCirclePattern.call(this, 4, 2.5); },
        circle5 : function() { return CreateCirclePattern.call(this, 5, 3); },
        circle6 : function() { return CreateCirclePattern.call(this, 6, 3.5); },
        circle7 : function() { return CreateCirclePattern.call(this, 7, 4); },
        circle8 : function() { return CreateCirclePattern.call(this, 8, 4.5); },

        rect1 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect1', width: 70, height: 70, patternUnits: "userSpaceOnUse" },
            children : [
                { type : 'image' , attr : { "xlink:href" : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCI+CjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2JiZDgxNyI+PC9yZWN0Pgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiPgo8cmVjdCB3aWR0aD0iOTkiIGhlaWdodD0iMjUiIGZpbGw9IiNhOWNlMDAiPjwvcmVjdD4KPHJlY3QgeT0iLTUwIiB3aWR0aD0iOTkiIGhlaWdodD0iMjUiIGZpbGw9IiNhOWNlMDAiPjwvcmVjdD4KPC9nPgo8L3N2Zz4=", width: 70, height : 70}}
            ]
        }),
        rect2 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect2', width: 56, height: 100, patternUnits: "userSpaceOnUse", patternTransform : "rotate(45)" },
            children : [
                { type : 'image' , attr : { "xlink:href" : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhkMjAzIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZjYyOSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZTUwMyIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==", width: 56, height : 100}}
            ]
        }),
        rect3 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect3', width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform : "scale(2)" },
            children : [
                { type : 'rect' , attr : { width : 10, height : 10, fill : '#ffffff', stroke : '#000000', "stroke-width" : 0.5 }}
            ]
        }),
        rect4 : SVG.createElement({
            type : 'pattern',
            attr: { id: 'pattern-white-rect4', width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform : "skewX(45)" },
            children : [
                { type : 'rect' , attr : { width : 10, height : 10, fill : '#ffffff', stroke : '#000000', "stroke-width" : 0.5 }}
            ]
        })

    }
    
})
