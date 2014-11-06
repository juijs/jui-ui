jui.defineUI("uix.autocomplete", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ddUi = null, target = null,
            words = [], list = [];
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createDropdown(self, words) {
			if(words.length == 0) {
				if(ddUi) ddUi.hide();
				return;
			} else {
				if(ddUi) $(ddUi.root).remove();
			}
			
			var pos = $(self.root).offset(),
				$ddObj = $(self.tpl.words({ words: words }));

			$("body").append($ddObj);
			
			ddUi = dropdown($ddObj, {
				keydown: true,
				width: $(self.root).outerWidth(),
				left: pos.left,
				top: pos.top + $(self.root).outerHeight(),
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text, e ]);
					}
				}
			});
			
			ddUi.show();
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
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);

			// 키-업 이벤트 설정
			setEventKeyup(this);

            // 단어 업데이트
            this.update(opts.words);
		}		
		
		this.update = function(newWords) {
			words = newWords;
		}

        this.list = function() {
            return list;
        }
	}

    UI.setup = function() {
        return {
			target: null,
			words: []
        }
    }
	
	return UI;
});