import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.modal",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

        var win_width = 0;
        var win_height = 0;

        _.resize(function() {
            if(win_width == $(window).width() && win_height == $(window).height()) return;

            var call_list = jui.get("ui.modal");
            for(var i = 0; i < call_list.length; i++) {
                var ui_list = call_list[i];

                for(var j = 0; j < ui_list.length; j++) {
                    if(ui_list[j].type == "show") {
                        ui_list[j].resize();
                    }
                }
            }

            win_width = $(window).width();
            win_height = $(window).height();
        }, 300);

        var UI = function() {
            var $modal = {}, $clone = null;
            var uiObj = null, uiTarget = null;
            var z_index = 5000;

            function setPrevStatus(self) {
                uiObj = {
                    "position": $(self.root).css("position"),
                    "left": $(self.root).css("left"),
                    "top": $(self.root).css("top"),
                    "z-index": $(self.root).css("z-index"),
                    "display": $(self.root).css("display")
                };

                uiTarget = {
                    "position": $(self.options.target).css("position")
                };
            }

            function getInnerModalPosition(target) {
                if(target == "body") {
                    return null;
                } else {
                    if($(target).hasClass("msgbox") || $(target).hasClass("window")) {
                        return "absolute";
                    } else {
                        return "relative";
                    }
                }
            }

            function getModalInfo(self) {
                var target = self.options.target,
                    hTarget = (target == "body") ? window : target,
                    pos = (target == "body") ? "fixed" : "absolute",
                    tPos = getInnerModalPosition(target),
                    sLeft = $(target).scrollLeft();

                var x = (($(hTarget).width() / 2) - ($(self.root).width() / 2)) + $(target).scrollLeft(),
                    y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);

                var w = (sLeft > 0) ? $(target).outerWidth() + sLeft : "100%",
                    h = $(target).outerHeight();

                // inner modal일 경우
                if(tPos != null) {
                    var sh = $(hTarget)[0].scrollHeight;

                    h = (sh > h) ? sh : h;
                    y = y + $(hTarget).scrollTop();

                    // global modal일 경우
                } else {
                    var sh = $(window).outerHeight();

                    h = (h > sh) ? h : sh;
                }

                return {
                    x: x, y: y, pos: pos, tPos: tPos, w: w, h: h
                }
            }

            function createModal(self, w, h) {
                var opts = self.options,
                    mi = self.timestamp,
                    parent = opts.parent != null ? opts.parent : opts.target;

                if($modal[mi] != null) return;

                $modal[mi] = $("<div id='MODAL_" + self.timestamp + "'></div>").css({
                    position: "absolute",
                    width: w,
                    height: h,
                    left: 0,
                    top: 0,
                    opacity: self.options.opacity,
                    "background-color": self.options.color,
                    "z-index": (z_index + self.options.index) - 1
                });

                // 모달 추가
                $(parent).append($modal[mi]);

                // 루트 모달 옆으로 이동
                $(self.root).insertAfter($modal[mi]);

                // 모달 닫기 이벤트 걸기
                self.addEvent($modal[mi], "click", function(e) {
                    if(self.options.autoHide) {
                        self.hide();
                    }

                    return false;
                });
            }

            this.init = function() {
                setPrevStatus(this); // 이전 상태 저장

                // 대상의 기본 상태는 숨기기
                if(!this.options.clone) {
                    $(this.root).hide();
                }

                // 타입 프로퍼티 설정
                this.type = "hide";
            }

            /**
             * @method hide
             * Hides a modal
             */
            this.hide = function() {
                var opts = this.options,
                    mi = this.timestamp;

                // 모달 대상 객체가 숨겨진 상태가 아닐 경우..
                if(opts.clone) {
                    $clone.remove();
                    $clone = null;
                }

                $(opts.target).css("position", uiTarget.position);
                $(this.root).css(uiObj);

                if($modal[mi]) {
                    $modal[mi].remove();
                    delete $modal[mi];
                }

                this.type = "hide";
            }

            /**
             * @method show
             * Shows a modal
             */
            this.show = function() {
                var opts = this.options,
                    info = getModalInfo(this);

                // 모달 대상 객체가 숨겨진 상태가 아닐 경우..
                if(opts.clone) {
                    $clone = $(this.root).clone();
                    $clone.insertAfter($(this.root));
                }

                // 위치 재조정
                $(this.root).appendTo(opts.target);
                this.resize();

                $(opts.target).css("position", info.tPos);
                $(this.root).show();

                createModal(this, info.w, info.h);
                this.type = "show";
            }

            /**
             * @method resize
             * Re-adjust the location of a modal
             */
            this.resize = function() {
                var info = getModalInfo(this),
                    mi = this.timestamp;

                $(this.root).css({
                    "position": info.pos,
                    "left": info.x,
                    "top": info.y,
                    "z-index": (z_index + this.options.index)
                });

                if($modal[mi] != null) {
                    $modal[mi].height(info.h);
                }
            }
        }

        UI.setup = function() {
            return {
                /**
                 * @cfg {"black"/"gray"} [color="black"]
                 * Determines the color of a modal
                 */
                color: "black",

                /**
                 * @cfg {Float} [opacity=0.4]
                 * Sets the transparency of a modal
                 */
                opacity: 0.4,

                /**
                 * @cfg {String/DOMElement} [target="body"]
                 * Sets a selector on which a modal is shown
                 */
                target: "body",

                /**
                 * @cfg {String/DOMElement} [target="body"]
                 * Sets a selector on which a modal is shown
                 */
                parent: null,

                /**
                 * @cfg {Integer} [index=0]
                 * Determines the sequence (index) of a modal
                 */
                index: 0,

                /**
                 * @cfg {Boolean} [clone=false]
                 * Copies an existing modal and shows it
                 */
                clone: false,

                /**
                 * @cfg {Boolean} [autoHide=true]
                 * Automatically hides a modal when clicking on it
                 */
                autoHide: true
            }
        }

        return UI;
    }
}