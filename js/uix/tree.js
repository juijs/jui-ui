jui.define('uix.tree', [ 'util' ], function(_) {
	
	/**
	 * UI Core Class
	 * 
	 */
	var UINode = function(data, tplFunc) {
		var self = this;
		
		/**
		 * Public Properties
		 * 
		 */
		this.data = data;			// 해당 노드의 데이터
		this.element = null;		// 해당 노드의 엘리먼트
		this.index = null;			// 계층적 구조를 수용할 수 있는 키값
		this.nodenum = null;		// 현재 뎁스에서의 인덱스 키값
		
		this.parent = null;			// 부모 노드
		this.childrens = [];		// 자식 노드들
		this.depth = 0;				// 해당 노드의 뎁스
		
		this.type = "open";
		
		/**
		 * Private Methods
		 * 
		 */
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
			if(self.childrens.length > 0) {
				setIndexChild(self);
			}
		}
		
		function setIndexChild(node) {
			var clist = node.childrens;
			
			for(var i = 0; i < clist.length; i++) {
				clist[i].reload(i);
				
				if(clist[i].childrens.length > 0) { 
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
			
			for(var i = 0; i < node.childrens.length; i++) {
				var cNode = node.childrens[i];
				
				if(cNode.childrens.length > 0) {
					removeChildAll(cNode);
				} else {
					$(cNode.element).remove();
				}
			}
		}

		function reloadChildAll(node) {
			for(var i = 0; i < node.childrens.length; i++) {
				var cNode = node.childrens[i];
				cNode.reload(i);
				
				if(cNode.childrens.length > 0) {
					reloadChildAll(cNode);
				}
			}
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
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
			return (this.childrens.length == 0) ? true : false;
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
			this.childrens.push(node);
		}

		this.insertChild = function(nodenum, node) {
			if(nodenum == 0) {
				if(this.childrens.length == 0) {
					$(this.element).children("ul").append(node.element);
				} else {
					$(node.element).insertBefore(this.childrens[0].element);
				}
			} else {
				$(node.element).insertAfter(this.childrens[nodenum - 1].element);
			}
			
			var preNodes = this.childrens.splice(0, nodenum);
			preNodes.push(node);
			
			this.childrens = preNodes.concat(this.childrens);
			reloadChildAll(this);
		}
		
		this.removeChild = function(index) {
			for(var i = 0; i < this.childrens.length; i++) {
				var node = this.childrens[i];
				
				if(node.index == index) {
					this.childrens.splice(i, 1); // 배열에서 제거
					removeChildAll(node);
				}
			}
			
			reloadChildAll(this);
		}

		this.lastChild = function() {
			if(this.childrens.length > 0)
				return this.childrens[this.childrens.length - 1];
				
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
	
	var UITree = function(handler) {
		var self = this, root = null;
		
		var $obj = handler.$obj,
			$tpl = handler.$tpl;
		
		var iParser = _.index();
		
		/**
		 * Private Methods
		 * 
		 */
		function createNode(data, no, pNode) {
			var node = new UINode(data, $tpl.node);
			
			node.parent = (pNode) ? pNode : null;
			node.reload(no);
			
			return node;
		}
		
		function setNodeChildAll(dataList, node) {
			var c_nodes = node.childrens;
			
			if(c_nodes.length > 0) {
				for(var i = 0; i < c_nodes.length; i++) {
					dataList.push(c_nodes[i]);
					
					if(c_nodes[i].childrens.length > 0) {
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
				return getNodeChildLeaf(keys, node.childrens[tmpKey]);
			}
		}
		
		function insertNodeDataChild(index, data) {
			var keys = iParser.getIndexList(index);
			
			var pNode = self.getNodeParent(index),
				nodenum = keys[keys.length - 1];
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
				var node = createNode(data, root.childrens.length, root);
				root.appendChild(node);
			}
			
			return node;
		}
		
		function appendNodeDataChild(index, data) {
			var pNode = self.getNode(index), 
				cNode = createNode(data, pNode.childrens.length, pNode);
				
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
		
		
		/**
		 * Public Methods
		 * 
		 */
		this.appendNode = function() {
			var index = arguments[0], data = arguments[1];
			
			if(!data) {
				return appendNodeData(index);
			} else {
				return appendNodeDataChild(index, data);
			}
		}
		
		this.insertNode = function(index, data) {
			if(root.childrens.length == 0 && parseInt(index) == 0) {
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
			var nodes = root.childrens;
			
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
		
		this.moveNode = function(index, targetIndex) {
			if(index == targetIndex) return;
			
			var node = this.getNode(index), 
				tpNode = this.getNodeParent(targetIndex);
			var indexList = iParser.getIndexList(targetIndex);
				tNo = indexList[indexList.length - 1];
				
			if(!isRelative(node, tpNode)) {
				// 기존의 데이터 
				node.parent.childrens.splice(node.nodenum, 1);
				node.parent.reloadChildrens();
				node.parent = tpNode;
				
				// 이동 대상 데이터 처리
				var preNodes = tpNode.childrens.splice(0, tNo);
				preNodes.push(node);
				
				tpNode.childrens = preNodes.concat(tpNode.childrens);
				tpNode.reloadChildrens();
			}
		}
		
		this.getNode = function(index) {
			if(index == null) return root.childrens;
			else {
				var nodes = root.childrens;
				
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
				tmpNodes = (index == null) ? root.childrens : [ this.getNode(index) ];
			
			for(var i = 0; i < tmpNodes.length; i++) {
				if(tmpNodes[i]) {
					dataList.push(tmpNodes[i]);
					
					if(tmpNodes[i].childrens.length > 0) {
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
	
	
	/**
	 * UI Main Class
	 * 
	 */
	var UI = function() {
		var $obj = null;
		var dragIndex = { start: null, end: null }, 
			iParser = _.index();
		
		/**
		 * Private Methods
		 * 
		 */
		function setNodeStatus(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i];
				$(node.element).removeClass("open fold leaf last");
				
				if(node.parent && node.isLeaf()) {
					$(node.element).addClass("leaf");
				} else {
					if(node.type == "open") {
						$(node.element).addClass("open");
						node.open();
					} else {
						$(node.element).addClass("fold");
						node.fold();
					}
				}
				
				if(!node.parent) {
					$(node.element).addClass("root");
				} else {
					if(node.parent.lastChild() == node) {
						$(node.element).addClass("last");
					}
				}
				
				$(node.element).children("i:first-child").remove();
				$(node.element).prepend($("<i></i>"));
			}
		}
		
		function toggleNode(self, index, callback) {
			if(index == null) {
				if(self.options.rootHide) {
					var childs = self.uit.getRoot().childrens;
					
					for(var i = 0; i < childs.length; i++) {
						callback(childs[i].index);
					}
					
					reloadUI(self,  false);
				} else {
					callback(index);
					reloadUI(self,  true);
				}
			} else {
				callback(index);
				reloadUI(self,  false);
			}
		}
		
		function setEventNodes(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					var $elem = $(node.element);
					
					self.addEvent($elem.children("i:first-child"), "click", function(e) {
						if(node.type == "open") {
							self.fold(node.index, e);
						} else {
							self.open(node.index, e);
						}
						
						e.stopPropagation();
					});
					
					self.addEvent($elem.children("a,span,div")[0], "click", function(e) {
						self.emit("select", [ node, e ]);
						e.stopPropagation();
					});
				})(nodeList[i]);
			}
		}
		
		function setEventDragNodes(self, nodeList) {
			if(!self.options.drag) return;
			
			var root = self.uit.getRoot();
			$("body").unbind("mousemove").unbind("mouseup");

			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					$(node.element).unbind("mousedown").unbind("mouseup");
					
					self.addEvent(node.element, "mousedown", function(e) {
						if(e.target.tagName == "I") return;
						
						if(dragIndex.start == null) {
							dragIndex.start = node.index;
						}
						
						return false;
					});

					self.addEvent(node.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;
						
						if(self.options.dragChild !== false) {
							if(dragIndex.start && dragIndex.start != node.index) {
								var cNode = node.lastChild(),
									endIndex = (cNode) ? iParser.getNextIndex(cNode.index) : node.index + ".0";
								
								self.move(dragIndex.start, endIndex);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});

					self.addEvent(root.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;

						if(self.options.dragChild !== false) {
							if(dragIndex.start) {
								self.move(dragIndex.start, ("" + root.childrens.length));
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});
				})(nodeList[i]);
			}
			
			self.addEvent("body", "mouseup", function(e) {
				if(dragIndex.start && dragIndex.end) {
					self.move(dragIndex.start, dragIndex.end);
				}
				
				dragIndex.start = null;
				dragIndex.end = null;
				
				return false;
			});
		}
		
		function setDragNodes(self) {
			if(!self.options.drag) return;
			
			$(self.root).find(".drag").remove();
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
					pos = $(node.element).position();
				
				if(pos.top > 0) { // top이 0이면, hide된 상태로 간주
					addDragElement(self, node, pos);
				}
			}
		}

		function setDragLastNodes(self) {
			if(!self.options.drag) return;
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
				pos = $(node.element).position();
				
				if(pos.top > 0 && node.parent) { // top이 0이면, hide된 상태로 간주
					if(node.parent.lastChild() == node) {
						pos.top = pos.top + $(node.element).outerHeight();
						addDragElement(self, node, pos, true);
					}
				}
			}
		}
		
		function addDragElement(self, node, pos, isLast) {
			if(!self.options.drag) return;
			
			var index = (isLast) ? iParser.getNextIndex(node.index) : node.index;
			var $drag = $("<div class='drag'></div>")
				.attr("data-index", index)
				.css(pos)
				.outerWidth($(node.element).outerWidth());

			$(self.root).append($drag);
			
			self.addEvent($drag, "mouseover", function(e) {
				if(dragIndex.start) {
					dragIndex.end = index;
					$drag.addClass("on");
				}
			});

			self.addEvent($drag, "mouseout", function(e) {
				if(dragIndex.start) {
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
			
			if(isRoot) {
				setNodeStatus(self, [ self.uit.getRoot() ]);
				setEventNodes(self, [ self.uit.getRoot() ]);
			}
		}
		
		
		/**
		 * Public Methods & Options
		 *
		 */
		this.setting = function() {
			return {
				options: {
					root: null,
					rootHide: false,
					rootFold: false,
					drag: false,
					dragChild: true
				},
				valid: {
					update: [ "string", "object" ],
					append: [ [ "string", "object", "array" ], [ "object", "array" ] ],
					insert: [ "string", [ "object", "array" ] ],
					select: [ "string" ],
					remove: [ "string" ],
					move: [ "string", "string" ],
					open: [ [ "string", "null" ], [ "object", "undefined" ] ],
					fold: [ [ "string", "null" ], [ "object", "undefined" ] ],
					openAll: [ "string" ],
					foldAll: [ "string" ],
					listParents: [ "string" ],
					get: [ "string" ],
					getAll: [ "string" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// UITable 객체 생성
			this.uit = new UITree({ $obj: { tree: $(this.root) }, $tpl: this.tpl }); // 신규 테이블 클래스 사용
			
			// 루트 데이터 처리
			if(opts.root) {
				this.uit.appendNode(opts.root);
				reloadUI(this, true);
			} else {
				throw new Error("JUI_CRITICAL_ERROR: root data is required");
			}
			
			// 루트 숨기기
			if(opts.rootHide) {
				var root = this.uit.getRoot();
				
				$(root.element).css("padding-left", "0px");
				$(root.element).children("*:not(ul)").hide();
			}
			
			// 루트 접기
			if(opts.rootFold) {
				this.fold();
			}
			
			return this;
		}
		
		this.update = function(index, data) {
			this.uit.updateNode(index, data);
			reloadUI(this);
		}
		
		this.append = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
				
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				if(index != null) this.uit.appendNode(index, dataList[i]);
				else this.uit.appendNode(dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.insert = function(index, data) {
			var dataList = (data.length == undefined) ? [ data ] : data;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertNode(index, dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.select = function(index) {
			var node = (index == null) ? this.uit.getRoot() : this.get(index);
			
			$(this.root).find("li").removeClass("active");
			$(node.element).addClass("active");
			
			return node;
		}
		
		this.remove = function(index) {
			this.uit.removeNode(index);
			reloadUI(this); // 차후에 개선
		}
		
		this.reset = function() {
			this.uit.removeNodes();
			reloadUI(this); // 차후에 개선
		}
		
		this.move = function(index, targetIndex) {
			this.uit.moveNode(index, targetIndex);
			reloadUI(this); // 차후에 개선
		}
		
		this.open = function(index, e) { // 로트 제외, 하위 모든 노드 대상
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);
			
			this.uit.openNode(index);
			reloadUI(this, isRoot); // 차후에 개선

			this.emit("open", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.fold = function(index, e) {
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);

			this.uit.foldNode(index);
			reloadUI(this, isRoot); // 차후에 개선
			
			this.emit("fold", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.openAll = function(index) { // 로트 포함, 하위 모든 노드 대상
			var self = this,
				isRoot = (index == null);
			
			toggleNode(this, index, function(i) {
				self.uit.openNodeAll(i);
			});

			this.emit("openall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}

		this.foldAll = function(index) {
			var self = this,
				isRoot = (index == null);

			toggleNode(this, index, function(i) {
				self.uit.foldNodeAll(i);
			});

			this.emit("foldall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}
		
		this.list = function() {
			return this.uit.getNode();
		}

		this.listAll = function() {
			return this.uit.getNodeAll();
		}
		
		this.listParents = function(index) {
			var node = this.get(index),
				parents = [];
			
			if(node.parent) {
				addParent(node.parent);
			}
			
			function addParent(node) {
				if(node.index != null) {
					parents.push(node);
					
					if(node.parent != null) {
						addParent(node.parent);
					}
				}
			}
			
			return parents.reverse();
		}

		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getNode(index);
		}

		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getNodeAll(index);
		}
	}
	
	return UI;
});