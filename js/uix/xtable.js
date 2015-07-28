jui.defineUI("uix.xtable", [ "jquery", "util.base", "ui.modal", "uix.table" ], function($, _, modal, table) {
	var p_type = null;

	_.resize(function() {
		var call_list = jui.get("uix.xtable");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);

    /**
     * @class uix.xtable
     * @extends core
     * @alias X-Table
     * @requires util.base
     * @requires ui.modal
     * @requires uix.table
     *
     */
	var UI = function() {
		var head = null, body = null;
		var rows = [], o_rows = null;
		var ui_modal = null, page = 1;
        var is_loading = false, is_resize = false;
		

		function createTableList(self) { // 2
			var exceptOpts = [ 
               "buffer", "bufferCount", "csvCount", "sortLoading", "sortCache", "sortIndex", "sortOrder",
               "event", "rows", "scrollWidth", "width"
            ];
			
			body = table($(self.root).children("table"), getExceptOptions(self, exceptOpts.concat("resize"))); // 바디 테이블 생성
			setTableBodyStyle(self, body); // X-Table 생성 및 마크업 설정
			
			head = table($(self.root).children("table.head"), getExceptOptions(self, exceptOpts)); // 헤더 테이블 생성
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
				var opts = self.options;

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
				
				if(opts.width > 0) {
					$(self.root).outerWidth(opts.width);
				}
				
				if(opts.scrollWidth > 0) {
					var rootWidth = $(self.root).outerWidth();
					
					$(self.root).css({
						"max-width": self.options.scrollWidth,
						"overflow-x": "auto",
                        "overflow-y": "hidden"
					});
					
					$(head.root).outerWidth(rootWidth);
					$(body.root).parent().outerWidth(rootWidth);
				}
			}
			
			function setTableBodyStyle(self, body) {
				var $table =  $(body.root).clone(),
					cols = body.listColumn();
				
				// X-Table 바디 영역 스크롤 높이 설정
				if(self.options.buffer != "page") 
					$(body.root).wrap("<div class='body' style='max-height: " + self.options.scrollHeight + "px'></div>");
				else
					$(body.root).wrap("<div class='body'></div>");

                // X-Table 바디 영역의 헤더라인은 마지막 노드를 제외하고 제거
                $(body.root).find("thead > tr").outerHeight(0).not(":last-child").remove();

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
				$(self.root).css("padding-top", $table.height());
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

            head.on("colclick", function(column, e) {
                self.emit("colclick", [ column, e ]);
            });

            head.on("coldblclick", function(column, e) {
                self.emit("coldblclick", [ column, e ]);
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

			body.on("click", function(obj, e) {
				self.emit("click", [ obj, e ]);
			});

			body.on("dblclick", function(obj, e) {
				self.emit("dblclick", [ obj, e ]);
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
			
			$body.off("scroll").scroll(function(e) {
			    if((this.scrollTop + self.options.scrollHeight) >= $body.get(0).scrollHeight) {
		    		self.next();
			    	self.emit("scroll", e);
			    	
			    	return false;
			    }
			});
		}
		
        function setColumnResizeScroll(self) {
            var column = {},
                width = {},
                resizeX = 0;

            // 리사이즈 엘리먼트 삭제
            $(self.root).find("thead .resize").remove();

            for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                var $colElem = $(head.getColumn(i).element),
                    $resizeBar = $("<div class='resize'></div>");
                var pos = $colElem.position();

                $resizeBar.css({
                    position: "absolute",
                    width: "8px",
                    height: $colElem.outerHeight(),
                    left: ($colElem.outerWidth() + (pos.left - 1)) + "px",
                    top: pos.top + "px",
                    cursor: "w-resize",
                    "z-index": "1"
                });

                $colElem.append($resizeBar);

                // Event Start
                (function(index) {
                    self.addEvent($resizeBar, "mousedown", function(e) {
                        if(resizeX == 0) {
                            resizeX = e.pageX;
                        }

                        // 컬럼 객체 가져오기
                        column = {
                            head: head.getColumn(index),
                            body: body.getColumn(index)
                        };

                        width = {
                            column: $(column.head.element).outerWidth(),
                            body: $(body.root).outerWidth()
                        };

                        is_resize = true;

                        return false;
                    });
                })(i);
            }

            self.addEvent("body", "mousemove", function(e) {
                if(resizeX > 0) {
                    colResizeWidth(e.pageX - resizeX);
                }
            });

            self.addEvent("body", "mouseup", function(e) {
                if(resizeX > 0) {
                    resizeX = 0;
                    is_resize = false;

                    // 리사이징 바, 위치 이동
                    colResizeBarLeft();

                    head.emit("colresize", [ column.head, e ]);

                    return false;
                }
            });

            // 리사이징 바 위치 설정
            head.on("colshow", colResizeBarLeft);
            head.on("colhide", colResizeBarLeft);

            function colResizeWidth(disWidth) {
                var colMinWidth = 30;

                // 최소 크기 체크
                if (width.column + disWidth < colMinWidth)
                    return;

                $(column.head.element).outerWidth(width.column + disWidth);
                $(column.body.element).outerWidth(width.column + disWidth);

                if (disWidth > 0) {
                    $(body.root).parent().outerWidth(width.body + disWidth);
                    $(head.root).outerWidth(width.body + disWidth);
                }
            }

            function colResizeBarLeft() {
                for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                    var $colElem = $(head.getColumn(i).element);

                    $colElem.find(".resize").css("left", ($colElem.outerWidth() + $colElem.position().left) + "px");
                }
            }
        }
		

		this.init = function() {
			var opts = this.options;

            // @Deprecated, 'rows'는 의미상 맞지 않아 차후 삭제
            opts.data = (opts.rows != null) ? opts.rows : opts.data;

            // 루트가 테이블일 경우, 별도 처리
            if(this.root.tagName == "TABLE") {
                var $root = $(this.root).wrap("<div class='xtable'></div>");
                this.root = $root.parent().get(0);
            }

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
			if(opts.data) {
				this.update(opts.data);
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
			
			// 컬럼 리사이징 (기본)
			if(opts.resize) {
				head.resizeColumns();
				head.resize();
            }

            // 컬럼 리사이징 (가로스크롤)
            if(!opts.resize && opts.scrollWidth > 0) {
                setColumnResizeScroll(this);
            }
		}

		/**
		 * @method select
		 * Adds a selected class to a row at a specified index and gets an instance of the applicable row.
		 *
		 * @param {Integer} index
		 * @return {RowObject} row
		 */
		this.select = function(index) {
			return body.select(index);
		}

		/**
		 * @method update
		 * Updates the list of rows or modifies the row at a specified index.
		 *
		 * @param {Array} rows
		 */
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

		/**
		 * @method next
		 * Changes to the next page.
		 */
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

		/**
		 * @method page
		 * Changes to the page of at a specified index.
		 *
		 * @param {Integer} index
		 */
		this.page = function(pNo) {
			if(this.options.buffer == "scroll") return false;
			if(this.getPage() == pNo) return false;
			
			p_type = (page > pNo) ? "prev" : "next";
			this.clear();
			
			page = (pNo < 1) ? 1 : pNo;
			this.next();
		}

		/**
		 * @method sort
		 * Moves a row iat a specified index to the target index.
		 *
		 * @param {Integer} index
		 * @param {String} order  "asc" or "desc"
		 */
		this.sort = function(index, order, e, isNotLoading) { // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort || is_resize) return;
			
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

                if(typeof(value) == "string") {
                    return value.toLowerCase();
                } else {
                    if(!isNaN(value) && value != null) {
                        return value;
                    }
                }
    			
    			return "";
		    }
		}

		/**
		 * @method filter
		 * Filters columns at a specified to locate rows that contain keywords in the cell value.
		 *
		 * @param {Function} callback
		 */
        this.filter = function(callback) {
            if(typeof(callback) != "function") return;

            if(o_rows == null) o_rows = rows;
            else rows = o_rows;

            var t_rows = rows.slice(),
                s_rows = [];

            for(var i = 0, len = t_rows.length; i < len; i++) {
                if(callback(t_rows[i]) === true) {
                    s_rows.push(t_rows[i]);
                }
            }

            this.update(s_rows);
            this.emit("filter", [ s_rows ]);
        }

		/**
		 * @method rollback
		 * Returns filtered rows to the original state.
		 */
        this.rollback = function() {
            if(o_rows != null) {
                this.update(o_rows);

                o_rows = null;
            }
        }

		/**
		 * @method clear
		 * Remove all row elements.
		 */
		this.clear = function() {
			page = 1;
			body.uit.removeRows();
			body.scroll();
		}

		/**
		 * @method clear
		 * Remove all data
		 */
		this.reset = function() {
			this.clear();
			rows = [];
		}

		/**
		 * @method resize
		 * Resets the inner scroll and columns of a table.
		 */
		this.resize = function() {
			head.resizeColumns();
			head.resize();
			head.emit("colresize");
		}

		/**
		 * @method height
		 * Sets the scroll based on the height of a table.
		 *
		 * @param {Integer} height
		 */
		this.height = function(h) {
			if(this.options.buffer != "scroll") return;
			
			this.options.scrollHeight = h;
			$(this.root).find(".body").css("max-height", h + "px");
			
			setScrollEvent(this);
		}

		/**
		 * @method size
		 * Gets the size of all the rows of a table.
		 *
		 * @return {Integer} size
		 */
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return rows.length;
		}

		/**
		 * @method count
		 * Gets the number of trows of a table.
		 *
		 * @return {Integer} count
		 */
		this.count = function() {
			return rows.length;
		}

		/**
		 * @method list
		 * Gets all the rows of a table.
		 *
		 * @return {Array} rows
		 */
		this.list = function() {
			return body.list();
		}

		/**
		 * @method listColumn
		 * Gets all columns.
		 *
		 * @return {Array} columns
		 */
		this.listColumn = function() {
			return head.listColumn();
		}

		/**
		 * @method listData
		 * Gets the data of all the rows of a table.
		 *
		 * @return {Array} datas
		 */
		this.listData = function() {
			return rows;
		}

		/**
		 * @method get
		 * Gets the row at the specified index.
		 *
		 * @param {Integer} index
		 * @return {RowObject} row
		 */
		this.get = function(index) {
			if(index == null) return null;
			return body.get(index);
		}

		/**
		 * @method getColumn
		 * Gets the column at the specified index.
		 *
		 * @param {"Integer"/"String"} key index or column key
		 * @return {ColumnObject} column
		 */
		this.getColumn = function(index) {
			return head.getColumn(index);
		}
		
		this.getData = function(index) {
			return rows[index];
		}

		/**
		 * @method showColumn
		 * Shows the column index (or column name).
		 *
		 * @param {"Integer"/"String"} key index or column name
		 */
		this.showColumn = function(index) {
			head.showColumn(index);
		}

		/**
		 * @method hideColumn
		 * Hides the column index (or column name).
		 *
		 * @param {"Integer"/"String"} key index or column name
		 */
		this.hideColumn = function(index) {
			head.hideColumn(index);
		}

		/**
		 * @method initColumns
		 * It is possible to determine the index or name of the column to be shown in an array.
		 *
		 * @param {"Integer"/"String"} key index or column name
		 */
		this.initColumns = function(keys) {
			head.initColumns(keys);
			body.initColumns(keys);
			head.emit("colresize");
		}

		/**
		 * @method showColumnMenu
		 * Shows the Show/Hide Column menu at specified coordinates.
		 *
		 * @param {Integer} x
		 */
		this.showColumnMenu = function(x) {
			head.showColumnMenu(x);
		}

		/**
		 * @method hideColumnMenu
		 * Hides the Show/Hide Column menu.
		 */
        this.hideColumnMenu = function() {
            head.hideColumnMenu();
        }

		/**
		 * @method toggleColumnMenu
		 * Shows or hides the Show/Hide Column menu.
		 *
		 * @param {Integer} x
		 */
        this.toggleColumnMenu = function(x) {
            head.toggleColumnMenu(x);
        }

		/**
		 * @method showExpand
		 * Shows the extended row area of a specified index.
		 *
		 * @param {Integer} index
		 */
		this.showExpand = function(index, obj) {
			body.showExpand(index, obj);
		}

		/**
		 * @method hideExpand
		 * Hides the extended row area of a specified index.
		 */
		this.hideExpand = function(index) {
			if(index) body.hideExpand(index);
			else body.hideExpand();
		}

		/**
		 * @method getExpand
		 * Get a row in which the extended area is currently activated.
		 *
		 * @return {RowObject} row
		 */
		this.getExpand = function() {
			return body.getExpand();
		}

		/**
		 * @method showLoading
		 * Shows the loading screen for the specified delay time.
		 *
		 * @param {Integer} delay
		 */
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

		/**
		 * @method hideLoading
		 * Hides the loading screen.
		 */
		this.hideLoading = function() {
			if(!ui_modal || !is_loading) return;
			
			ui_modal.hide();
			is_loading = false;
		}

		/**
		 * @method setCsv
		 * Updates a table using a CVS string.
		 */
		this.setCsv = function(csv) {
            var opts = this.options;
			if(!opts.fields && !opts.csv) return;
			
			var fields = _.getCsvFields(opts.fields, opts.csv),
                csvNumber = (opts.csvNumber) ? _.getCsvFields(opts.fields, opts.csvNumber) : null;

			this.update(_.csvToData(fields, csv, csvNumber));
		}

		/**
		 * @method setCsvFile
		 * Updates a table using a CVS file.
		 */
		this.setCsvFile = function(file) {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this;
			_.fileToCsv(file, function(csv) {
	            self.setCsv(csv);
			});
		}

		/**
		 * @method getCsv
		 * Gets the data of a table as a CSV string.
		 *
		 * @param {Boolean} isTree
		 * @return {String} csv
		 */
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

		/**
		 * @method getCsvBase64
		 * Gets the data of a table as a CSV string encoded as base64.
		 *
		 * @param {Boolean} isTree
		 * @return {String} base64
		 */
		this.getCsvBase64 = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv());
		}

		/**
		 * @method downloadCsv
		 * Downloads the data of a table as a CSV file.
		 *
		 * @param {String} name
		 * @param {Boolean} isTree
		 */
        this.downloadCsv = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".csv" : "table.csv";
            a.href = this.getCsvBase64();

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }

		/**
		 * @method rowFunc
		 * Ir is possible to use a function for all row data applicable to the column (or column name) of a specified column (or column name). Currently only SUM and AVG are supported.
		 *
		 * @param {"sum"/"svg"} funcType
		 * @param {Integer} columnIndex
		 * @param {Function} callback
		 */
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

		/**
		 * @method getPage
		 * Gets the current page of a table.
		 *
		 * @return {Ingeger} page
		 */
		this.getPage = function() {
			return page - 1;
		}

		/**
		 * @method activeIndex
		 * Gets the index of a row that is activated in an extended/modified/selected state.
		 *
		 * @return {Integer} index
		 */
		this.activeIndex = function() {
			return body.activeIndex();
		}
	}

    UI.setup = function() {
        return {
			/**
			 * @cfg {Array} [fields=null]
			 * Sets the name of columns in the order of being displayed on the table screen.
			 */
			fields: null,

			/**
			 * @cfg {Array} [csv=null]
			 * Sets the column key shown when converted to a CSV string.
			 */
			csv: null,

			/**
			 * @cfg {Array} [csvNames=null]
			 * Sets the name of a column shown when converting to a CSV string, which must be defined in the same order as the CSV option.
			 */
			csvNames: null,

			/**
			 * @cfg {Array} [csvNumber=null]
			 * Sets the column key to be changed to a number form when converted to a CSV string.
			 */
			csvNumber: null,

			/**
			 * @cfg {Array} [csvCount=10000]
			 * Sets the maximum number of rows when creating a CSV string.
			 */
			csvCount: 10000,

			/**
			 * @cfg {Array} data
			 * Sets the initial row list of a table.
			 */
			data: [],

			/**
			 * @cfg {Array} rows
			 * Sets the initial row list of a table (@Deprecated).
			 */
			rows: null, // @Deprecated

			/**
			 * @cfg {Boolean/Array} [colshow=false]
			 * Sets a column index shown when the Show/Hide Column menu is enabled.
			 */
			colshow: false,

			/**
			 * @cfg {Boolean} [expand=false]
			 * Determines whether to use an extended row area.
			 */
			expand: false,

			/**
			 * @cfg {Boolean} [expandEvent=true]
			 * Shows the extended area automatically when clicking on a row.
			 */
			expandEvent: true,

			/**
			 * @cfg {Boolean} [resize=false]
			 * Determines whether to use the column resizing function.
			 */
			resize: false,

			/**
			 * @cfg {Integer} [scrollHeight=200]
			 * Sets the reference height of a body area when using a table scroll.
			 */
			scrollHeight: 200,

			/**
			 * @cfg {Integer} [scrollWidth=0]
			 * Sets the reference width of a body area when using a table scroll.
			 */
			scrollWidth: 0,

			/**
			 * @cfg {Integer} [width=0]
			 * Sets the area of a table.
			 */
			width: 0,

			/**
			 * @cfg {String} [buffer='scroll'/'page'/'s-page']
			 * Sets the buffer type of a table.
			 */
			buffer: "scroll",

			/**
			 * @cfg {Integer} [bufferCount=100]
			 * Sets the number of rows per page.
			 */
			bufferCount: 100,

			/**
			 * @cfg {Boolean/Array} [sort=false]
			 * Determines whether to use the table sort function.
			 */
			sort: false,

			/**
			 * @cfg {Boolean} [sortLoading=false]
			 * Determines whether to show the loading screen when sorting a table.
			 */
			sortLoading: false,

			/**
			 * @cfg {Boolean} [sortCache=false]
			 * Configures settings to ensure that the sort state can be maintained even when the table is updated.
			 */
			sortCache: false,

			/**
			 * @cfg {Integer} [sortIndex=null]
			 * Determines whether to use the table sort function.
			 */
			sortIndex: null,

			/**
			 * @cfg {String} [sortOrder="asc"]
			 * Determines whether to use the table sort function.
			 */
			sortOrder: "asc",

			/**
			 * @cfg {Boolean} [sortEvent=true]
			 * Determines whether to use the sort function when you click on a column.
			 */
			sortEvent: true,

			animate: false // @Deprecated
        }
    }

	/**
	 * @event select
	 * Event that occurs when a row is selected (@Deprecated)
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event click
	 * Event that occurs when a row is clicked
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event dblclick
	 * Event that occurs when a row is double clicked
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event sort
	 * Event that occurs when the table is sorted.
	 *
	 * @param {ColumnObject) column
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event scroll
	 * Event that occurs when the scroll of a table is located at the lowermost position.
	 *
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event rowmenu
	 * Event that occurs when a row is right clicked.
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event colclick
	 * Event that occurs when a column is clicked.
	 *
	 * @param {ColumnObject) column
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event colshow
	 * Event that occurs when shown column is selected.
	 *
	 * @param {ColumnObject) column
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event colhide
	 * Event that occurs when hidden column is selected.
	 *
	 * @param {ColumnObject) column
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event colresize
	 * Event that occurs when the column resizing is activated.
	 *
	 * @param {ColumnObject) column
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event expand
	 * Event that occurs when the extended row area is enabled.
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	/**
	 * @event expandend
	 * Event that occurs when the extended row area is disabled.
	 *
	 * @param {RowObject) row
	 * @param {EventObject} e The event object
	 */

	return UI;
});