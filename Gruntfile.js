module.exports = function(grunt) {

  grunt.initConfig({
  	
  	concat : {
  		dist : {
  			src : [
      			//core
      			"js/base.js",
      			"js/core.js",
      			
      			// ui
      			"js/ui/button.js",
      			"js/ui/combo.js",
      			"js/ui/datepicker.js",
      			"js/ui/dropdown.js",
      			"js/ui/modal.js",
      			"js/ui/notify.js",
      			"js/ui/paging.js",
      			"js/ui/tooltip.js",
      			"js/ui/layout.js",
      			
      			// uix
      			"js/uix/autocomplete.js",
      			"js/uix/tab.js",
      			"js/uix/table.js",
      			"js/uix/tree.js",
      			"js/uix/window.js",
      			"js/uix/xtable.js"
      		],
      		dest : "jui.js"
  		}
  	},
  	
    uglify: {
     
      dist : {
      	files : { 
      		"jui.min.js" : [ "jui.js" ]	
      	}
      }      
    },
    cssmin: {
      dist: {
        files: {
          'jui.min.css': 'jui.css'
        }
      }
    },    
    
    less: {
      dist: {
        files: {
        	"jui.css" : [
        		"less/_main.less"
        	] 
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'less',
    'cssmin',
  	"concat",    
    'uglify'
  ]);
};
