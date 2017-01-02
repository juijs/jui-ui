jui.defineUI("ui.paging", [ "jquery" ], function($) {

    /**
     * @class ui.paging
     * Paging component that can be applied to a screen with tables or various other data
     *
     * @extends core
     * @alias Paging
     * @requires jquery
     */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $main = null;

		function setEventAction(self) {
			self.addEvent($(self.root).find(".prev"), "click", function(e) {
				self.prev();
				return false;
			});

			self.addEvent($(self.root).find(".next"), "click", function(e) {
				self.next();
				return false;
			});
		}

		function setEventPage(self) {
			self.addEvent($main.find(".page"), "click", function(e) {
				var page = parseInt($(e.currentTarget).text());
				self.page(page);

				return false;
			});
		}

		function setPageStyle(self, page) {
			var $list = $main.find(".page");

			$list.each(function(i) {
				if($(this).text() == page) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}

		function changePage(self, pNo) {
			var pages = [],
				end = (lastPage < self.options.screenCount) ? lastPage : self.options.screenCount,
				start = pNo - Math.ceil(end / 2) + 1,
				start = (start < 1) ? 1 : start;

			activePage = (pNo > lastPage) ? lastPage : pNo;
			activePage = (pNo < 1) ? 1 : pNo;

			if(lastPage < start + end) {
				for(var i = lastPage - end + 1; i < lastPage + 1; i++) {
					pages.push(i);
				}

				if(activePage > lastPage) activePage = lastPage;
			} else {
				for(var i = start; i < start + end; i++) {
					pages.push(i);
				}
			}

			// 템플릿 적용
			$main.html(self.tpl["pages"]({ pages: pages, lastPage: lastPage }));

			setEventAction(self);
			setEventPage(self);
			setPageStyle(self, activePage);
		}

		this.init = function() {
			var self = this, opts = this.options;

			// 페이징 메인 설정, 없을 경우에는 root가 메인이 됨
			$main = $(self.root).find(".list");
			$main = ($main.length == 0) ? $(self.root) : $main;

			// 페이지 리로드
			this.reload();

			return this;
		}

        /**
         * @method reload
         * Reloads the number of specified data records, or reloads the initially configured number of data records if there is no parameter
         *
         * @param {Integer} count Data total count
         */
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;

			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);

			changePage(this, activePage);
			this.emit("reload");
		}

        /**
         * @method page
         * Changes to a specified page number, and gets the currently enabled page number if there is no parameter
         *
         * @param {Integer} pNo Page number
         */
		this.page = function(pNo) {
			if(!pNo) return activePage;

			changePage(this, pNo);
			this.emit("page", [ activePage ]);
		}

        /**
         * @method next
         * Changes to the next page
         */
		this.next = function() {
			this.page(activePage + 1);
		}

        /**
         * @method prev
         * Changes to the previous page
         */
		this.prev = function() {
			this.page(activePage - 1);
		}

        /**
         * @method first
         * Changes to the first page
         */
		this.first = function() {
			this.page(1);
		}

        /**
         * @method last
         * Changes to the last page
         */
		this.last = function() {
			this.page(lastPage);
		}
	}

    UI.setup = function() {
        return {
            /**
             * @cfg {Integer} [count=0]
             * Total number of data records subject to paging)
             */
			count: 0,

            /**
             * @cfg {Integer} [pageCount=10]
             * Number of data records per page
             */
			pageCount: 10,

            /**
             * @cfg {Integer} [screenCount=5]
             * Number of pages shown on the paging screen
             */
			screenCount: 5
        }
    }

    /**
     * @event page
     * Event that occurs when the page is changed
     *
     * @param {Integer} page Active page number
     */

    /**
     * @event reload
     * Event that occurs when the page is reloaded
     */

	return UI;
});
