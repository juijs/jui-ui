jui.defineUI("ui.autocomplete", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * @class ui.autocomplete
     * Auto complete component that shows a list of keywords containing the input value when inputting a string in a text box
     *
     * @extends core
     * @requires jquery
     * @requires util.base
     * @requires ui.dropdown
	 */
	var UI = function() {
		var ddUi = null, target = null,
            words = [], list = [];

		function createDropdown(self, words) {
			if(words.length == 0) {
				if(ddUi) ddUi.hide();
				return;
			} else {
				if(ddUi) $(ddUi.root).remove();
			}
			
			var pos = $(self.root).position(),
				$ddObj = $(self.tpl.words({ words: words }));

			$(self.options.parent).append($ddObj);
			
			ddUi = dropdown($ddObj, {
				keydown: true,
				width: $(self.root).outerWidth(),
				height: self.options.height,
				left: pos.left,
				top: pos.top + $(self.root).outerHeight(),
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text, e ]);
					}
				}
			});

			if(self.options.dx > 0 || self.options.dy > 0) {
                ddUi.show(self.options.dx, self.options.dy);
			} else {
				ddUi.show();
			}
		}
		
		function getFilteredWords(word) {
			var result = [];
			
			if(word != "") {
				for(var i = 0; i < words.length; i++) {
					var origin = words[i],
						a = words[i].toLowerCase(),
						b = word.toLowerCase();
					
					if(a.indexOf(b) != -1) {
						result.push(origin);
					}
				}
			}
			
			return result;
		}
		
		function setEventKeyup(self) {
			self.addEvent(target, "keyup", function(e) {
				if(e.which == 38 || e.which == 40 || e.which == 13) return;

                list = getFilteredWords($(this).val());
				createDropdown(self, list);

				return false;
			});

            if(self.options.showAll) {
                self.addEvent(target, "focus", function(e) {
					if($(this).val() == "") {
                        list = words;
                        createDropdown(self, list);

                        return false;
					}
                });
            }
		}

		this.init = function() {
			var opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);

			// 키-업 이벤트 설정
			setEventKeyup(this);

            // 단어 업데이트
            this.update(opts.words);
		}

        /**
         * @method update
         * Updates words subject to autofill
         *
         * @param {Array} words
         */
		this.update = function(newWords) {
			words = newWords;
		}

		/**
		 * @method close
		 * Close the active drop-down
		 *
		 */
		this.close = function() {
			if(ddUi) ddUi.hide();
		}

        /**
         * @method list
         * Gets filtered words subject to autofill
         *
         * @return {Array} words
         */
        this.list = function() {
            return list;
        }
	}

    UI.setup = function() {
        return {
        	parent: "body",

            /**
             * @cfg {String/DOMElement} [target=null]
             * Designates a target selector when an autofill route is not a target
             */
			target: null,

            /**
             * @cfg {Array} words
             * Designates words subject to autofill
             */
			words: [],

            /**
			 * @cfg {Boolean} showAll
			 * When 'focus' event occur, show all words
             */
            showAll: false,

			dx: 0,
			dy: 0,
			height: "auto"
        }
    }

    /**
     * @event change
     * Event that occurs when you click on a dropdown that shows a word list
     *
     * @param {String} word Changed word
     */
	
	return UI;
});