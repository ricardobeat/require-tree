// Temporarily modify env for testing

var env = {};

exports.set = function (key, value) {
    env[key] = process.env[key]
    process.env[key] = value
}

exports.restore = function () {
    Object.keys(env).forEach(function(key){
        if (env[key] == null) {
            delete process.env[key]
        } else {
            process.env[key] = env[key]
        }
        delete env[key]
    })
}
