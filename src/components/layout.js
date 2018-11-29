import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.layout",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

        var UI = function() {
            var ui_layout = null,
                ui_options = {},
                directions = [ 'top','left','right','bottom','center' ];

            var resizerIcons = {
                top: 'n-resize',
                bottom: 'n-resize',
                right: 'e-resize',
                left: 'e-resize'
            };

            function setEvent($resizer, move, down, up) {
                $resizer.mousedown(function(e) {
                    $resizer.data('mousedown', true);

                    var $shadow = $resizer.clone();

                    $resizer.data('shadow', $shadow);
                    $resizer.after($shadow);

                    down.call(this, e);
                    $shadow.css('opacity', 0.3);

                    $(document).on('mousemove', move);
                    $(document).on('mouseup', function mouseUp(e) {
                        $(document).off('mousemove', move);
                        $(document).off('mouseup', mouseUp);

                        up.call(this, e);
                        $resizer.data('mousedown', false);

                        $shadow.remove();
                        $("body :not(.resize)").css({ 'user-select' : '' })
                    });

                    $("body :not(.resize)").css({ 'user-select' : 'none' })
                });
            }

            function setPosition(height, first, arr, second) {
                arr = arr || [];

                if(ui_layout[height]) {
                    ui_layout[height].height(first);
                }

                if(typeof arr == 'string') arr = [arr];
                if(arr.length == 0) return;

                for(var i = 0, len = arr.length; i < len; i++) {
                    var $obj = ui_layout[arr[i]];

                    if($obj) {
                        $obj.css({ top : second })
                        if($obj.resizer) $obj.resizer.css({ top : second })
                    }
                }
            }

            function setResizer(direction) {
                var $first, $second, $layout, $resizer, options;

                $layout = ui_layout[direction];
                $resizer = $layout.resizer;

                $resizer.css({
                    cursor : resizerIcons[direction]
                })

                if($resizer.data('event')) return;

                if(direction == 'top') {
                    setEvent($resizer, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var top = e.clientY - $resizer.data('current');
                        var min = ui_options.top.min;
                        var max = ui_options.top.max;
                        if(min <= top && top < max) {
                            $resizer.css({top : top + 'px'});
                        }

                    }, function(e) {
                        var top = $resizer.position().top;
                        $resizer.data('current', e.clientY - top);
                    }, function(e) {

                        var top = $resizer.position().top;
                        var height = $resizer.height();

                        var first = top;
                        var second = (top + $resizer.height()) + 'px';

                        var pre_height = ui_layout.top.height();
                        ui_layout.top.height(first);

                        var dh = pre_height - first;
                        var new_height = ui_layout.center.height() + dh;

                        ui_layout.center.css({top : second}).height(new_height);
                        ui_layout.left.css({top : second}).height(new_height);
                        ui_layout.left.resizer.css({top : second}).height(new_height);
                        ui_layout.right.css({top : second}).height(new_height);
                        ui_layout.right.resizer.css({top : second}).height(new_height);
                    });

                } else if(direction == 'bottom') {
                    setEvent($resizer, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var top = e.clientY - $resizer.data('current');
                        var min = ui_options.bottom.min;
                        var max = ui_options.bottom.max;

                        var dh =  $layout.position().top - (top + ui_options.barSize);
                        var real_height = dh + $layout.height();

                        if(min <= real_height && real_height <= max ) {
                            $resizer.css({top : top + 'px'});
                        }
                    }, function(e) {
                        var top = $resizer.position().top;
                        $resizer.data('current', e.clientY - top);
                    }, function(e) {
                        var top = $resizer.position().top + $resizer.height();

                        var max = ui_layout.root.height();
                        var dh = parseFloat(ui_layout.bottom.position().top) - top;

                        ui_layout.bottom.css({ top : top + "px"});
                        ui_layout.bottom.height(ui_layout.bottom.height() + dh);

                        var new_height = ui_layout.center.height() - dh;

                        ui_layout.center.height(new_height);
                        ui_layout.left.height(new_height);
                        ui_layout.left.resizer.height(new_height);
                        ui_layout.right.height(new_height);
                        ui_layout.right.resizer.height(new_height);
                    });
                } else if(direction == 'left') {
                    setEvent($resizer, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var left = e.clientX - $resizer.data('current');
                        var min = ui_options.left.min;
                        var max = ui_options.left.max;
                        if(min <= left && left < max) {
                            $resizer.css({left : left + 'px'});
                        }
                    }, function(e) {
                        var left = $resizer.position().left;
                        $resizer.data('left', left).data('current', e.clientX - left);
                    }, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var left = $resizer.position().left;
                        var pre_left = $resizer.data('left');
                        var dw = pre_left - left;

                        ui_layout.left.css({ width : left + "px"});
                        ui_layout.center.css({ left : (left + ui_options.barSize ) + "px" });
                        ui_layout.center.width(ui_layout.center.width() + dw);
                    });
                } else if(direction == 'right') {
                    setEvent($resizer, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var left = e.clientX - $resizer.data('current');
                        var min = ui_options.right.min;
                        var max = ui_options.right.max;

                        var sizeLeft = ui_layout.left.width() + ui_layout.left.resizer.width();
                        var sizeCenter = ui_layout.center.width();
                        var current = $layout.width() - (left - (sizeLeft + sizeCenter));

                        if(min <= current && current < max) {
                            $resizer.css({left : left + 'px'});
                        }
                    }, function(e) {
                        var left = $resizer.position().left;
                        $resizer.data('left', left).data('current', e.clientX - left);
                    }, function(e) {
                        if(!$resizer.data('mousedown')) return;

                        var left = $resizer.position().left;
                        var pre_left = $resizer.data('left');
                        var dw = pre_left - left;

                        ui_layout.right.css({
                            left : (left + $resizer.width()) + 'px',
                            width : (ui_layout.right.width() + dw) + "px"
                        });
                        ui_layout.center.width(ui_layout.center.width() - dw);
                    });
                }

                $resizer.data('event', true);
            }

            function initLayout(self) {
                for(var i = 0, len = directions.length; i < len; i++) {
                    var direct = ui_layout[directions[i]];

                    if(direct) {
                        ui_layout.root.append(direct);

                        if(directions[i] != 'center') {
                            if(ui_options[directions[i]].resize) {
                                if(!direct.resizer) {
                                    direct.resizer = $("<div class='resize " + directions[i] + "' />");
                                }

                                ui_layout.root.append(direct.resizer);
                                setResizer(directions[i]);
                            }
                        }
                    }
                }

                self.resize();
            }

            this.init = function() {
                var self = this, opts = this.options;
                var $root, $top, $left, $right, $bottom, $center;

                $root = $(this.root).css("position", "relative");

                if(opts.width != null) {
                    $root.outerWidth(opts.width);
                }

                if(opts.height != null) {
                    $root.outerHeight(opts.height);
                }

                $top = (opts.top.el) ? $(opts.top.el) : $root.find("> .top");
                if($top.length == 0) $top = null;

                $left = (opts.left.el) ? $(opts.left.el) : $root.find("> .left");
                if($left.length == 0) $left = null;


                $right = (opts.right.el) ? $(opts.right.el) : $root.find("> .right");
                if($right.length == 0) $right = null;

                $bottom = (opts.bottom.el) ? $(opts.bottom.el) : $root.find("> .bottom");
                if($bottom.length == 0) $bottom = null;

                $center = (opts.center.el) ? $(opts.center.el) : $root.find("> .center");
                if($center.length == 0) $center = null;

                ui_layout = {
                    root 	: $root,
                    top 	: $top,
                    left 	: $left,
                    right 	: $right,
                    bottom 	: $bottom,
                    center	: $center
                };

                ui_options = opts;
                initLayout(this);

                $(window).on('resize', function(e) {
                    self.resize();
                })

                return this;
            }

            /**
             * @method resize
             * Resets the layout
             */
            this.resize = function() {
                var $obj = null, $option = null;
                var sizeTop = 0, sizeLeft = 0, sizeRight = 0, sizeBottom = 0, sizeCenter = 0 ;

                $obj = ui_layout.top;
                $option = this.options.top;

                if($obj) {
                    $obj.css({
                        'position' : 'absolute',
                        'top' : '0px',
                        'left' : '0px',
                        'width' : '100%',
                        'height' : $option.size || $option.min
                    });

                    sizeTop = $obj.height();

                    if($option.resize) {
                        $obj.resizer.css({
                            'position' : 'absolute',
                            'top': sizeTop,
                            'left' : '0px',
                            'width' : '100%',
                            "background": this.options.barColor,
                            "height" : this.options.barSize
                        })

                        sizeTop += this.options.barSize;
                    } else {
                        if($obj.resizer) {
                            $obj.resizer.remove();
                        }
                    }
                }

                $obj = ui_layout.bottom;
                $option = this.options.bottom;

                var max = ui_layout.root.height();

                if($obj) {
                    $obj.css({
                        'position' : 'absolute',
                        'left' : '0px',
                        'width' : '100%',
                        'height' : $option.size || $option.min
                    });

                    var bottom_top = (sizeTop -  $obj.height()) + sizeTop;

                    if($option.resize) {
                        $obj.resizer.css({
                            'position' 	: 'absolute',
                            'top' 		: bottom_top,
                            'left' 		: '0px',
                            'width' 	: '100%',
                            "background": this.options.barColor,
                            "height" 	: this.options.barSize
                        });

                        bottom_top += this.options.barSize;
                    } else {
                        if($obj.resizer) {
                            $obj.resizer.remove();
                        }
                    }

                    $obj.css('top', bottom_top + "px");
                }

                $obj = ui_layout.left;
                $option = this.options.left;

                var content_height = max ;

                if(ui_layout.top) {
                    content_height -= ui_layout.top.height();
                    if(ui_layout.top.resizer) {
                        content_height -= ui_layout.top.resizer.height();
                    }
                }

                if(ui_layout.bottom) {
                    content_height -= ui_layout.bottom.height();
                    if(ui_layout.bottom.resizer) {
                        content_height -= ui_layout.bottom.resizer.height();
                    }
                }

                if($obj) {
                    $obj.css({
                        'position' : 'absolute',
                        'top' : sizeTop,
                        'left' : '0px',
                        'height' : content_height,
                        'width' : $option.size || $option.min,
                        'max-width' : '100%',
                        'overflow' : 'auto'
                    });

                    sizeLeft = $obj.width();

                    if($option.resize) {
                        $obj.resizer.css({
                            'position' 	: 'absolute',
                            'top' 		: sizeTop,
                            'height'	: $obj.height(),
                            'left' 		: sizeLeft,
                            "background": this.options.barColor,
                            "width" 	: this.options.barSize
                        });

                        sizeLeft += this.options.barSize;
                    } else {
                        if($obj.resizer) {
                            $obj.resizer.remove();
                        }
                    }
                }

                $obj = ui_layout.right;
                $option = this.options.right;

                var max_width = ui_layout.root.width();
                var content_width = max_width;

                if(ui_layout.left) {
                    content_width -= ui_layout.left.width();
                    if(ui_layout.left.resizer) {
                        content_width -= ui_layout.left.resizer.width();
                    }
                }

                if($obj) {
                    $obj.css({
                        'position' : 'absolute',
                        'top' : sizeTop,
                        //'right' : '0px',
                        'height' : content_height,
                        'width' : $option.size || $option.min  ,
                        'max-width' : '100%'
                    });

                    if($option.resize) {
                        $obj.resizer.css({
                            'position' 	: 'absolute',
                            'top' 		: sizeTop,
                            'height'	: $obj.height(),
                            "background": this.options.barColor,
                            "width" 	: this.options.barSize
                        })

                        sizeRight += this.options.barSize;
                    } else {
                        if($obj.resizer) {
                            $obj.resizer.remove();
                        }
                    }

                    content_width -= ui_layout.right.width();
                    if(ui_layout.right.resizer) {
                        content_width -= ui_layout.right.resizer.width();
                    }

                    $obj.resizer.css({ left : (sizeLeft + content_width) + "px" });
                    $obj.css({left : (sizeLeft + content_width + $obj.resizer.width()) + "px"})

                }

                $obj = ui_layout.center;
                $option = this.options.center;

                if($obj) {
                    $obj.css({
                        'position' 	: 'absolute',
                        'top' 		: sizeTop,
                        'height'  : content_height,
                        'left' 		: sizeLeft,
                        'width'   : content_width,
                        'overflow' : 'auto'
                    });
                }
            }
        }

        UI.setup = function() {
            return {
                /**
                 * @cfg {String} [barColor="#d6d6d6"]
                 * Determines the color of the resizing bar
                 */
                barColor : '#d6d6d6',

                /**
                 * @cfg {Integer} [barSize=3]
                 * Determines the size of the resizing bar
                 */
                barSize : 3,

                /**
                 * @cfg {Integer} [width=null]
                 * Determines the container area value
                 */
                width	: null,

                /**
                 * @cfg {Integer} [height=null]
                 * Determines the container height value
                 */
                height	: null,

                /**
                 * @cfg {Object} top
                 * Configures options for the top area
                 */
                top		: { el : null, size : null, min : 50, max : 200, resize : true },

                /**
                 * @cfg {Object} left
                 * Configures options for the left area
                 */
                left	: { el : null, size : null, min : 50, max : 200, resize : true },

                /**
                 * @cfg {Object} right
                 * Configures options for the right area
                 */
                right	: { el : null, size : null, min : 50, max : 200, resize : true },

                /**
                 * @cfg {Object} bottom
                 * Configures options for the bottom area
                 */
                bottom	: { el : null, size : null, min : 50, max : 200, resize : true },

                /**
                 * @cfg {Object} center
                 * Configures options for the center area
                 */
                center	: { el : null }
            }
        }

        return UI;
    }
}