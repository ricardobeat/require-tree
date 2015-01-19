// require-tree
// ============
// Batch module loader for nodejs
/*

(c) Ricardo Tomasi 2012-2015
License: MIT <ricardo.mit-license.org>

*/

var fs     = require('fs')
  , path   = require('path')
  , extend = require('extend')
  , type   = require('component-type')

function getFilter (filter) {
    switch (type(filter)) {
        case 'array'    : filter = filter.join('|')
        case 'string'   : filter = new RegExp('^('+filter.replace('*', '.*')+')$', 'i')
        case 'regexp'   : filter = filter.exec.bind(filter)
        case 'function' : return filter
    }
    // return undefined
}

function require_tree (directory, options) {

    options = extend({
        index: 'merge'
    }, options)

    var baseDir   = process.env.NODE_PATH || path.dirname(module.parent.filename)
      , dir       = path.resolve(baseDir, directory)
      , forbidden = ['.json', '.node']
      , filter    = getFilter(options.filter) || Boolean
      , tree      = {}
      , files     = fs.readdirSync(dir)

    files.filter(filter).forEach(function(file){

        var ext   = path.extname(file)
          , name  = path.basename(file, ext)
          , fpath = path.join(dir, file)
          , exported, _exported

        if (fs.lstatSync(fpath).isDirectory()) {
            tree[file] = require_tree(fpath, options)
            return
        }

        if (forbidden.indexOf(ext) >= 0  ||
            !(ext in require.extensions) ||
            (name === 'index' && /ignore|false/.test(options.index))) {
            return
        }

        exported = _exported = require(fpath)

        if (options.keys) {
            var keys = getFilter(options.keys)
            exported = {}
            Object.getOwnPropertyNames(_exported).forEach(function(key){
                if (keys(key)) {
                    exported[key] = _exported[key]
                }
            })
        }

        switch (type(options.main)) {
            case 'string':
                exported = exported[options.main]
                break
            case 'function':
                exported = options.main(exported, file)
                break
            case 'array':
                exported = {}
                Object.getOwnPropertyNames(_exported).forEach(function(key){
                    if (options.main.indexOf(key) >= 0) {
                        exported[key] = _exported[key]
                    }
                })
        }

        switch (type(options.name)) {
            case 'string':
                name = exported[options.name]
                break
            case 'function':
                name = options.name(exported, file)
        }

        if (type(options.transform) === 'function') {
            exported = options.transform(exported, file, path.join(dir, file))
        }

        if (name === 'index' && options.index === 'merge') {
            extend(tree, exported)
        } else { /* if name !== 'index' || options.index === 'preserve' */
            tree[name] = exported
        }

        options.each && options.each(exported, file, path.join(dir, file))

    })

    return tree
}

module.exports = require_tree

// Necessary to get the current `module.parent` and resolve paths correctly.
delete require.cache[__filename]
