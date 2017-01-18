jui.defineUI("ui.accordion", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.accordion
     * @extends core
     * @alias Accordion
     * @requires jquery
     */
    var UI = function() {
        var self;
        var activeIndex = 0;

        var $title = null,
            $contents = null;

        function showTitle(index) {
            $title.each(function(i) {
                if(index == i) {
                    $(this).addClass("active");

                    if (self.options.multipanel) {
                        $(this).next('.content').show();
                    }  else {
                        $contents.insertAfter(this).show();
                    }
                } else {
                    $(this).removeClass("active");

                    if (self.options.multipanel) {
                        $(this).next('.content').hide();
                    }

                }
            });
        }

        function setTitleEvent(self) {
            $title.each(function(i) {
                self.addEvent(this, "click", function(e) {
                    if($(this).hasClass("active") && self.options.autoFold) {
                        $(this).removeClass("active");

                        if (self.options.multipanel) {
                            $(this).next('.content').hide();
                        } else {
                            $contents.hide();
                        }
                        self.emit("fold", [ i, e ] );
                    } else {
                        showTitle(i);
                        self.emit("open", [ i, e ]);
                    }
                });
            });
        }

        this.init = function() {
            self = this;
            var opts = this.options;

            $title = $(this.root).find(".title");
            $contents = $(this.root).find(".content");

            if (opts.index == null) {
                for(var i=0; i < $title.length; i++) {
                    if ($($title[i]).hasClass("active")) {
                        opts.index = i;
                    }
                }
            }

            if(_.typeCheck("integer", opts.index)) {
                showTitle(opts.index);
            } else {
                $contents.hide();
            }

            setTitleEvent(this);

            this.emit('init');
        };

        /**
         * @method activeIndex
         * Gets the index of the currently enabled node
         *
         * @return {Integer} Index
         */
        this.activeIndex = function() {
            return activeIndex;
        }
    };

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [index=null]
             * Sets an enabled node
             */
            index: null,

            /**
             * @cfg {Boolean} [autoFold=false]
             * When you click on a node, the node folding
             */
            autoFold: false,

            /**
             * @cfg {Boolean} [multipanel=false]
             *
             */
            multipanel : false
        }
    };

    /**
     * @event open
     * When a node is opened, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    /**
     * @event fold
     * When a node is closed, the events that occur
     *
     * @param {Integer} index Index
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
