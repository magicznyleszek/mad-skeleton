module.exports = (grunt) ->

    # prepare stuff
    require('time-grunt')(grunt)
    require('load-grunt-config')(grunt)

    # configuration
    grunt.initConfig(
        pkg: grunt.file.readJSON('package.json')
        cssnext:
            options:
                sourcemap: false
                import: true
                # compress: true # DEV
            dist:
                files:
                    "public/styles/main.css": "_assets/styles/main.css"
        coffee:
            default:
                options:
                    sourcemap: false
                expand: true
                cwd: '_assets/scripts'
                src: ['**/*.coffee']
                dest: 'public/scripts'
                ext: '.js'
        svgstore:
            default:
                options:
                    prefix: 'icon-'
                    svg:
                        style: 'width: 0; height: 0; overflow: hidden; position: fixed; visibility: hidden;'
                    formatting:
                        indent_size: 4
                files:
                    '_includes/icons.svg': ['_assets/icons/*.svg']
        clean:
            images:
                src: ['public/images']
        responsive_images:
            default:
                options:
                    engine: 'gm'
                    newFilesOnly: true
                    sizes: [
                        {
                            name: 'thumbnail'
                            rename: false
                            width: 400
                            height: 400
                            aspectRatio: true
                            upscale: true
                            quality: 100
                        }
                        {
                            name: 'thumbnail-x2'
                            rename: false
                            width: 800
                            height: 800
                            aspectRatio: true
                            upscale: true
                            quality: 100
                        }
                    ]
                files: [
                    expand: true
                    cwd: '_assets/images/'
                    src: ['**/*.{jpg,gif,png}']
                    custom_dest: 'public/images/{%= path %}/{%= name %}/'
                ]
        copy:
            images:
                files: [
                    expand: true
                    cwd: '_assets/images/'
                    src: ['**/*.{jpg,gif,png}']
                    dest: 'public/images/'
                    rename: (dest, src) ->
                        project = src.split('/')[0]
                        file = src.split('/')[1]
                        return "#{dest}#{project}/original/#{file}"
                ]
        imagemin:
            default:
                options:
                    optimizationLevel: 5
                files: [
                    expand: true
                    cwd: 'public/images'
                    src: ['**/*.{jpg,gif,png}']
                    dest: 'public/images'
                ]
        watch:
            icons:
                options:
                    spawn: false
                    debounceDelay: 250
                files: ['_assets/icons/*.svg']
                tasks: ['svgstore']
            # images:
            #     options:
            #         spawn: false
            #         debounceDelay: 5000
            #     files: ['_assets/images/**/*.{jpg,gif,png}']
            #     tasks: ['clean:images', 'responsive_images']
            styles:
                files: ['_assets/styles/**/*.css']
                tasks: ['cssnext']
            scripts:
                files: ['_assets/styles/**/*.coffee']
                tasks: ['coffee']
    )

    # register tasks
    grunt.registerTask('default', [
        'build_assets'
        'watch'
    ])
    grunt.registerTask('build', [
        'build_assets'
        'build_images'
    ])
    grunt.registerTask('build_assets', [
        'svgstore'
        'coffee'
        'cssnext'
    ])
    grunt.registerTask('build_images', [
        'responsive_images'
        'copy:images'
        'imagemin'
    ])
    grunt.registerTask('build_images_from_scratch', [
        'clean:images'
        'build_images'
    ])
