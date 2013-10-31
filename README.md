require-tree
============

![NPM badge](https://nodei.co/npm/require-tree.png?compact=true)

Require multiple files at once, creating an object tree that mirrors the directory structure.

    npm install require-tree

Usage
-----

    var require_tree = require('require-tree')

    // File structure:
    // ./models
    //    user.js
    //    page.js
    //    item.js

    require_tree('./models')

    // {
    //    user: [object Object],
    //    page: [object Object],
    //    item: [object Object]
    // }

With nested directories:

    // ./api
    //   /pages
    //     index.js
    //     edit.js
    //   user.js

    // api/pages/index.js:
    module.exports = {
        list: function(){ ... }
    }

    // api/pages/edit.js:
    module.exports = {
        getPermissions: function(){ ... },
        remove: function(){ ... }
    }

    // api/user.js:
    module.exports = {
        profile: function(){ ... },
        posts: function(){ ... }
    }

    var api = require_tree('./api')

    // api.pages.list
    // api.pages.edit.getPermissions
    // api.pages.edit.remove
    // api.user.profile
    // api.user.posts

### Limitations

Since v0.3 `require-tree` will resolve paths relative to the requiring module, like `require` itself.

Since it depends on `module.parent` being set correctly, either `require-tree` must be explicitly required within the current module scope, or you need to provide an absolute path like `__dirname + '/somepath'`.


### Options

    {
        name   : [String | Function(exports, file)]         // the object's property to use as key
        main   : [String | Array | Function(exports, file)] // what keys should be exported
        index  : [Boolean]                                  // load 'index.js' files (`true` by default)
        filter : [String | RegExp | Function]               // filter pattern
        each   : [Function]                                 // callback to run after each module
    }

