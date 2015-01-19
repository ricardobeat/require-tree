require-tree
============

![NPM](https://img.shields.io/npm/v/require-tree.svg?style=flat)

A `require()`-like method for directories, returning an object that mirrors the file tree.

    npm install require-tree

## Usage

Considering this file structure:

* models
  * user.js
  * page.js
  * item.js

Requiring the `models` directory will return an object containing each exported module:

```javascript
var require_tree = require('require-tree')
require_tree('./models')
/* {
    user: [object Object],
    page: [object Object],
    item: [object Object]
} */
```

Directories can be deeply nested, and`index.js` files are merged into their parent by default:

```javascript
// api/user.js:
module.exports = {
    profile: function(){},
    posts: function(){}
}

// api/pages/index.js:
module.exports = {
    list: function(){}
}

// api/pages/edit.js:
module.exports = {
    getPermissions: function(){},
    remove: function(){}
}

var api = require_tree('./api')
```

This will yield

- `api.user.profile`
- `api.user.posts`
- `api.pages.list`
- `api.pages.edit.getPermissions`
- `api.pages.edit.remove`

### Options

```javascript
require_tree(path, { options })
```

#### { name: string | function (exports) }

Use a property of the exports object as it's key (instead of the filename) in the final object.

```javascript
// models/user-model.js
module.exports = {
    id: 'user',
    attrs: {}
}

require_tree('./models', { name: 'id' })
require_tree('./models', { name: function (obj) { return obj.id } })
// => { user: { id: 'user', attrs: {} } }
```

#### { filter: string | regexp | function }

Filter the required files. Strings can use a wildcard '*' and are expanded into regular expressions. You can also provide your own RegExp, or a function that receives the filename as an argument, and returns `true` or `false`.

```javascript
require_tree('./path', { filter: '*-model' })
require_tree('./path', { filter: /^model/ })
require_tree('./path', { filter: function (filename) { return filename.indexOf('model') === 0 } })
```

#### { keys: string | array | regexp | function }

Use to return only certain keys from exported objects. 

```javascript
require_tree('./models', { keys: 'at*' })
require_tree('./models', { keys: ['attrs'] })
require_tree('./models', { keys: function (key){ return key.indexOf('attrs') >= 0 } })
// => { user: { attrs: {} } }
```

#### { each: function }

Callback to run after each file is required. Doesn't modify the exported object.

```javascript
require_tree('./items', { each: function (obj) { items.insert(obj) } })
```

#### { transform: function }

Same as `each`, but can modify the exports object.

```javascript
require_tree('./models', { transform: function (obj) { return new Model(obj) } })
```

#### index

  * `merge` (default): merges the `index.js` exports at the root of it's parent
  * `ignore`: causes `index.js` files to *not be loaded* at all
  * `preserve`: puts the `index.js` export object under the `.index` property

For backwards compatibility, a value of `true` is equal to `preserve`, while `false` is equal to `ignore`.

- controllers
  - index.js
  - users.js
  - ...

```javascript
// controllers/index.js:
module.exports = {
    init: function () { ... }
}

var controllers = require_tree('./controllers', { index: 'preserve' })
controllers.index.init()

var controllers = require_tree('./controllers', { index: 'ignore' })
controllers.index // undefined

var controllers = require_tree('./controllers', { index: 'merge' })
controllers.init()
```

### Limitations

`require-tree` must always be required in the local scope, never shared between modules or as a global. Paths are resolved relative to the parent module, like `require` itself, so it's behaviour depends on `module.parent` being set correctly. If necessary, you can use absolute paths (`__dirname + '/path'`) or set the `NODE_PATH` environment variable.
