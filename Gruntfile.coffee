module.exports = (grunt) ->

    # configuration
    grunt.initConfig(
        pkg: grunt.file.readJSON('package.json')
        compass:
            default:
                options:
                    config: '_assets/config.rb'
                    basePath: '_assets'
        coffee:
            default:
                options:
                    sourceMap: true
                expand: true
                cwd: '_assets/scripts'
                src: ['**/*.coffee']
                dest: 'public/scripts'
                ext: '.js'
        watch:
            styles:
                files: ['_assets/styles/**/*.scss']
                tasks: ['compass']
            scripts:
                files: ['_assets/scripts/**/*.coffee']
                tasks: ['coffee']
    )

    # load tasks
    grunt.loadNpmTasks('grunt-contrib-compass')
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-watch')

    # register tasks
    grunt.registerTask('default', ['watch'])
    grunt.registerTask('build', ['compass', 'coffee'])
