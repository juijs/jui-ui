module.exports = function(grunt) {
    grunt.initConfig({
        watch : {
            scripts : {
                files : [ "js/**" ],
                tasks : [ "js" ],
                options : {
                    spawn : false
                }
            },
            styles: {
                files: [ "less/**" ],
                tasks: [ "css" ],
                options: {
                    spawn : false
                }
            }
        },
        qunit: {
            options: {
                timeout: 10000
            },
            all: [ "test/*.html", "test/*/*.html" ]
        },
        concat : {
            dist : {
                src : [
                    "js/button.js",
                    "js/combo.js",
                    "js/datepicker.js",
                    "js/colorpicker.js",
                    "js/dropdown.js",
                    "js/modal.js",
                    "js/notify.js",
                    "js/paging.js",
                    "js/tooltip.js",
                    "js/layout.js",
                    "js/accordion.js",
                    "js/switch.js",
                    "js/slider.js",
                    "js/progress.js",
                    "js/colorpicker.js",
                    "js/autocomplete.js",
                    "js/tab.js",
                    "js/tree.js",
                    "js/window.js",
                    "js/property.js",
                    "js/select.js",
                    "js/splitter.js",
                    "js/timepicker.js",
                    "js/numberchecker.js",
                    "js/stringchecker.js"
                ],
                dest : "dist/ui.js"
            }
        },
        uglify: {
            dist : {
                files : {
                    "dist/ui.min.js" : [ "dist/ui.js" ]
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    "dist/ui.min.css": "dist/ui.css",
                    "dist/ui-classic.min.css": "dist/ui-classic.css",
                    "dist/ui-jennifer.min.css": "dist/ui-jennifer.css",
                    "dist/ui-dark.min.css": "dist/ui-dark.css"
                }
            }
        },
        less: {
            dist: {
                files: {
                    "dist/ui.css" : [
                        "less/main.less"
                    ],
                    "dist/ui-classic.css" : [
                        "less/theme/classic.less"
                    ],
                    "dist/ui-jennifer.css" : [
                        "less/theme/jennifer.less"
                    ],
                    "dist/ui-dark.css" : [
                        "less/theme/dark.less"
                    ]
                }
            }
        },
        pkg: grunt.file.readJSON("package.json")
    });

    require("load-grunt-tasks")(grunt);

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("js", [ "concat", "uglify" ]);
    grunt.registerTask("css", [ "less", "cssmin" ]);
    grunt.registerTask("test", [ "qunit" ]);
    grunt.registerTask("default", [ "css", "js", "test" ]);
};
