jui.defineUI('ui.splitter', ["jquery"], function ($) {
    /**
     * @class ui.splitter
     *
     * implements Splitter for placed panels
     *
     * @alias Splitter
     * @requires jquery
     */
    var Splitter = function () {
        var self, $el, $splitter, $items, barSize, caculateBarSize, minSize;
        var $list = [];
        var maxSize, direction, initSize, fixed;

        this.init = function () {
            self = this;
            $el = $(this.root);
            barSize = this.options.barSize;
            direction = this.options.direction;
            initSize = this.options.initSize;
            minSize = this.options.minSize;
            fixed = this.options.fixed;

            if (typeof minSize == 'number') {
                minSize = [minSize, minSize];
            }

            var temp = [];
            for(var i = 0, len = this.options.items.length; i < len; i++) {
                $list[i] = $el.find(this.options.items[i]);
                $list[i].css({
                    position: 'absolute',
                    width : 'auto',
                    height: 'auto',
                    top : 0,
                    right: 0,
                    bottom: 0, 
                    left: 0
                });
                temp[i] = $list[i][0];
            }

            $items = $(temp);

            this.initElement();
            this.initEvent();
        }

        function is_vertical() {
            return direction == 'vertical';
        }

        this.initElement = function () {

            $el.css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            });

            if ($splitter && $splitter.length) $splitter.remove();

            if (is_vertical()) {
                $splitter = $("<div  />").css({
                    'position':'absolute',
                    'top':'0px',
                    'width': barSize,
                    'bottom':'0px',
                    'cursor':'ew-resize'
                });

            } else {
                $splitter = $("<div />").css({
                    'position':'absolute',
                    'left':'0px',
                    'height': barSize,
                    'right':'0px',
                    'cursor':'ns-resize'
                });

            }

            $splitter.addClass(this.options.splitterClass);
            $splitter.css(this.options.barStyle);

            caculateBarSize = (is_vertical()) ? $splitter.outerWidth() : $splitter.outerHeight();

            $el.append($splitter);

            this.initResize();
        }

        this.getSize = function (size, maxSize) {
            if (typeof size == 'string' && size.indexOf('%') > -1) {
                return maxSize * (parseFloat(size.replace('%','')) /100);
            }

            return size;
        }

        this.getShowList = function () {
            var list = [];
            for(var i = 0, len = $items.length; i < len; i++) {
                var $it = $($items[i]);
                if ($it.hasClass(self.options.hideClass)) {
                    continue;
                }
                list.push($items[i]);

            }

            return $(list);
        }

        this.caculateMinSize = function (centerPos) {
            if (is_vertical()) {
                if (centerPos < caculateBarSize + minSize[0]) {
                    centerPos = caculateBarSize + minSize[0];
                } else if (centerPos > maxSize - caculateBarSize - minSize[1]) {
                    centerPos = maxSize - caculateBarSize  - minSize[1];
                }
            } else {
                if (centerPos < caculateBarSize + minSize[0]) {
                    centerPos = caculateBarSize + minSize[0];
                } else if (centerPos > maxSize - caculateBarSize - minSize[1]) {
                    centerPos = maxSize - caculateBarSize - minSize[1];
                }
            }

            return centerPos;
        }

        this.initResize = function () {

            var $showList = this.getShowList();

            if ($showList.length == 1)
            {
                $showList.css({ 'left': '0px', width: 'auto', height: 'auto', right: 0, top : 0, bottom : 0 });
                $splitter.hide();
            } else {
                if (is_vertical()) {
                    var maxWidth = $el.width();
                    var centerPos = this.caculateMinSize(this.getSize(initSize, maxWidth));

                    $list[0].css({ 'left': '0px', 'width' : centerPos + 'px', top : 0, bottom : 0 });
                    $list[1].css({ 'left': (centerPos + caculateBarSize) + 'px', 'right' : '0px', width: 'auto', top : 0, bottom : 0  });
                    $splitter.css({ 'left': centerPos + 'px' });
                } else {
                    var maxHeight = $el.height();
                    var centerPos = this.caculateMinSize(this.getSize(initSize, maxHeight));

                    $list[0].css({ 'top': '0px', 'height' :  centerPos + 'px', width: 'auto', left : 0, right : 0, 'bottom' : 'auto' });
                    $list[1].css({ 'top': (centerPos + caculateBarSize) + 'px', 'bottom' : '0px', width: 'auto', left : 0, right : 0  });
                    $splitter.css({ 'top': centerPos + 'px' });
                }
                $splitter.show();
            }
        }

        function mouseMove(e) {

            if (is_vertical()) {
                var distX = e.clientX - $splitter.data('prevClientX');
                var posX = parseFloat($splitter.css('left')) + distX;;


                posX = self.caculateMinSize(posX);

                $splitter.css('left' , posX + 'px');
                $list[1].css('left' , (posX + caculateBarSize) + 'px');
                $list[0].css('width',  posX + 'px');

                initSize = posX;
                $splitter.data('prevClientX', e.clientX);

            } else {
                var distY = e.clientY - $splitter.data('prevClientY');
                var posY = parseFloat($splitter.css('top')) + distY;

                posY = self.caculateMinSize(posY);


                $splitter.css('top' , posY + 'px');
                $list[1].css('top' , (posY + caculateBarSize) + 'px');
                $list[0].css('height', posY + 'px');
                initSize = posY;

                $splitter.data('prevClientY', e.clientY);
            }

        }

        function mouseUp() {
            $(document).off('mousemove', mouseMove);
            $(document).off('mouseup', mouseUp);

            $items.css('user-select', '');
            $items.find('iframe').css('pointer-events', 'auto');

            self.emit('move.done', [$splitter]);
        }

        this.initEvent = function () {

            // if fixed is true , it don't set splitter bar event
            if (fixed === true) {
                return;
            }

            $el.on('mousedown', '> .' + this.options.splitterClass,  function (e) {

                $items.css('user-select', 'none');
                $items.find('iframe').css('pointer-events', 'none');

                if (is_vertical()) {
                    maxSize = $el.width();
                    $splitter.data('prevClientX', e.clientX);
                } else {
                    maxSize = $el.height();
                    $splitter.data('prevClientY', e.clientY);
                }

                $(document).on('mousemove', mouseMove);
                $(document).on('mouseup', mouseUp);

            });
        }

        this.setDirection = function (d) {
            direction = d;

            this.initElement();
        }

        this.setInitSize = function (size) {
            initSize = size;

            this.initResize();
        }

        this.setHide = function (index) {
            $($items[index]).hide().addClass(self.options.hideClass);

            this.initResize();
        }

        this.setShow = function (index) {
            $($items[index]).show().removeClass(self.options.hideClass);

            this.initResize();
        }

        this.toggle = function (index) {
            if($($items[index]).hasClass(self.options.hideClass)) {
                this.setShow(index);
            } else {
                this.setHide(index);
            }
        }

    }

    Splitter.setup = function () {
        return {
            /**
             * @cfg {String} [splitterClass='ui-splitter']
             * set splitter's class for design
             */
            splitterClass : 'ui-splitter',

            /**
             * @cfg {String} [hideClass='hide']
             * set splitter's hide class for design
             */
            hideClass: 'hide',

            /**
             * @cfg {Number} [barSize=4]
             * set splitter's bar size
             */
            barSize : 4,

            /**
             * @cfg {Object} [barSize={}]
             * set custom splitter bar style
             */
            barStyle : {
                'background-color': '#f6f6f6',
                'border-right': '1px solid #e4e4e4'
            },

            /**
             * @cfg {"vertical"/"horizontal"} [direction='vertical']
             * set bar's direction
             */
            direction : 'vertical',

            /**
             * @cfg {String/Number} [initSize='50%']
             * set first panel's default width or height
             */
            initSize : '50%',

            /**
             * @cfg {Number/Array} [minSize=30]
             * set panel's minimum width or height
             *
             * if minSize is number , minSize is conver to array
             *
             * minSize[0] is first panel's minimum size
             * minSize[1] is second panel's minimum size
             *
             */
            minSize : 30,

            /**
             * @cfg {String} [items=[]]
             *
             * set items  to placed in vertical or horizontal
             *
             * support max two times
             *
             */
            items : [],

            /**
             * @cfg {Boolean} [fixed=false]
             *
             * if fixed is true, panels can not resize.
             *
             */
            fixed : false
        }
    };

    return Splitter;
});