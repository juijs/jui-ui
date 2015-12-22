jui.defineUI("ui.accordion", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.accordion
     * @extends core
     * @alias Accordion
     * @requires jquery
     */
    var UI = function() {
        var activeIndex = 0;

        var $title = null,
            $content = null;

        function showTitle(index) {
            $title.each(function(i) {
                if(index == i) {
                    $(this).addClass("active");
                    $content.insertAfter(this).show();
                } else {
                    $(this).removeClass("active");
                }
            });
        }

        function setTitleEvent(self) {
            $title.each(function(i) {
                self.addEvent(this, "click", function(e) {
                    if($(this).hasClass("active") && self.options.autoFold) {
                        $(this).removeClass("active");
                        $content.hide();
                        self.emit("fold", [ i, e ] );
                    } else {
                        showTitle(i);
                        self.emit("open", [ i, e ]);
                    }
                });
            });
        }

        this.init = function() {
            var opts = this.options;

            $title = $(this.root).find(".title");
            $content = $(this.root).find(".content");

            if(_.typeCheck("integer", opts.index)) {
                showTitle(opts.index);
            } else {
                $content.hide();
            }

            setTitleEvent(this);
        }

        /**
         * @method activeIndex
         * Gets the index of the currently enabled node
         *
         * @return {Integer} Index
         */
        this.activeIndex = function() {
            return activeIndex;
        }
    }

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
            autoFold: false
        }
    }

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