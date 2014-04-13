jui.define('uix.xtable', [ 'util', 'ui.modal' ], function(_, modal) {
	
	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("xtable");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var head = null, body = null;
		var rows = [], o_rows = null;
		var page = 1, p_type = null;
		var ui_modal = null, is_loading = false;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTableList(self) { // 2
			var exceptOpts = [ "buffer", "bufferCount", "csvCount", "sortLoading", "sortCache", "sortIndex", "sortOrder", "event", "rows" ];
			
			body = jui.create("table", $(self.root).children("table"), getExceptOptions(self, exceptOpts.concat("resize"))); // 바디 테이블 생성
			setTableBodyStyle(self, body); // X-Table 생성 및 마크업 설정
			
			head = jui.create("table", $(self.root).children("table.head"), getExceptOptions(self, exceptOpts)); // 헤더 테이블 생성
			setTableAllStyle(self, head, body);
			
			// 테이블 옵션 필터링 함수
			function getExceptOptions(self, exceptOpts) {
				var options = {};
				
				for(var key in self.options) {
					if($.inArray(key, exceptOpts) == -1) {
						options[key] = self.options[key];
					}
				}
				
				return options;
			}
			
			function setTableAllStyle(self, head, body) {
				$(self.root).css({ "position": "relative" });

				$(head.root).css({ 
					"position": "absolute",
					"top": "0",
					"border-bottom-width": "0",
					"margin": "0"
				});
				
				$(body.root).css({ 
					"margin": "0"
				});
			}
			
			function setTableBodyStyle(self, body) {
				var $table =  $(body.root).clone(),
					cols = body.listColumn();
				
				// X-Table 바디 영역 스크롤 높이 설정
				if(self.options.buffer != "page") 
					$(body.root).wrap("<div class='body' style='max-height: " + self.options.scrollHeight + "px'></div>");
				else
					$(body.root).wrap("<div class='body'></div>");
				
				// X-Table 헤더 영역 설정
				for(var i = 0; i < cols.length; i++) {
					var $elem = $(cols[i].element);
					
					$elem.html("").outerHeight(0).attr("style",
							$elem.attr("style") + 
							"border-top-width: 0px !important;" +
							"border-bottom-width: 0px !important;" + 
							"padding-top: 0px !important;" + 
							"padding-bottom: 0px !important"
					);
				}
				
				// 바디 테이블의 tbody 영역 제거
				$table.children("tbody").remove();
				
				// 헤더와 바디 테이블 중간의 간격 정의 (스크롤 관련)
				$(self.root).append($table.addClass("head"));
				$(self.root).prepend($("<div></div>").outerHeight($table.height()));
			}
		}
		
		function setCustomEvent(self) {
			head.on("colresize", function(column, e) { // 컬럼 리사이징 관련
				var cols = head.listColumn(),
					bodyCols = body.listColumn(),
					isLast = false;
				
				for(var j = cols.length - 1; j >= 0; j--) {
					var hw = $(cols[j].element).outerWidth();
					
					// 조건 (스크롤, 컬럼보이기, 마지막컬럼)
					// 조건이 명확하지 않으니 차후에 변경
					if(self.options.buffer != "page" && cols[j].type == "show" && !isLast) {
						$(bodyCols[j].element).outerWidth("auto");
						isLast = true;
					} else {
						$(cols[j].element).outerWidth(hw);
						$(bodyCols[j].element).outerWidth(hw);
					}
				}
				
				self.emit("colresize", [ column, e ]);
			});
			
			head.on("colshow", function(column, e) {
				body.uit.showColumn(column.index);
				self.resize();
				self.emit("colshow", [ column, e ]);
			});
			
			head.on("colhide", function(column, e) {
				body.uit.hideColumn(column.index);
				self.resize();
				self.emit("colhide", [ column, e ]);
			});
			
			head.on("colmenu", function(column, e) {
				self.emit("colmenu", [ column, e ]);
			});
			
			head.on("sort", function(column, e) {
				self.sort(column.index, column.order, e);
				self.emit("sort", [ column, e ]);
				
				// 소팅 후, 현재 소팅 상태 캐싱 처리 
				if(self.options.sortCache) { 
					self.setOption({ sortIndex: column.index, sortOrder: column.order });
				}
			});
			
			body.on("select", function(obj, e) {
				self.emit("select", [ obj, e ]);
			});
			
			body.on("rowmenu", function(obj, e) {
				self.emit("rowmenu", [ obj, e ]);
			});
			
			body.on("expand", function(obj, e) {
				self.emit("expand", [ obj, e ]);
			});

			body.on("expandend", function(obj, e) {
				self.emit("expandend", [ obj, e ]);
			});
		}
		
		function setScrollEvent(self) {
			var $body = $(self.root).children(".body");
			
			$body.unbind("scroll").scroll(function(e) {
			    if((this.scrollTop + self.options.scrollHeight) >= $body.get(0).scrollHeight) {
		    		self.next();
			    	self.emit("scroll", e);
			    	
			    	return false;
			    }
			});
		}
		
		function setFilteredData(self, name, callback) {
			if(o_rows == null) o_rows = rows;
			else rows = o_rows;
			
			var t_rows = rows.slice(),
				s_rows = [];
				
			for(var i = 0, len = t_rows.length; i < len; i++) {
				if(callback(t_rows[i][name])) {
					s_rows.push(t_rows[i]);
				}
			}
			
			self.update(s_rows);
			self.emit("filter", [ s_rows ]);
		}
		
		function resetFilteredData(self) {
			if(o_rows != null) {
				self.update(o_rows);
				
				o_rows = null;
			}
		}
		
		function setColumnWidthAuto(self) {
			var columns = head.listColumn();
			
			for(var i = 0; i < columns.length; i++) {
				if(columns[i].width == null) {
					$(columns[i].element).outerWidth("auto");
				}
			}
		}
		

		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			var MAX = 2500, DELAY = 70;
			
			function animateUpdate(self, rows, style) {
				var ms = MAX - 1;
				
				for(var i = 0; i < rows.length; i++) {
					ms = (ms < MAX) ? (i + 1) * DELAY : MAX;
					
					$(rows[i].element).addClass(style)
					.css({
						"animation-duration":  ms + "ms"
					});
					
					(function(index) {
						self.addEvent(rows[index].element, 'AnimationEnd', function() {
							$(rows[index].element).removeClass(style);
						});
					})(i);
				}
			}
			
			return {
				options: {
					fields: null,
					csv: null,
					csvNames: null,
					csvCount: 10000,
					rows: [],
					colshow: false,
					expand: false,
					resize: false, 
					scrollHeight: 200, // xtable 전용 옵션
					buffer: "scroll",
					bufferCount: 100,
					sort: false,
					sortLoading: false,
					sortCache: false,
					sortIndex: null,
					sortOrder: "asc",
					animate: false
				},
				valid: {
					select: [ [ "integer", "string" ] ],
					update: [ "array" ],
					page: [ "integer" ],
					sort: [ [ "integer", "string" ], [ "string", "undefined" ], [ "object", "undefined" ], [ "boolean", "undefined" ] ],
					filter: [ [ "integer", "string" ], [ "integer", "string", "boolean" ], "function" ],
					height: [ "integer" ],
					getColumn: [ [ "integer", "string" ] ],
					getData: [ [ "integer", "string" ] ],
					showColumn: [ [ "integer", "string" ] ],
					hideColumn: [ [ "integer", "string" ] ],
					initColumns: [ "array" ],
					columnMenu: [ "integer" ],
					showExpand: [ [ "integer", "string" ], "object" ],
					hideExpand: [ [ "integer", "string" ] ],
					showLoading: [ "integer" ],
					setCsv: [ "string" ],
					setCsvFile: [ "object" ],
					rowFunc: [ "string", [ "integer", "string" ], "function" ]
				},
				animate: {
					update: {
						after: function() {
							if(!_.browser.webkit && !_.browser.mozilla) return;
							animateUpdate(this, this.list(), "fadeInLeft");
						}
					},
					page: {
						after: function() {
							animateUpdate(this, this.list(), (p_type == "next") ? "fadeInLeft" : "fadeInRight");
						}
					},
					reset: {
						before: function() {
							var rows = this.list(),
								m = 2000,
								d = ((m / rows.length) < 50) ? 50 : (m / rows.length);
							
							for(var i = 0; i < rows.length; i++) {
								m -= d;
								
								$(rows[i].element).addClass("fadeOutRight")
								.css({
									"animation-duration":  ((m > 0) ? m : 50) + "ms",
									"animation-fill-mode": "both"
								});
							}
						},
						delay: 1000
					},
					filter: {
						after: function() {
							animateUpdate(this, this.list(), "flipInX");
						}
					}
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 기본 설정
			createTableList(this);
			setCustomEvent(this);
			
			// 스크롤/페이지-스크롤 옵션
			if(opts.buffer != "page") {
				var $body = $(this.root).children(".body");

				$body.css({
					"overflow-y": "scroll",
					"overflow-x": "hidden"
				});
				
				$body.children("table").css({
					"border-bottom-width": "0"
				});
			}
			
			// 스크롤 버퍼 이벤트
			if(opts.buffer == "scroll") {
				setScrollEvent(this);
			}
			
			// 데이터가 있을 경우
			if(opts.rows) {
				this.update(opts.rows);
			}
			
			// 로딩 템플릿 체크 (opts.sortLoading으로 체크하지 않음)
			if(opts.tpl.loading) {
				var $loading = $(opts.tpl.loading);
				$(this.root).append($loading);
				
				ui_modal = modal($loading, { 
					target: this.selector,
					opacity: 0.1,
					autoHide: false 
				});
				
				// 기본 로딩 시간 (ms)
				opts.sortLoading = (opts.sortLoading === true) ? 500 : opts.sortLoading; 
			}
			
			return this;
		}
		
		this.select = function(index) {
			return body.select(index);
		}
		
		this.update = function(dataList) {
			rows = dataList;
			
			this.clear();
			this.next();
			this.emit("update");
			head.emit("colresize");
			
			// 정렬 인덱스가 옵션에 있을 경우, 해당 인덱스의 컬럼 정렬 (not loading)
			if(this.options.sortIndex) {
				this.sort(this.options.sortIndex, this.options.sortOrder, undefined, true);
			}
		}
		
		this.next = function() {
			var start = (page - 1) * this.options.bufferCount,
				end = start + this.options.bufferCount;
			
			// 마지막 페이지 처리
			end = (end > rows.length) ? rows.length : end;
			
			if(end <= rows.length) { 
				var tmpDataList = [];
				for(var i = start; i < end; i++) {
					tmpDataList.push(rows[i]);
				}
				
				body.append(tmpDataList);
				this.emit("next", [ page ]);

				if(tmpDataList.length > 0) page++;
			}
		}
		
		this.page = function(pNo) {
			if(this.options.buffer == "scroll") return false;
			if(this.getPage() == pNo) return false;
			
			p_type = (page > pNo) ? "prev" : "next";
			this.clear();
			
			page = (pNo < 1) ? 1 : pNo;
			this.next();
		}
		
		this.sort = function(index, order, e, isNotLoading) { // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort) return;
			
			var self = this, 
				column = head.getColumn(index);
			
			if(typeof(column.name) == "string") {			
				column.order = (order) ? order : (column.order == "asc") ? "desc" : "asc";
				head.uit.setColumn(index, column);
	
				if(this.options.sortLoading && !isNotLoading) {
					self.showLoading();
					
					setTimeout(function() {
						process();
					}, this.options.sortLoading);
				} else {
					process();
				}
			}
			
			// 정렬 프로세싱 함수
			function process() {
				var qs = _.sort(rows);
				
				if(column.order == "desc") {
					qs.setCompare(function(a, b) {
						return (getValue(a) > getValue(b)) ? true : false;
					});
				} else {
					qs.setCompare(function(a, b) {
						return (getValue(a) < getValue(b)) ? true : false;
					});
				}
				
				// 정렬
				qs.run();
				
				// 데이터 초기화 및 입력, 그리고 로딩
				self.emit("sortend", [ column, e ]);
				self.clear();
				self.next();
				self.hideLoading();
			}
			
		    // 해당 컬럼에 해당하는 값 가져오기
			function getValue(data) {
		    	var value = data[column.name];
		    	
    			if(!isNaN(value) && value != null) {
    				return parseInt(value);
    			} 
    			
    			if(typeof(value) == "string") {
    				return value.toLowerCase();
    			}
    			
    			return "";
		    }
		}
		
		this.filter = function(index, keyword, callback) { // filter (=포함), keyword가 null일 경우에는 롤백
			if(!this.options.fields) return;

			var column = head.getColumn(index);
			resetFilteredData(this);
			
			if(column.name && keyword) {
				setFilteredData(this, column.name, function(target) {
					if(typeof(callback) == "function") {
						if(callback(target, keyword))
							return true;
					} else {
						if(("" + target).indexOf(("" + keyword)) != -1)
							return true;
					}
					
					return false;
				});
			} else {
				this.emit("filter", [ rows ]);
			}
		}
		
		this.clear = function() {
			page = 1;
			body.uit.removeRows();
			body.scroll();
		}
		
		this.reset = function() {
			this.clear();
			rows = [];
		}
		
		this.resize = function() {
			head.resizeColumns();
			head.resize();
			head.emit("colresize");
		}
		
		this.height = function(h) {
			if(this.options.buffer != "scroll") return;
			
			this.options.scrollHeight = h;
			$(this.root).find(".body").css("max-height", h + "px");
			
			setScrollEvent(this);
		}
		
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return rows.length;
		}

		this.count = function() {
			return rows.length;
		}
		
		this.list = function() {
			return body.list();
		}
		
		this.listColumn = function() {
			return head.listColumn();
		}
		
		this.listData = function() {
			return rows;
		}
		
		this.get = function(index) {
			if(index == null) return null;
			return body.get(index);
		}
		
		this.getColumn = function(index) {
			return head.getColumn(index);
		}
		
		this.getData = function(index) {
			return rows[index];
		}
		
		this.showColumn = function(index) {
			head.showColumn(index);
		}
		
		this.hideColumn = function(index) {
			head.hideColumn(index);
		}
		
		this.initColumns = function(keys) {
			head.initColumns(keys);
			body.initColumns(keys);
			head.emit("colresize");
		}
		
		this.columnMenu = function(x) {
			head.columnMenu(x);
		}

		this.showExpand = function(index, obj) {
			body.showExpand(index, obj);
		}
		
		this.hideExpand = function(index) {
			if(index) body.hideExpand(index);
			else body.hideExpand();
		}
		
		this.getExpand = function() {
			return body.getExpand();
		}
		
		this.showLoading = function(delay) {
			if(!ui_modal || is_loading) return;
			
			ui_modal.show();
			is_loading = true;
			
			if(delay > 0) {
				var self = this;
				
				setTimeout(function() {
					self.hideLoading();
				}, delay);
			}
		}

		this.hideLoading = function() {
			if(!ui_modal || !is_loading) return;
			
			ui_modal.hide();
			is_loading = false;
		}
		
		this.setCsv = function(csv) {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv);
			this.update(_.csvToData(fields, csv));
		}
		
		this.setCsvFile = function(file) {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this;
			_.fileToCsv(file, function(csv) {
	            self.setCsv(csv);
			});
		}
		
		this.getCsv = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv),
				len = (rows.length > this.options.csvCount) ? this.options.csvCount : rows.length;
			
			return _.dataToCsv2({
				fields: fields,
				rows: rows,
				count: len,
				names: this.options.csvNames
			});
		}
		
		this.getCsvBase64 = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv());
		}
		
		this.rowFunc = function(type, index, callback) {
			if(!this.options.fields) return;
			
			var isCallback = (typeof(callback) == "function") ? true : false;
			var result = 0,
				count = (isCallback) ? 0 : rows.length,
				column = head.getColumn(index);
			
			if(column.name) {
				for(var i = 0; i < rows.length; i++) {
					var value = rows[i][column.name];
					
					if(!isNaN(value)) {
						if(isCallback) {
							if(callback(rows[i])) {
								result += value;
								count++;
							}
						} else {
							result += value;
						}
					}
				}
			}
			
			// 현재는 합계와 평균만 지원함
			if(type == "sum") return result;
			else if(type == "avg") return result / count;
			
			return null;
		}
		
		this.getPage = function() {
			return page - 1;
		}
	}
	
	return UI;
});