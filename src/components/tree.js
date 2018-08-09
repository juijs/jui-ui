import $ from "jquery"
import jui from "../main.js"

jui.define("ui.tree.node", [], function() {
    var Node = function(data, tplFunc) {
        var self = this;

        /** @property {Array} [data=null] Data of a specifiednode */
        this.data = data;

        /** @property {HTMLElement} [element=null] LI element of a specified node */
        this.element = null;

        /** @property {Integer} [index=null] Index of a specified node */
        this.index = null;

        /** @property {Integer} [nodenum=null] Unique number of a specifiede node at the current depth */
        this.nodenum = null;

        /** @property {ui.tree.node} [parent=null] Variable that refers to the parent of the current node */
        this.parent = null;

        /** @property {Array} [children=null] List of child nodes of a specified node */
        this.children = [];

        /** @property {Integer} [depth=0] Depth of a specified node */
        this.depth = 0;

        /** @property {String} [type='open'] State value that indicates whether a child node is shown or hidden */
        this.type = "open";

        function setIndex(nodenum) {
            self.nodenum = (!isNaN(nodenum)) ? nodenum : self.nodenum;

            if(self.parent) {
                if(self.parent.index == null) self.index = "" + self.nodenum;
                else self.index = self.parent.index + "." + self.nodenum;
            }

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length;
            }

            // 자식 인덱스 체크
            if(self.children.length > 0) {
                setIndexChild(self);
            }
        }

        function setIndexChild(node) {
            var clist = node.children;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(clist[i].children.length > 0) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function getElement() {
            if(!tplFunc) return self.element;

            try {
                var element = $(tplFunc(
                    $.extend({ node: { index: self.index, data: self.data, depth: self.depth } }, self.data))
                ).get(0);
            } catch(e) {
                console.log(e);
            }

            return element;
        }

        function removeChildAll(node) {
            $(node.element).remove();

            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];

                if(cNode.children.length > 0) {
                    removeChildAll(cNode);
                } else {
                    $(cNode.element).remove();
                }
            }
        }

        function reloadChildAll(node) {
            for(var i = 0; i < node.children.length; i++) {
                var cNode = node.children[i];
                cNode.reload(i);

                if(cNode.children.length > 0) {
                    reloadChildAll(cNode);
                }
            }
        }

        this.reload = function(nodenum, isUpdate) {
            setIndex(nodenum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement();

                if(!isUpdate) {
                    $(this.parent.element).children("ul").append(newElem);
                } else {
                    $(newElem).insertAfter(this.element);
                }

                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }
        }


        this.reloadChildrens = function() {
            reloadChildAll(this);
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.children.length == 0) ? true : false;
        }

        this.fold = function() {
            $(this.element).children("ul").hide();
            this.type = "fold";
        }

        this.open = function() {
            $(this.element).children("ul").show();
            this.type = "open";
        }

        this.appendChild = function(node) {
            $(this.element).children("ul").append(node.element);
            this.children.push(node);
        }

        this.insertChild = function(nodenum, node) {
            if(nodenum == 0) {
                if(this.children.length == 0) {
                    $(this.element).children("ul").append(node.element);
                } else {
                    $(node.element).insertBefore(this.children[0].element);
                }
            } else {
                $(node.element).insertAfter(this.children[nodenum - 1].element);
            }

            var preNodes = this.children.splice(0, nodenum);
            preNodes.push(node);

            this.children = preNodes.concat(this.children);
            reloadChildAll(this);
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.children.length; i++) {
                var node = this.children[i];

                if(node.index == index) {
                    this.children.splice(i, 1); // 배열에서 제거
                    removeChildAll(node);
                }
            }

            reloadChildAll(this);
        }

        this.lastChild = function() {
            if(this.children.length > 0)
                return this.children[this.children.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }
    }

    return Node;
});

