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
            console.log($(this.pathGroup.element).offset());
            console.log($(this.pathGroup.element).width());
            console.log($(this.pathGroup.element).height());
            console.log($(this.pathGroup.element).position());
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
            map : 'worldHigh.svg',
            width : 1013,
            height : 669
        };
    }

    return WorldMap;
}, "chart.map.core");
