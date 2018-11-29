import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.switch",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

        var UI = function() {
            function selectDom(root, selector) {
                var $dom = $(root).find('.' + selector);

                if (!$dom.length) {
                    $dom = $("<div />").addClass(selector);
                }

                return $dom;
            }

            this.init = function() {
                var self = this,
                    opts = this.options;

                var $left = selectDom(this.root, "left"),
                    $right = selectDom(this.root, "right"),
                    $area = selectDom(this.root, "area"),
                    $bar = selectDom(this.root, "bar"),
                    $handle = selectDom(this.root, "handle");

                $bar.html($left),
                    $bar.append($right),
                    $area.html($bar);

                $(this.root).html($area).append($handle);

                this.addEvent(this.root, opts.toggleEvent, function(e) {
                    self.toggle();
                });

                if(opts.checked) {
                    $(this.root).addClass("on");
                }
            }

            this.getValue = function() {
                return $(this.root).hasClass("on");
            }

            this.setValue = function(value) {
                $(this.root).toggleClass("on", !!value);
                this.emit("change", [ value ]);
            }

            this.toggle = function() {
                this.setValue(!this.getValue());
            }
        };

        UI.setup = function() {
            return {
                checked: false,
                toggleEvent: "click"
            }
        }

        return UI;
    }
}