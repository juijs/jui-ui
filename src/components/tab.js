import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.tab",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");
        var dropdown = jui.include("ui.dropdown");

        var UI = function() {
            var ui_menu = null,
                $anchor = null;

            var menuIndex = -1, // menu index
                activeIndex = 0;

            function hideAll(self) {
                var $list = $(self.root).children("li");
                $list.removeClass("active");
            }

            function showMenu(self, elem) {
                var pos = $(elem).offset();

                $(elem).addClass("checked");
                ui_menu.show(pos.left, pos.top + $(self.root).height());
            }

            function hideMenu(self) {
                var $list = $(self.root).children("li"),
                    $menuTab = $list.eq(menuIndex);

                $menuTab.removeClass("checked");
            }

            function changeTab(self, index) {
                hideAll(self);

                var $list = $(self.root).children("li"),
                    $tab = $list.eq(index).addClass("active");

                $anchor.appendTo($tab);
                showTarget(self.options.target, $tab[0]);
            }

            function showTarget(target, elem, isInit) {
                var hash = $(elem).find("[href*=\\#]").attr("href");

                $(target).children("*").each(function(i) {
                    var self = this;

                    if(("#" + self.id) == hash) {
                        $(self).show();
                    } else {
                        $(self).hide();
                    }
                });
            }

            function setEventNodes(self) {
                $(self.root).children("li").each(function(i) {
                    // 메뉴 설정
                    if($(this).hasClass("menu")) {
                        menuIndex = i;
                    }

                    // 이벤트 설정
                    self.addEvent(this, [ "click", "contextmenu" ], function(e) {
                        if($(this).hasClass("disabled")) {
                            return false;
                        }

                        var text = $.trim($(this).text()),
                            value = $(this).val();

                        if(i != menuIndex) {
                            if(i != activeIndex) {
                                var args = [ { index: i, text: text, value: value }, e ];

                                if(self.options.target != "") {
                                    showTarget(self.options.target, this);
                                }

                                // 엑티브 인덱스 변경
                                activeIndex = i;

                                self.emit("change", args);
                                self.emit("click", args);

                                changeTab(self, i);
                            }
                        } else {
                            self.emit("menu", [ { index: i, text: text }, e ]);
                            if(ui_menu.type != "show") showMenu(self, this);
                        }

                        return false;
                    });
                });

                setActiveNode(self);
                setEventDragNodes(self);
            }

            function setEventDragNodes(self) {
                if(!self.options.drag) return;

                var $tabs = $(self.root).children("li"),
                    $origin = null,
                    $clone = null;

                var index = null,
                    targetIndex = null;

                $tabs.each(function(i) {
                    self.addEvent(this, "mousedown", function(e) {
                        $origin = $(this);
                        $clone = $origin.clone().css("opacity", "0.5");

                        index = i;
                        self.emit("dragstart", [ index, e ]);

                        return false;
                    });

                    self.addEvent(this, "mousemove", function(e) {
                        if(index == null) return;
                        targetIndex = i;

                        if(index > targetIndex) { // move 로직과 동일
                            if(targetIndex == 0) {
                                $clone.insertBefore($tabs.eq(0));
                            } else {
                                $clone.insertAfter($tabs.eq(targetIndex - 1));
                            }
                        } else {
                            if(targetIndex == $tabs.length - 1) {
                                $clone.insertAfter($tabs.eq(targetIndex));
                            } else {
                                $clone.insertBefore($tabs.eq(targetIndex + 1));
                            }
                        }

                        $origin.hide();
                    });
                });

                self.addEvent(self.root, "mouseup", function(e) {
                    if($origin != null) $origin.show();
                    if($clone != null) $clone.remove();

                    if(index != null && targetIndex != null) {
                        self.move(index, targetIndex);
                        self.emit("dragend", [ targetIndex, e ]);
                    }

                    index = null;
                    targetIndex =  null;
                });
            }

            function setActiveNode(self) {
                var $list = $(self.root).children("li"),
                    $markupNode = $list.filter(".active"),
                    $indexNode = $list.eq(activeIndex),
                    $node = ($markupNode.length == 1) ? $markupNode : $indexNode;

                // 노드가 없거나 disabled 상태일 때, 맨 첫번째 노드를 활성화
                if($node.hasClass("disabled") || $node.length == 0) {
                    $node = $list.eq(0);
                    activeIndex = 0;
                }

                $anchor.appendTo($node);
                changeTab(self, $list.index($node));
            }

            this.init = function() {
                var self = this, opts = this.options;

                // 활성화 인덱스 설정
                activeIndex = opts.index;

                // 컴포넌트 요소 세팅
                $anchor = $("<div class='anchor'></div>");

                // 탭 목록 갱신 및 이벤트 설정
                if(opts.nodes.length > 0) {
                    this.update(opts.nodes);
                } else {
                    setEventNodes(this);
                }

                // 드롭다운 메뉴
                if(this.tpl.menu) {
                    var $menu = $(this.tpl.menu());
                    $("body").append($menu);

                    ui_menu = dropdown($menu, {
                        event: {
                            change: function(data, e) {
                                hideMenu(self);
                                self.emit("changemenu", [ data, e ]);
                            },
                            hide: function() {
                                hideMenu(self);
                            }
                        }
                    });
                }

                return this;
            }

            /**
             * @method update
             * Changes the tab list
             *
             * @param {Array} nodes
             */
            this.update = function(nodes) {
                if(!this.tpl.node) return;

                $(this.root).empty();

                for(var i = 0; i < nodes.length; i++) {
                    $(this.root).append(this.tpl.node(nodes[i]));
                }

                setEventNodes(this);
            }

            /**
             * @method insert
             * Adds a tab at a specified index
             *
             * @param {Integer} index
             * @param {Object} node
             */
            this.insert = function(index, node) {
                if(!this.tpl.node) return;

                var html = this.tpl.node(node),
                    $list = $(this.root).children("li");

                if(index == $list.length) {
                    $(html).insertAfter($list.eq(index - 1));
                } else {
                    $(html).insertBefore($list.eq(index));
                }

                setEventNodes(this);
            }

            /**
             * @method append
             * Adds a tab to the last node
             *
             * @param {Object} node
             */
            this.append = function(node) {
                if(!this.tpl.node) return;

                var html = this.tpl.node(node);

                if(menuIndex != -1) {
                    $(html).insertBefore($(this.root).find(".menu"));
                    menuIndex++;
                } else {
                    $(this.root).append(html);
                }

                setEventNodes(this);
            }

            /**
             * @method prepend
             * Adds a tab to the first node
             *
             * @param {Object} node
             */
            this.prepend = function(node) {
                if(!this.tpl.node) return;

                $(this.root).prepend(this.tpl.node(node));
                setEventNodes(this);
            }

            /**
             * @method remove
             * Removes a tab at a specified index
             *
             * @param {Integer} index
             */
            this.remove = function(index) {
                $(this.root).children("li").eq(index).remove();
                setEventNodes(this);
            }

            /**
             * @method move
             * Changes a specified tab to a tab at a target index
             *
             * @param {Integer} index
             * @param {Integer} targetIndex
             */
            this.move = function(index, targetIndex) {
                if(index == targetIndex) return;

                var $tabs = $(this.root).children("li"),
                    $target = $tabs.eq(index);

                if(index > targetIndex) {
                    if(targetIndex == 0) {
                        $target.insertBefore($tabs.eq(0));
                    } else {
                        $target.insertAfter($tabs.eq(targetIndex - 1));
                    }
                } else {
                    if(targetIndex == $tabs.length - 1) {
                        $target.insertAfter($tabs.eq(targetIndex));
                    } else {
                        $target.insertBefore($tabs.eq(targetIndex + 1));
                    }
                }

                activeIndex = targetIndex;
                setEventNodes(this);
            }

            /**
             * @method show
             * Enables the tab at a specified index
             *
             * @param {Integer} index
             */
            this.show = function(index) {
                if(index == menuIndex || index == activeIndex) return;

                var $target = $(this.root).children("li").eq(index);
                if($target.hasClass("disabled")) return;

                activeIndex = index;

                this.emit("change", [{
                    index: index,
                    text: $.trim($target.text()),
                    value: $target.val()
                }]);

                changeTab(this, index);
            }

            /**
             * @method enable
             * Enables the tab at a specified index
             *
             * @param {Integer} index
             */
            this.enable = function(index) {
                if(index == menuIndex || index == activeIndex) return;

                var $target = $(this.root).children("li").eq(index);
                $target.removeClass("disabled");
            }

            /**
             * @method disable
             * Disables the tab at a specified index
             *
             * @param {Integer} index
             */
            this.disable = function(index) {
                if(index == menuIndex || index == activeIndex) return;

                var $target = $(this.root).children("li").eq(index);
                $target.addClass("disabled");
            }

            /**
             * @method activeIndex
             * Gets the index of the currently enabled tab
             *
             * @return {Integer}
             */
            this.activeIndex = function() {
                return activeIndex;
            }
        }

        UI.setup = function() {
            return {
                /**
                 * @cfg {String/DOMElement} [target=""]
                 * Determines a selector in the area to become the content of a tab
                 */
                target: "",

                /**
                 * @cfg {Integer} [index=0]
                 * Sets an enabled tab
                 */
                index: 0,

                /**
                 * @cfg {Boolean} [drag=false]
                 * Changes the tab location through dragging
                 */
                drag: false,

                /**
                 * @cfg {Array} nodes
                 * Sets a tab list to data rather than markup
                 */
                nodes: []
            }
        }

        /**
         * @event change
         * Event that occurs when a tab is enabled
         *
         * @param {Object} data changed data
         * @param {EventObject} e The event object
         */

        /**
         * @event click
         * Event that occurs when a tab is mouse clicked
         *
         * @param {Object} data changed data
         * @param {EventObject} e The event object
         */

        /**
         * @event menu
         * Event which occurs when tab menu shown
         *
         * @param {Object} data changed data
         * @param {EventObject} e The event object
         */

        /**
         * @event changemenu
         * Event that occurs when a dropdown is selected
         *
         * @param {Object} data changed data
         * @param {EventObject} e The event object
         */

        /**
         * @event dragstart
         * Event that occurs when a tab starts to move
         *
         * @param {Integer} index
         * @param {EventObject} e The event object
         */

        /**
         * @event dragend
         * Event that occurs when the movement of a tab is completed
         *
         * @param {Integer} index
         * @param {EventObject} e The event object
         */

        return UI;
    }
}