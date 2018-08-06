import $ from "jquery"

export default {
    name: "ui.tree.node",
    component: function () {
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
    }
}