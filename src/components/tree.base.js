import $ from "jquery"
import jui from "juijs"
import NodeMod from "./tree.node.js"

jui.use(NodeMod);

export default {
    name: "ui.tree.base",
    component: function () {
        var _ = jui.include("util.base");
        var Node = jui.include("ui.tree.node");

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
    }
}
