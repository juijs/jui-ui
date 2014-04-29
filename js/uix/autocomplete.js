jui.define('uix.autocomplete', [ 'util', 'ui.dropdown' ], function(_, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ddUi = null, target = null;
		
		
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
		
		function getFilteredWords(self, word) {
			var words = self.options.words,
				result = [];
			
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
				
				createDropdown(self, getFilteredWords(self, $(this).val()));
				return false;
			});
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					target: null,
					words: []
				},
				valid: {
					update: [ "array" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);
			
			// 키-업 이벤트 설정
			setEventKeyup(this);
			
			return this;
		}		
		
		this.update = function(words) {
			this.options.words = words;
		}
	}
	
	return UI;
});