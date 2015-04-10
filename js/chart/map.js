jui.define("chart.map", [ "jquery", "util.base", "util.math", "util.svg" ], function($, _, math, SVG) {
    /**
     * @class chart.grid.core
     * Grid Core 객체
     * @extends chart.draw
     * @abstract
     */
    var CoreMap = function() {
        
        var self = this;

        this.pathIndex = {};

        this.makeColor = function(color) {
            return this.chart.color(0, { colors: [ color ] })
        }

        /**
         * @method drawAfter
         *
         *
         *
         * @param {Object} obj
         * @protected
         */
        this.drawAfter = function(obj) {
            obj.root.attr({ "class": "map map-" + this.map.type});
            obj.root.attr({ "clip-path" : "url(#" + this.axis.get("clipRectId") + ")" });
        }

        /**
         * @method wrapper
         * scale wrapper
         *
         * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수
         *
         * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리
         *
         *      @example
         *      // 그리드 속성에 키가 없을 때
         *      scale(0);		// 0 인덱스에 대한 값  (block, radar)
         *      // grid 속성에 key 가 있을 때
         *      grid { key : "field" }
         *      scale(0)			// field 값으로 scale 설정 (range, date)
         *
         * @protected
         */
        this.wrapper = function(scale, key) {
            return scale || (function() {});
        }

        /**
         * @method color
         * grid 에서 color 를 위한 유틸리티 함수
         * @param theme
         * @return {Mixed}
         */
        this.color  = function(theme) {
            if (arguments.length == 3) {
                return (this.map.color) ? this.makeColor(this.map.color) : this.chart.theme.apply(this.chart, arguments);
            }

            return (this.map.color) ? this.makeColor(this.map.color) : this.chart.theme(theme);
        }

        /**
         * @method data
         * get data for axis
         * @protected
         * @param {Number} index
         * @param {String} field
         */
        this.data = function(index, field) {
            if(this.axis.data && this.axis.data[index]) {
                return this.axis.data[index][field] || this.axis.data[index];
            }

            return this.axis.data || [];
        }

        /**
         * @method loadPath 
         * 
         * load path's info 
         *      
         *      this.loadPath([
         *          { id : 'KR', d : "", .. },
         *          { id : 'en', d : "", .. },
         *          { id : 'us', d : "", .. }
         *      ]);
         * @param {Array} data
         */
        this.loadArray = function(data) {
            if (!_.typeCheck("array", data)) {
                data = [data];
            }
            
            var children = [];
            for(var i = 0, len = data.length; i < len; i++) {
                if (data[i]) {
                    children.push(SVG.createObject({ type : 'path' , attr : data[i] }));
                }
            }
            
            return children;
        }
        
        this.loadPath = function(mapLink) {
            var children = [];

            $.ajax({
                url : mapLink,
                async : false, 
                success : function(xml) {
                    var $path = $(xml).find("path");

                    $path.each(function() {
                        var obj = {};

                        $.each(this.attributes, function() {
                            if(this.specified && isLoadAttribute(this.name)) {
                                obj[this.name] = this.value;
                            }
                        });

                        children.push(obj);
                    });
                }
            });

            function isLoadAttribute(name) {
                return (name == "id" || name == "title" || name == "position" || name == "d" || name == "class");
            }

            return this.loadArray(children);
        }

        this.makeIndex = function(item) {
            if (item.attr('id')) {
                this.pathIndex[item.attr('id')] = item;
            }
        }

        this.makePathGroup = function(root) {
            // create path element
            var pathGroup = this.chart.svg.group({
                'class' : 'map-path'
            });

            root.append(pathGroup);

            var list = _.typeCheck("array", this.map.path) ? this.loadArray(this.map.path) : this.loadPath(this.map.path);

            for(var i = 0, len = list.length; i < len; i++) {
                pathGroup.append(list[i]);
                this.makeIndex(list[i]);
            }

            return pathGroup;
        }

        this.scale = function(i) {
            if (typeof i == 'number') {
                return self.pathGroup.children[i];
            } else {
                return self.pathIndex[i];
            }
        }

        this.scale.getMapGroup = function() {
            return self.pathGroup;
        }

        /**
         * @method drawGrid
         * draw base grid structure
         * @protected
         * @param {chart.builder} chart
         * @param {String} orient
         * @param {String} cls
         * @param {Map} map
         */
        this.drawMap = function() {
            var self = this;
            // create group
            var root = this.chart.svg.group(),
                func = this.custom;

            this.scaleGroup = this.chart.svg.group();
            root.append(this.scaleGroup);

            this.pathIndex = {};
            this.pathGroup = this.makePathGroup(this.scaleGroup);

            // caculate ratio
            var size =  math.resize(this.axis.area('width'), this.axis.area('height'), this.map.width, this.map.height);

            this.scale.ratio = {
                x : (this.axis.area('width') - size.width)/2,
                y : (this.axis.area('height') - size.height)/2,
                width : size.width / this.map.width,
                height : size.height / this.map.height
            };

            this.scaleGroup.scale(this.scale.ratio.width, this.scale.ratio.height);
            this.scaleGroup.translate(this.scale.ratio.x, this.scale.ratio.y);

            // render axis
            if(_.typeCheck("function", func)) {
                func.call(this);
            }

            // hide map
            if(this.map.hide) {
                root.attr({ display : "none" })
            }

            return {
                root : root,
                scale : this.scale
            };
        }
        
        /**
         * @method draw
         *
         * @protected
         * @return {Mixed}
         */
        this.draw = function() {
            return this.drawMap("core");
        }
        
        
    }

    CoreMap.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} map */

        return {
            /**  @cfg {Number} [dist=0] Able to change the locatn of an axis.  */
            dist: 0,
            /** @cfg {Boolean} [hide=false] Determines whether to display an applicable grid.  */
            hide: false,
            /** @cfg {String/Object/Number} [color=null] Specifies the color of a grid. */
            color: null,
            /** @cfg {String} [title=null] Specifies the text shown on a grid.*/
            title: null,
            /** @cfg {Boolean} [hide=false] Determines whether to display a line on the axis background. */
            line: false,
            /** @cfg {Boolean} [hide=false] Determines whether to display the base line on the axis background. */
            baseline : true,
            /** @cfg {Function} [format=null]  Determines whether to format the value on an axis. */
            format: null,
            /** @cfg {Number} [textRotate=null] Specifies the slope of text displayed on a grid. */
            textRotate : null,
            /** @cfg {String} [map=''] Set a map file's name */
            path : '',
            /** @cfg {Number} [width=-1] Set map's width */
            width : -1,
            /** @cfg {Number} [height=-1] Set map's height */
            height : -1
        };
    }

    return CoreMap;
}, "chart.draw"); 