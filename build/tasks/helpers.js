/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Build task helpers.
|  @requires cross-spawn
|  @requires spawn-sync
|  @requires rimraf
|  @requires gulp
|  @requires dotnet
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('cross-spawn').sync;
var rimraf = require('rimraf').sync;
var spawnOptions = { stdio: 'inherit' };
var dotNetOptions = ' -f netcoreapp1.0 -b ../build -o ../build/output';
var gulpOptions = '--gulpfile ../build/tasks/gulpfile.js';

module.exports = {
    changeToProjectDir: function() {
        var cwd = process.cwd();
        var elements = cwd.split('/');

        if (elements.length === 1) {
            elements = cwd.split('\\');
        }

        var leaf = elements[elements.length - 1];

        if (leaf !== 'src') {
            process.chdir('src');
        }

        return module.exports;
    },

    run: function(commandLine) {
        var args = commandLine.split(' ');
        spawn(args[0], args.splice(1), spawnOptions);
        return module.exports;
    },

    node: function(commandLine) {
        spawn('node', ('../build/tasks/' + commandLine).split(' '), spawnOptions);
        return module.exports;
    },

    gulp: function(commandLine) {
        spawn('gulp',
            (gulpOptions + (commandLine ? ' ' + commandLine : '')).split(' '),
            spawnOptions);

        return module.exports;
    },

    dotnet: function(program, commandLine, suppressOptions) {
        spawn('dotnet',
            (program + (suppressOptions ? '' : dotNetOptions) + (commandLine ? ' ' + commandLine : '')).split(' '),
            spawnOptions);
        
        return module.exports;
    },

    clean: function(path) {
        rimraf(path);
        return module.exports;
    },

    get operation() {
        return process.argv.length > 2 ? process.argv[2] : null;
    },

    get parameter() {
        return process.argv.length > 3 ? process.argv[3] : null;
    },

    get parameters() {
        return process.argv.slice(2).join(' ');
    }
};
