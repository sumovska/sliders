module.exports = function(grunt) {

    /** Default paths **/
    var d = {
        bower: 'bower_components/',
        src: 'src/',
        temp: '.temp/',
        dist: 'dist/'
    };

    /** Source paths **/
    var src = {
        root: d.src,
        less: d.src + 'less/',
        scss: d.src + 'scss/',
        sass: d.src + 'sass/',
        js: d.src + 'js/',
        img: d.src + 'img/',
        svg: d.src + 'svg/',
        favicon: d.src + 'favicon/',
        fonts: d.src + 'fonts/'
    };

    /** Temp paths **/
    var temp = {
        root: d.temp,
        css: d.temp + 'css/',
        js: d.temp + 'js/',
        img: d.temp + 'img/',
        svg: d.temp + 'svg/',
        favicon: d.temp + 'favicon/',
    };

    /** Destination paths **/
    var dist = {
        root: d.dist,
        css: d.dist + 'css/',
        js: d.dist + 'js/',
        img: d.dist + 'img/',
        svg: d.dist + 'svg/',
        favicon: d.dist + 'favicon/',
        fonts: d.dist + 'fonts/',
    };


    grunt.initConfig({

        // Config
        config: {
            src: d.src,
            temp: d.temp,
            dist: d.dist
        },

        // Delete files
        clean: {
            all: ['**/.DS_Store', temp.root, dist.root],
            temp: [temp.root],
            js: [temp.js, dist.js],
            css: [temp.css, dist.css],
            img: [temp.img, dist.img],
            svg: [temp.svg, dist.svg],
            svg_sprite: [src.less + 'core/@{svg}'],
            favicon: [src.favicon + '**/*.*', '!<%= config.src %>/favicon/master.png', dist.favicon]
        },

        // Copy files
        copy: {
            static: {
                files: [{
                    expand: true,
                    cwd: src.root,
                    dest: dist.root,
                    src: [
                        'fonts/{,*/}*.*',
                        'audio/{,*/}*.*',
                        'video/{,*/}*.*',
                        '{,*/}*.html'
                    ]
                }]
            },
            js_temp: {
                files: [{
                    expand: true,
                    cwd: src.js,
                    src: 'slider.js',
                    dest: temp.js
                }, {
                    expand: true,
                    flatten: true,
                    src: [
                        d.bower + 'wnumb/wNumb.js',
                        d.bower + 'nouislider/distribute/nouislider.min.js'
                    ],
                    dest: temp.js
                }]
            },
            js_dist: {
                files: [{
                    expand: true,
                    cwd: temp.js,
                    src: '*.js',
                    dest: dist.js
                }]
            },
            css_temp: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [
                        d.bower + 'nouislider/distribute/nouislider.min.css'
                    ],
                    dest: temp.css
                }]
            },
            css_dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: temp.css + '*.css',
                    dest: dist.css
                }]
            },
            img_temp: {
                files: [{
                    expand: true,
                    cwd: src.img,
                    src: ['**/*.{png,jpg,gif}'],
                    dest: temp.img
                }]
            },
            img_dist: {
                files: [{
                    expand: true,
                    cwd: temp.img,
                    src: ['**/*.{png,jpg,gif}'],
                    dest: dist.img
                }]
            },
            svg_temp: {
                files: [{
                    expand: true,
                    cwd: src.svg,
                    src: ['**/*.svg'],
                    dest: temp.svg
                }]
            },
            svg_dist: {
                files: [{
                    expand: true,
                    cwd: temp.svg,
                    src: ['**/*.svg', '!sprite/*.svg'],
                    dest: dist.svg
                }, {
                    expand: true,
                    cwd: src.less + 'core/@{svg}',
                    src: ['**/*.svg'],
                    dest: src.svg
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.*', '!master.png'],
                    dest: dist.favicon
                }]
            },
        },

        // Minify CSS
        cssmin: {
            default: {
                files: []
            }
        },

        // Minify JS
        uglify: {
            options: {
                preserveComments: false
            },
            default: {
                files: [{
                    expand: true,
                    cwd: temp.js + 'vendor',
                    src: ['*.js', '!*.min.js'],
                    dest: temp.js + 'vendor',
                    ext: '.min.js'
                }]
            }
        },

        // Concat files
        concat: {
            options: {
                separator: '\n\n'
            },
            css: {
                files: []
            },
            js: {
                files: []
            }
        },

        // Parse LESS
        less: {
            default: {
                files: [{
                    expand: true,
                    cwd: src.less,
                    src: ['slider.less'],
                    dest: temp.css,
                    ext: ".css"
                }]
            }
        },

        // Post CSS
        postcss: {
            options: {
                processors: [
                    require('postcss-focus'),
                    require('postcss-flexbugs-fixes'),
                    require('autoprefixer')({
                        browsers: ['> 0.5%', 'last 7 versions', 'ie > 7']
                    }),
                    require('css-mqpacker')({
                        sort: true
                    })
                ]
            },
            default: {
                files: [{
                    expand: true,
                    cwd: temp.css,
                    src: ['slider.css'],
                    dest: dist.css
                }]
            }
        },

        // Compress PNG (PNGquant)
        pngquant: {
            default: {
                files: [{
                    expand: true,
                    cwd: temp.img,
                    src: ['**/*.png'],
                    dest: temp.img
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.png', '!master.png'],
                    dest: src.favicon
                }]
            }
        },

        // Compress SVG (SVGO)
        svgo: {
            default: {
                files: [{
                    expand: true,
                    cwd: temp.svg,
                    src: ['**/*.svg'],
                    dest: temp.svg
                }]
            },
            favicon: {
                files: [{
                    expand: true,
                    cwd: src.favicon,
                    src: ['**/*.svg'],
                    dest: src.favicon
                }]
            }
        },

        // Generate SVG sprite
        svg_sprite: {
            default: {
                expand: true,
                cwd: temp.svg + 'sprite',
                src: ['**/*.svg'],
                dest: '.',
                options: {
                    mode: {
                        css: {
                            dest: src.less + 'core',
                            sprite: '@{svg}/sprite',
                            bust: false,
                            render: {
                                less: true
                            }
                        }
                    }
                }
            }
        },

        // Generate Favicon
        realFavicon: {
            favicons: {
                src: src.favicon + 'master.png',
                dest: src.favicon,
                options: {
                    iconsPath: src.favicon,
                    html: [],
                    design: {
                        ios: {
                            pictureAspect: 'backgroundAndMargin',
                            backgroundColor: '#ffffff',
                            margin: '18%',
                            assets: {
                                ios6AndPriorIcons: false,
                                ios7AndLaterIcons: false,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'whiteSilhouette',
                            backgroundColor: '#ffffff',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: false,
                                windows10Ie11EdgeTiles: {
                                    small: false,
                                    medium: true,
                                    big: false,
                                    rectangle: false
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: 'noChange',
                            themeColor: '#ffffff',
                            manifest: {
                                name: 'Prime',
                                display: 'standalone',
                                orientation: 'notSet',
                                onConflict: 'override',
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: false
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: 'silhouette',
                            themeColor: '#ffffff'
                        }
                    },
                    settings: {
                        scalingAlgorithm: 'Mitchell',
                        errorOnImageTooSmall: false
                    }
                }
            }
        },

        // Watch for changed files
        watch: {
            options: {
                livereload: true
            },
            static: {
                files: [src.root + "*.html"],
                tasks: ["static:process"]
            },
            css: {
                files: [src.less + "**/*.less"],
                tasks: ["css:process"]
            },
            js: {
                files: [src.js + "slider.js"],
                tasks: ["js:process"]
            },
            img: {
                files: [src.img + "**/*.{png,jpg,gif}"],
                tasks: ["img:process"]
            },
            svg: {
                files: [src.svg + "**/*.svg"],
                tasks: ["svg:process"]
            }
        }
    });

    // npm tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-newer");
    grunt.loadNpmTasks('grunt-pngquant');
    grunt.loadNpmTasks('grunt-svg-sprite');
    grunt.loadNpmTasks('grunt-svgo');
    grunt.loadNpmTasks('grunt-real-favicon');

    // Grunt tasks
    grunt.registerTask("default", ["clean:all", "start", "watch"]);
    grunt.registerTask("start", ["static:start", /*"img:start", "svg:start", */ "css:start", "js:start", /* "favicon:process", "clean:temp"*/]);

    grunt.registerTask("static", ["static:start"]);
    grunt.registerTask("static:start", ["copy:static"]);
    grunt.registerTask("static:process", ["newer:copy:static"]);

    grunt.registerTask("css", ["css:start"]);
    grunt.registerTask("css:start", ["clean:css", "copy:css_temp", "css:process", "copy:css_dist"]);
    grunt.registerTask("css:process", ["less:default", "postcss:default"]);

    grunt.registerTask("js", ["js:start"]);
    grunt.registerTask("js:start", ["clean:js", "copy:js_temp", /*"uglify:default", "concat:js",*/ "copy:js_dist"]);
    grunt.registerTask("js:process", ["newer:copy:js_temp", "newer:copy:js_dist"]);

    grunt.registerTask("img", ["img:start"]);
    grunt.registerTask("img:start", ["clean:img", "copy:img_temp", "pngquant:default", "copy:img_dist"]);
    grunt.registerTask("img:process", ["newer:copy:img_temp", "newer:pngquant:default", "newer:copy:img_dist"]);

    grunt.registerTask("svg", ["svg:start"]);
    grunt.registerTask("svg:start", ["clean:svg", "copy:svg_temp", "svgo:default", "svg_sprite:default", "copy:svg_dist", "clean:svg_sprite"]);
    grunt.registerTask("svg:process", ["newer:copy:svg_temp", "newer:svgo:default", "newer:copy:svg_dist"]);

    grunt.registerTask("favicon", ["favicon:start"]);
    grunt.registerTask("favicon:start", ["clean:favicon", "realFavicon", "svgo:favicon", "pngquant:favicon", "copy:favicon"]);
    grunt.registerTask("favicon:process", ["copy:favicon"]);
};
