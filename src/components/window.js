import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.window",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");
        var modal = jui.include("ui.modal");

        var UI = function() {
            var z_index = null,
                target = null,
                move = {},
                resize = {},
                info = {},
                ui_modal = null;

            function setBodyResize() {
                var bottom = (info.$foot.length < 1) ? 5 : info.$foot.outerHeight();
                info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
            }

            this.init = function() {
                var self = this, opts = this.options;

                var $win_root = $(this.root),
                    $win_head = $(this.root).children(".head"),
                    $win_body = $(this.root).children(".body"),
                    $win_foot = $(this.root).children(".foot");

                // 옵션 예외 처리
                if(opts.modal) {
                    opts.move = false;
                    opts.resize = false;
                }

                // z-index 설정
                z_index = opts.layerIndex;

                // UI 객체 추가
                info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };

                // 기본 스타일 & Modal 스타일 & Body로 강제 이동
                $win_root.css($.extend({ position: "absolute" }, opts)).appendTo($("body"));

                // 윈도우 이동
                if(opts.move) {
                    this.addEvent($win_head, "mousedown", function(e) {
                        target = $win_root;

                        move.check = true;
                        move.disX = e.pageX - target.offset().left;
                        move.disY = e.pageY - target.offset().top;
                    });
                }

                // 윈도우 리사이징
                if(opts.resize) {
                    $win_root.append("<i class='icon-resize resize'></i>");

                    this.addEvent($win_root.children(".resize"), "mousedown", function(e) {
                        target = $win_root;

                        resize.check = true;
                        resize.disX = target.width() + target.offset().left;
                        resize.disWidth = target.width();
                        resize.disY = target.height() + target.offset().top;
                        resize.disHeight = target.height();

                        return false;
                    });
                }

                // 윈도우 포커스
                if(!opts.modal) {
                    self.addEvent($win_root, "mousedown", function(e) {
                        $win_root.css("z-index", ++z_index);
                        e.stopPropagation();
                    });
                }

                // 윈도우 숨기기
                this.addEvent($win_head.find(".close"), "click", function(e) {
                    self.hide();
                    return false;
                });

                this.addEvent("body", "mousemove", function(e) {
                    // 윈도우 이동
                    if(move.check) {
                        var x = e.pageX - move.disX;
                        var y = e.pageY - move.disY;

                        $(target).css({ left: x + "px", top: y + "px" });
                    }

                    // 윈도우 리사이징
                    if(resize.check) {
                        var resizeX = e.pageX - resize.disX,
                            resizeY = e.pageY - resize.disY;

                        target.width(resize.disWidth + resizeX);
                        target.height(resize.disHeight + resizeY);

                        setBodyResize();
                    }
                });

                this.addEvent("body", "mouseup", function(e) {
                    if(move.check) self.emit("move", e);
                    if(resize.check) self.emit("resize", e);

                    move.check = false;
                    resize.check = false;
                });

                // 기본 타입 설정
                this.type = "hide";
                $win_root.hide();

                // 모달 컴포넌트 설정
                if(opts.modal) {
                    var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
                    ui_modal = modal(self.root, $.extend({ autoHide: false }, modalOpts));
                }
            }

            /**
             * @method hide
             * Hides a window
             */
            this.hide = function() {
                if(ui_modal) ui_modal.hide();
                else info.$root.hide();

                this.emit("hide");
                this.type = "hide";
            }

            /**
             * @method show
             * Shows a window at specified coordinates
             *
             * @param {Integer} x
             * @param {Integer} y
             */
            this.show = function(x, y) {
                if(ui_modal) ui_modal.show();
                else info.$root.show();

                if(x || y) this.move(x, y);

                this.emit("show");
                this.type = "show";

                setBodyResize();
            }

            /**
             * @method move
             * Moves a window at specified coordinates
             *
             * @param {Integer} x
             * @param {Integer} y
             */
            this.move = function(x, y) {
                info.$root.css("left", x);
                info.$root.css("top", y);
            }

            /**
             * @method update
             * Changes the markup in the body area of a window
             *
             * @param {String} html
             */
            this.update = function(html) {
                info.$body.empty().html(html);
            }

            /**
             * @method setTitle
             * Changes the markup of the title tag in the head area of a window
             *
             * @param {String} title
             */
            this.setTitle = function(html) {
                info.$head.find(".title").empty().html(html);
            }

            /**
             * @method setSize
             * Changes the horizontal/vertical size of a window
             *
             * @param {Integer} width
             * @param {Integer} height
             */
            this.setSize = function(w, h) {
                info.$root.width(w);
                info.$root.height(h);

                setBodyResize();
            }

            /**
             * @method resize
             * Designates a scroll area if there is a lot of content in the window body area
             */
            this.resize = function() {
                setBodyResize();
            }

            /**
             * @method resizeModal
             * Re-adjust the location of a modal window
             */
            this.resizeModal = function() {
                if(!ui_modal) return;

                ui_modal.resize();
            }
        }

        UI.setup = function() {
            return {
                /**
                 * @cfg {Integer} [width=400]
                 * Determines the horizontal size of a window
                 */
                width: 400,

                /**
                 * @cfg {Integer} [height=300]
                 * Determines the height of a window
                 */
                height: 300,

                /**
                 * @cfg {String/Integer} [left="auto"]
                 * Determines the X coordinate of a window
                 */
                left: "auto",

                /**
                 * @cfg {String/Integer} [top="auto"]
                 * Determines the Y coordinate of a window
                 */
                top: "auto",

                /**
                 * @cfg {String/Integer} [right="auto"]
                 * Determines the X coordinate based on the right side of a window
                 */
                right: "auto",

                /**
                 * @cfg {String/Integer} [bottom="auto"]
                 * Determines the Y coordinate based on the bottom side of a window
                 */
                bottom: "auto",

                /**
                 * @cfg {Boolean} [modal=false]
                 * Applies a modal UI to a window
                 */
                modal: false,

                /**
                 * @cfg {Boolean} [move=true]
                 * It is possible to move a window
                 */
                move: true,

                /**
                 * @cfg {Boolean} [resize=true]
                 * It is possible to resize a window
                 */
                resize: true,

                /**
                 * @cfg {Integer} [modalIndex=0]
                 * Determines the z-index property of a modal UI
                 */
                modalIndex: 0,

                /**
                 * @cfg {Integer} [layerIndex=2000]
                 * Determines the z-index property of a modal UI
                 */
                layerIndex: 2000,

                /**
                 * @cfg {Boolean} [animate=false]
                 * Determines whether to use the animation effect of a UI
                 *
                 * @deprecated
                 */
                animate: false
            }
        }

        /**
         * @event show
         * Event that occurs when a window is shown
         */

        /**
         * @event hide
         * Event that occurs when a window is hidden
         */

        /**
         * @event move
         * Event that occurs when a window is moved
         *
         * @param {EventObject} e The event object
         */

        /**
         * @event resize
         * Event that occurs when a window is resized
         *
         * @param {EventObject} e The event object
         */

        return UI;
    }
}