jui.defineUI("ui.switch", [ "jquery", "util.base" ], function($, _) {


    /**
     * @class ui.combo
     * @extends core
     * @alias Combo Box
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self = this;

        function selectDom(selector) {
            var $dom = $(self.root).find('.' + selector);

            if (!$dom.length) {
                $dom = $("<div />").addClass(selector);
            }

            return $dom;
        }

        this.data = function (key) {
            return $(this.root).data(key) || this.options[key];
        };

        this.init = function() {


            this.$left = selectDom('left');
            this.$right = selectDom('right');
            this.$area = selectDom('switch-area');
            this.$bar = selectDom('switch-bar');
            this.$handle = selectDom('handle');

            this.$bar.html(this.$left);
            this.$bar.append(this.$right);

            this.$area.html(this.$bar);

            $(this.root).html(this.$area).append(this.$handle);

            this.initEvent();

            this.setValue(this.data('value'));
        };

        this.initEvent = function () {
            this.addEvent(this.$left, 'click', function (e) {
                self.setValue(false);
            });

            this.addEvent(this.$right, 'click', function (e) {
                self.setValue(true);
            });
        }

        this.getValue = function() {
            return $(this.root).hasClass('on');
        };

        this.setValue = function (value) {
            $(this.root).toggleClass('on', !!value);
            this.emit('change');
        };

        this.toggle = function () {
            this.setValue(!this.getValue());
        }
    };

    UI.setup = function() {
        return {
            value : false
        }
    }


    return UI;
});