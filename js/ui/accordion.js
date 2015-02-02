jui.defineUI("ui.accordion", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.accordion
     * @extends core
     * @alias Accordion
     * @requires jquery
     *
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

        this.activeIndex = function() {
            return activeIndex;
        }
    }

    UI.setup = function() {
        return {
            index: null,
            autoFold: false
        }
    }

    return UI;
});