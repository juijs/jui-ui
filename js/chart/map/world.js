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

        this.custom = function() {

        }

        this.scale = function(i) {
            if (typeof i == 'number') {
                return self.pathGroup.children[i];
            } else {
                return self.pathIndex[i];
            }
        }

        /**
         * @method drawBefore
         *
         * @protected
         */
        this.drawBefore = function() {

            var self = this;
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
            map : 'worldLow.svg',
            width : 1012,
            height : 655
        };
    }

    return WorldMap;
}, "chart.map.core");
