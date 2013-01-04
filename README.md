require-tree
============

Create an object tree from file directories. Useful for mapping API trees or 
applications models/controllers.

Install
-------

    npm install require-tree

Usage
-----

    var require_tree = require('require-tree')

Assuming you have a file structure like this:

    /models
      user.js
      page.js
      item.js

You can require all models at once:

    require_tree('./models')

    /* => {
        user: [object Object],
        page: [object Object],
        item: [object Object]
    } */

It works with nested directories:

    /api
      /pages
        index.js
        edit.js
      user.js

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

    var pages = require_tree('./api')

    /* Result:
        pages.list
        pages.edit.getPermissions
        pages.edit.remove
        pages.user.profile
        pages.user.posts
    */

### Options

    {
        name  : [String | Function(exports, file)]         // the object's property to use as key
        main  : [String | Array | Function(exports, file)] // what keys should be exported
        index : [Boolean]                                  // load 'index.js' files (`true` by default)
        each  : [Function]                                 // callback to run after each module
    }
