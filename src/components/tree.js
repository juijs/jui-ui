import $ from "jquery"
import jui from "../main.js"
import BaseMod from "./tree.base.js"

jui.use(BaseMod);

export default {
    name: "ui.tree",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");
        var Base = jui.include("ui.tree.base");

        var UI = function () {
            var dragIndex = {start: null, end: null, clone: null},
                nodeIndex = null,
                iParser = _.index();


            function setNodeStatus(self, nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i];
                    $(node.element).removeClass("open fold leaf last");

                    if (node.parent && node.isLeaf()) {
                        $(node.element).addClass("leaf");
                    } else {
                        if (node.type == "open") {
                            $(node.element).addClass("open");
                            node.open();
                        } else {
                            $(node.element).addClass("fold");
                            node.fold();
                        }
                    }

                    if (!node.parent) {
                        $(node.element).addClass("root");
                    } else {
                        if (node.parent.lastChild() == node) {
                            $(node.element).addClass("last");
                        }
                    }

                    $(node.element).children("i:first-child").remove();
                    $(node.element).prepend($("<i></i>"));
                }
            }

            function toggleNode(self, index, callback) {
                if (index == null) {
                    if (self.options.rootHide) {
                        var childs = self.uit.getRoot().children;

                        for (var i = 0; i < childs.length; i++) {
                            callback(childs[i].index);
                        }

                        reloadUI(self, false);
                    } else {
                        callback(index);
                        reloadUI(self, true);
                    }
                } else {
                    callback(index);
                    reloadUI(self, false);
                }
            }

            function setEventNodes(self, nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    (function (node) {
                        var $elem = $(node.element);

                        self.addEvent($elem.children("i:first-child"), "click", function (e) {
                            if (node.type == "open") {
                                self.fold(node.index, e);
                            } else {
                                self.open(node.index, e);
                            }

                            e.stopPropagation();
                        });

                        self.addEvent($elem.children("a,span,div")[0], "click", function (e) {
                            if ($elem.hasClass("disabled") || $elem.attr("disabled")) return;

                            self.emit("select", [node, e]); // 차후 제거 요망
                            self.emit("change", [node, e]);
                            e.stopPropagation();
                        });
                    })(nodeList[i]);
                }
            }

            function resetEventDragNodeData(self, onlyStyle) {
                if (!self.options.drag) return;

                var root = self.uit.getRoot();

                if (!onlyStyle) {
                    dragIndex.start = null;
                    dragIndex.end = null;
                    dragIndex.clone = null;
                }

                $(root.element).find("li.hover").removeClass("hover");
            }

            function setEventDragNodes(self, nodeList) {
                if (!self.options.drag) return;

                var root = self.uit.getRoot();

                for (var i = 0; i < nodeList.length; i++) {
                    (function (node) {
                        $(node.element).off("mousedown").off("mouseup");

                        self.addEvent(node.element, "mousedown", function (e) {
                            if (e.target.tagName == "I") return;

                            if (dragIndex.start == null) {
                                if (self.emit("dragstart", [node, e]) !== false) {
                                    dragIndex.start = node.index;

                                    /*/
                                    dragIndex.clone = $(node.element).find(":feq(1)").clone();
                                    dragIndex.clone.css({
                                        position: "absolute",
                                        left: e.offsetX + "px",
                                        top: e.offsetY + "px",
                                        opacity: 0.3
                                    });
                                    $(self.root).append(dragIndex.clone);
                                    /**/
                                }
                            }

                            return false;
                        });

                        self.addEvent(node.element, "mouseup", function (e) {
                            if (e.target.tagName == "I") return;

                            if (self.options.dragChild !== false) {
                                if (dragIndex.start && dragIndex.start != node.index) {
                                    var cNode = node.lastChild(),
                                        endIndex = (cNode) ? iParser.getNextIndex(cNode.index) : node.index + ".0";

                                    // 특정 부모 노드에 추가할 경우
                                    if (self.emit("dragend", [self.get(node.index), e]) !== false) {
                                        self.move(dragIndex.start, endIndex);
                                    }
                                }
                            }

                            resetEventDragNodeData(self);

                            return false;
                        });

                        // 드래그시 마우스 오버 효과
                        self.addEvent(node.element, "mouseover", function (e) {
                            if (e.target.tagName == "I") return;

                            if (self.options.dragChild !== false) {
                                if (dragIndex.start && dragIndex.start != node.index) {
                                    if (self.emit("dragover", [node, e]) !== false) {
                                        resetEventDragNodeData(self, true);
                                        $(node.element).addClass("hover");
                                    }
                                }
                            }

                            return false;
                        });

                        self.addEvent(root.element, "mouseup", function (e) {
                            if (e.target.tagName == "I") return;

                            if (self.options.dragChild !== false) {
                                if (dragIndex.start) {
                                    var endIndex = "" + root.children.length;

                                    self.move(dragIndex.start, endIndex);
                                    self.emit("dragend", [self.get(endIndex), e]);
                                }
                            }

                            resetEventDragNodeData(self);

                            return false;
                        });
                    })(nodeList[i]);
                }

                self.addEvent("body", "mouseup", function (e) {
                    if (dragIndex.start && dragIndex.end) {
                        self.move(dragIndex.start, dragIndex.end);
                        self.emit("dragend", [self.get(dragIndex.end), e]);
                    }

                    resetEventDragNodeData(self);

                    return false;
                });

            }

            function setDragNodes(self) {
                if (!self.options.drag) return;

                $(self.root).find(".drag").remove();
                var nodeList = self.listAll();

                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i],
                        pos = $(node.element).position();

                    if (pos.top > 0) { // top이 0이면, hide된 상태로 간주
                        addDragElement(self, node, pos);
                    }
                }
            }

            function setDragLastNodes(self) {
                if (!self.options.drag) return;
                var nodeList = self.listAll();

                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i],
                        pos = $(node.element).position();

                    if (pos.top > 0 && node.parent) { // top이 0이면, hide된 상태로 간주
                        if (node.parent.lastChild() == node) {
                            pos.top = pos.top + $(node.element).outerHeight();
                            addDragElement(self, node, pos, true);
                        }
                    }
                }
            }

            function addDragElement(self, node, pos, isLast) {
                if (!self.options.drag) return;

                var index = (isLast) ? iParser.getNextIndex(node.index) : node.index;
                var $drag = $("<div class='drag'></div>")
                    .attr("data-index", index)
                    .css(pos)
                    .outerWidth($(node.element).outerWidth());

                $(self.root).append($drag);

                self.addEvent($drag, "mouseover", function (e) {
                    if (dragIndex.start) {
                        dragIndex.end = index;
                        $drag.addClass("on");

                        resetEventDragNodeData(self, true);
                    }
                });

                self.addEvent($drag, "mouseout", function (e) {
                    if (dragIndex.start) {
                        $drag.removeClass("on");
                    }
                });
            }

            function reloadUI(self, isRoot) {
                var nodeList = self.listAll();

                setNodeStatus(self, nodeList);
                setEventNodes(self, nodeList);
                setEventDragNodes(self, nodeList);
                setDragNodes(self); // 차후에 개선
                setDragLastNodes(self);

                if (isRoot) {
                    setNodeStatus(self, [self.uit.getRoot()]);
                    setEventNodes(self, [self.uit.getRoot()]);
                }
            }

            this.init = function () {
                var opts = this.options;

                // UITable 객체 생성
                this.uit = new Base({$obj: {tree: $(this.root)}, $tpl: this.tpl}); // 신규 테이블 클래스 사용

                // 루트 데이터 처리
                if (opts.root) {
                    this.uit.appendNode(opts.root);
                    reloadUI(this, true);
                } else {
                    throw new Error("JUI_CRITICAL_ERROR: root data is required");
                }

                // 루트 숨기기
                if (opts.rootHide) {
                    var root = this.uit.getRoot();

                    $(root.element).css("padding-left", "0px");
                    $(root.element).children("*:not(ul)").hide();
                }

                // 루트 접기
                if (opts.rootFold) {
                    this.fold();
                }
            }

            /**
             * @method update
             * Changes to the node at a specified index.
             *
             * @param {Integer} index
             * @param {Array} data
             */
            this.update = function (index, data) {
                var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
                    index = (arguments.length == 2) ? arguments[0] : null;

                if (index != null) {
                    this.uit.updateNode(index, dataList);
                } else {
                    var iParser = _.index();

                    // 전체 로우 제거
                    this.uit.removeNodes();

                    // 트리 로우 추가
                    for (var i = 0; i < dataList.length; i++) {
                        var pIndex = iParser.getParentIndex(dataList[i].index);

                        if (pIndex == null) {
                            this.uit.appendNode(dataList[i].data);
                        } else {
                            this.uit.appendNode(pIndex, dataList[i].data);
                        }
                    }
                }

                reloadUI(this);
            }

            /**
             * @method append
             * Adds to a child node at a specified index.
             *
             * @param {Array/String} param1 index or data
             * @param {Array} param2 null or data
             */
            this.append = function () {
                var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
                    index = (arguments.length == 2) ? arguments[0] : null;

                dataList = (dataList.length == undefined) ? [dataList] : dataList;

                for (var i = 0; i < dataList.length; i++) {
                    if (index != null) this.uit.appendNode(index, dataList[i]);
                    else this.uit.appendNode(dataList[i]);
                }

                reloadUI(this); // 차후에 개선
            }

            /**
             * @method insert
             * Adds a node at a specified index.
             *
             * @param {String} index
             * @param {Array} data
             */
            this.insert = function (index, data) {
                var dataList = (data.length == undefined) ? [data] : data;

                for (var i = 0; i < dataList.length; i++) {
                    this.uit.insertNode(index, dataList[i]);
                }

                reloadUI(this); // 차후에 개선
            }

            /**
             * @method select
             * Adds a node at a specified index.
             *
             * @param {String} index
             * @return {NodeObject} node
             */
            this.select = function (index) {
                var node = (index == null) ? this.uit.getRoot() : this.get(index);

                $(this.root).find("li").removeClass("active");
                $(node.element).addClass("active");

                nodeIndex = index;
                return node;
            }

            /**
             * @method unselect
             * Removes the 'active' class from a selected node and gets an instance of the specified node.
             */
            this.unselect = function () {
                if (nodeIndex == null) return;
                var node = this.get(nodeIndex);

                $(node.element).removeClass("active");
                nodeIndex = null;

                return node;
            }

            /**
             * @method remove
             * Deletes a node at a specified index.
             *
             * @param {String} index
             */
            this.remove = function (index) {
                this.uit.removeNode(index);
                reloadUI(this); // 차후에 개선
            }

            /**
             * @method reset
             * Deletes all child nodes except for a root.
             */
            this.reset = function () {
                this.uit.removeNodes();
                reloadUI(this); // 차후에 개선
            }

            /**
             * @method move
             * Moves a node at a specified index to the target index.
             *
             * @param {String} index
             * @param {String} targetIndex
             */
            this.move = function (index, targetIndex) {
                this.uit.moveNode(index, targetIndex);
                reloadUI(this); // 차후에 개선
            }

            /**
             * @method open
             * Shows a child node at a specified index.
             *
             * @param {String} index
             */
            this.open = function (index, e) { // 로트 제외, 하위 모든 노드 대상
                if (index == null && this.options.rootHide) return;
                var isRoot = (index == null);

                this.uit.openNode(index);
                reloadUI(this, isRoot); // 차후에 개선

                this.emit("open", [(isRoot) ? this.uit.getRoot() : this.get(index), e]);
            }

            /**
             * @method fold
             * Folds up a child node at a specified index.
             *
             * @param {String} index
             */
            this.fold = function (index, e) {
                if (index == null && this.options.rootHide) return;
                var isRoot = (index == null);

                this.uit.foldNode(index);
                reloadUI(this, isRoot); // 차후에 개선

                this.emit("fold", [(isRoot) ? this.uit.getRoot() : this.get(index), e]);
            }

            /**
             * @method openAll
             * Shows all child nodes at a specified index.
             *
             * @param {String} index
             */
            this.openAll = function (index) { // 로트 포함, 하위 모든 노드 대상
                var self = this,
                    isRoot = (index == null);

                toggleNode(this, index, function (i) {
                    self.uit.openNodeAll(i);
                });

                this.emit("openall", [(isRoot) ? this.uit.getRoot() : this.get(index)]);
            }

            /**
             * @method foldAll
             * Folds up all child nodes at a specified index.
             *
             * @param {String} index
             */
            this.foldAll = function (index) {
                var self = this,
                    isRoot = (index == null);

                toggleNode(this, index, function (i) {
                    self.uit.foldNodeAll(i);
                });

                this.emit("foldall", [(isRoot) ? this.uit.getRoot() : this.get(index)]);
            }

            /**
             * @method list
             * Return all nodes of the root.
             *
             * @return {Array} nodes
             */
            this.list = function () {
                return this.uit.getNode();
            }

            /**
             * @method listAll
             * Returns all child nodes.
             *
             * @return {Array} nodes
             */
            this.listAll = function () {
                return this.uit.getNodeAll();
            }

            /**
             * @method listParent
             * Returns all parent nodes at a specified index.
             *
             * @param {String} index
             * @return {Array} nodes
             */
            this.listParents = function (index) {
                var node = this.get(index),
                    parents = [];

                if (node.parent) {
                    addParent(node.parent);
                }

                function addParent(node) {
                    if (node.index != null) {
                        parents.push(node);

                        if (node.parent != null) {
                            addParent(node.parent);
                        }
                    }
                }

                return parents.reverse();
            }

            /**
             * @method get
             * Gets a node at a specified index
             *
             * @param {String} index
             * @return {NodeObject} node
             */
            this.get = function (index) {
                if (index == null) return null;
                return this.uit.getNode(index);
            }

            /**
             * @method getAll
             * Gets all nodes at a specified index including child nodes.
             *
             * @param {String} index
             * @return {Array} nodes
             */
            this.getAll = function (index) {
                if (index == null) return null;
                return this.uit.getNodeAll(index);
            }

            /**
             * @method activeIndex
             * Gets the index of a node that is activated in an active state.
             *
             * @return {Integer} index
             */
            this.activeIndex = function () {
                return nodeIndex;
            }
        }

        UI.setup = function () {
            return {
                /**
                 * @cfg {NodeObject} [root=null]
                 * Adds a root node (required).
                 */
                root: null,

                /**
                 * @cfg {Boolean} [rootHide=false]
                 * Hides a root node.
                 */
                rootHide: false,

                /**
                 * @cfg {Boolean} [rootFold=false]
                 * Folds up a root node.
                 */
                rootFold: false,

                /**
                 * @cfg {Boolean} [drag=false]
                 * It is possible to drag the movement of a node.
                 */
                drag: false,

                /**
                 * @cfg {Boolean} [dragChild=true]
                 * It is possible to drag the node movement but the node is not changed to a child node of the target node.
                 */
                dragChild: true
            }
        }

        /**
         * @event select
         * Event that occurs when a node is selected
         *
         * @param {NodeObject) node
         * @param {EventObject} e The event object
         */

        /**
         * @event open
         * Event that occurs when a node is shown
         *
         * @param {NodeObject) node
         * @param {EventObject} e The event object
         */

        /**
         * @event fold
         * Event that occurs when a node is hidden
         *
         * @param {NodeObject) node
         * @param {EventObject} e The event object
         */

        /**
         * @event dragstart
         * Event that occurs when a node starts to move
         *
         * @param {Integer) index Node's index
         * @param {EventObject} e The event object
         */

        /**
         * @event dragend
         * Event that occurs when the movement of a node is completed
         *
         * @param {Integer) index Node's index
         * @param {EventObject} e The event object
         */

        return UI;
    }
}