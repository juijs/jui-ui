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
		function createDropdown(self) {
			var $ddObj = $(self.tpl.words());
			$("body").append($ddObj);
			
			ddUi = dropdown($ddObj, { 
				keydown: true,
				tpl: {
					li: "<li><!= word !></li>"
				},
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text ]);
						
						return false;
					}
				}
			});
		}
		
		function getFilteredWords(self, word) {
			var words = self.options.words,
				result = [];
			
			for(var i = 0; i < words.length; i++) {
				var origin = words[i],
					a = words[i].toLowerCase(),
					b = word.toLowerCase();
				
				if(a.indexOf(b) != -1) {
					result.push({ word: origin });
				}
			}
			
			return result;
		}
		
		function setEventKeyup(self) {
			$(target).unbind("keyup");
			
			self.addEvent(target, "keyup", function(e) {
				if(e.which == 38 || e.which == 40 || e.which == 13) return;
				if($(this).val() == "") {
					ddUi.hide();
					return;
				}
				
				var words = getFilteredWords(self, $(this).val());
				ddUi.update(words);
				
				if(words.length > 0) {
					var pos = $(self.root).offset();
					
					ddUi.move(pos.left, pos.top + $(self.root).outerHeight());
					ddUi.show();
				} else ddUi.hide();
				
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
			
			// 타겟 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);
			
			// 드롭다운 UI 생성
			createDropdown(this);
			
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