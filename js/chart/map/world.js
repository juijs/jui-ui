jui.define("chart.map.world", [ "util.scale", "util.base" ], function(UtilScale, _) {

    /**
     * @class chart.map.world
     * Implements World Map
     *
     *  { type : "world" }
     *
     * @extends chart.map.core
     */
    var WorldMap = function() {

        this.map = function(g) {
            console.log(g);
        }

        /**
         * @method drawBefore
         *
         * @protected
         */
        this.drawBefore = function() {

        }

        /**
         * @method draw
         *
         * @protected
         * @return {Mixed}
         */
        this.draw = function() {
            return this.drawMap("world");
        }
    }


    WorldMap.setup = function() {
        return {
            map : 'worldHigh.svg'
        };
    }

    return WorldMap;
}, "chart.map.core");