jui.define("ui.tree.base", [ "util.base", "ui.tree.node" ], function(_, Node) {
    var Base = function(handler) {
        var self = this, root = null;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var iParser = _.index();


        function createNode(data, no, pNode) {
            var node = new Node(data, $tpl.node);

            node.parent = (pNode) ? pNode : null;
            node.reload(no);

            return node;
        }

        function setNodeChildAll(dataList, node) {
            var c_nodes = node.children;

            if(c_nodes.length > 0) {
                for(var i = 0; i < c_nodes.length; i++) {
                    dataList.push(c_nodes[i]);

                    if(c_nodes[i].children.length > 0) {
                        setNodeChildAll(dataList, c_nodes[i]);
                    }
                }
            }
        }

        function getNodeChildLeaf(keys, node) {
            if(!node) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return node;
            } else {
                return getNodeChildLeaf(keys, node.children[tmpKey]);
            }
        }

        function insertNodeDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pNode = self.getNodeParent(index),
                nodenum = keys[keys.length - 1],
                node = createNode(data, nodenum, pNode);

            // 데이터 갱신
            pNode.insertChild(nodenum, node);

            return node;
        }

        function appendNodeData(data) {
            if(root == null) {
                root = createNode(data);;
                $obj.tree.append(root.element);
            } else {
                var node = createNode(data, root.children.length, root);
                root.appendChild(node);
            }

            return node;
        }

        function appendNodeDataChild(index, data) {
            var pNode = self.getNode(index),
                cNode = createNode(data, pNode.children.length, pNode);

            pNode.appendChild(cNode);

            return cNode;
        }

        function isRelative(node, targetNode) {
            var nodeList = [];

            while(true) {
                var tNode = targetNode.parent;

                if(tNode) {
                    nodeList.push(tNode);
                    targetNode = tNode;
                } else {
                    break;
                }
            }

            for(var i = 0; i < nodeList.length; i++) {
                if(node == nodeList[i]) {
                    return true;
                }
            }

            return false;
        }


        this.appendNode = function() {
            var index = arguments[0], data = arguments[1];

            if(!data) {
                return appendNodeData(index);
            } else {
                return appendNodeDataChild(index, data);
            }
        }

        this.insertNode = function(index, data) {
            if(root.children.length == 0 && parseInt(index) == 0) {
                return this.appendNode(data);
            } else {
                return insertNodeDataChild(index, data);
            }
        }

        this.updateNode = function(index, data) {
            var node = this.getNode(index);

            for(var key in data) {
                node.data[key] = data[key];
            }

            node.reload(node.nodenum, true);
            node.reloadChildrens();

            return node;
        }

        this.removeNode = function(index) {
            this.getNode(index).destroy();
        }

        this.removeNodes = function() {
            var nodes = root.children;

            if(nodes.length > 0) {
                var node = nodes.pop();

                node.parent = null;
                node.destroy();

                this.removeNodes();
            }
        }

        this.openNode = function(index) {
            if(index == null) this.getRoot().open();
            else this.getNode(index).open();
        }

        this.foldNode = function(index) {
            if(index == null) this.getRoot().fold();
            else this.getNode(index).fold();
        }

        this.openNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].open();
            }

            if(index == null) this.getRoot().open();
        }

        this.foldNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].fold();
            }

            if(index == null) this.getRoot().fold();
        }

        function isFamily(index, targetIndex) {
            var parentIndex = iParser.getParentIndex(targetIndex);

            if(parentIndex == null) {
                return false;
            }

            if(index == parentIndex) {
                return true;
            }

            return isFamily(index, parentIndex);
        }

        this.moveNode = function(index, targetIndex) {
            if(index == targetIndex) return;
            if(isFamily(index, targetIndex)) return;

            var node = this.getNode(index),
                tpNode = this.getNodeParent(targetIndex);

            var indexList = iParser.getIndexList(targetIndex),
                tNo = indexList[indexList.length - 1];

            if(!isRelative(node, tpNode)) {
                // 기존의 데이터
                node.parent.children.splice(node.nodenum, 1);
                node.parent.reloadChildrens();
                node.parent = tpNode;

                // 이동 대상 데이터 처리
                var preNodes = tpNode.children.splice(0, tNo);
                preNodes.push(node);

                tpNode.children = preNodes.concat(tpNode.children);
                tpNode.reloadChildrens();
            }
        }

        this.getNode = function(index) {
            if(index == null) return root.children;
            else {
                var nodes = root.children;

                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getNodeChildLeaf(keys, nodes[keys.shift()]);
                } else {
                    return (nodes[index]) ? nodes[index] : null;
                }
            }
        }

        this.getNodeAll = function(index) {
            var dataList = [],
                tmpNodes = (index == null) ? root.children : [ this.getNode(index) ];

            for(var i = 0; i < tmpNodes.length; i++) {
                if(tmpNodes[i]) {
                    dataList.push(tmpNodes[i]);

                    if(tmpNodes[i].children.length > 0) {
                        setNodeChildAll(dataList, tmpNodes[i]);
                    }
                }
            }

            return dataList;
        }

        this.getNodeParent = function(index) { // 해당 인덱스의 부모 노드를 가져옴 (단, 해당 인덱스의 노드가 없을 경우)
            var keys = iParser.getIndexList(index);

            if(keys.length == 1) {
                return root;
            } else if(keys.length == 2) {
                return this.getNode(keys[0]);
            } else if(keys.length > 2) {
                keys.pop();
                return this.getNode(keys.join("."));
            }
        }

        this.getRoot = function() {
            return root;
        }
    }

    return Base;
});

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