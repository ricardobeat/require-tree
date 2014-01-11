
var assert       = require('assert')
  , require_tree = require('../')

var bairros = {
    bomfim: {
        name: 'Bom Fim'
      , rating: '*****'
      , zone: 'd'
    }
  , 'santo-antonio': {
        name: 'Santo Antônio'
      , rating: '***'
      , zone: 'w'
  }
}

var POA = {
    city: 'Porto Alegre'
  , bairros: bairros
}

var VERSIONED = {
    '1.0.0': {
        v1: 'success'
    }
}

describe('when given a file tree', function(){

    it('returned object should match file structure', function(){
        var poa = require_tree('./porto-alegre')
        assert.deepEqual(poa.bairros, bairros)
    })

    it('returned object should merge index into root object', function () {
        var poa = require_tree('./porto-alegre')
        assert.deepEqual(poa, POA)
    })

})

describe('folder name', function() {
    
    it('should be mapped as named in filesystem', function(){
        var versioned = require_tree('./dot-in-foldername')
        assert.deepEqual(versioned, VERSIONED)
    });
    
})

describe('paths', function(){

    it('should be relative to parent module', function(){
        var poa = require('./deep/test')
        assert.deepEqual(poa, POA)
    })

    it('should accept absolute paths', function(){
        var poa = require_tree(__dirname + '/porto-alegre')
        assert.deepEqual(poa, POA)
    })

    it('should resolve relative paths', function(){
        var poa = require_tree('../test/porto-alegre')
        assert.deepEqual(poa, POA)
    })

})

describe('when given the index:false option', function(){

    it('should ignore index files', function(){
        var poa = require_tree('./porto-alegre', { index: false })
        assert.deepEqual(poa, {
            bairros: bairros
        })
    })

})

describe('when given the each option', function(){

    it('should run once for each file', function(){
        var files = []
        function each(o, file, path){
            files.push(file)
        }
        var poa = require_tree('./porto-alegre', { each: each })
        assert.equal(files.length, 3)
        assert.deepEqual(files, ['bomfim.js', 'santo-antonio.js', 'index.js'])
    })

})

describe('when given the name option', function(){

    describe('with a function', function(){

        it('should run once for each file', function(){
            var x = 0
            function increment(){ x++ }
            require_tree('./porto-alegre/bairros', {
                name: increment
            })
            assert.equal(x, 2)
        })

        it('should define the exports name', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                name: function(obj, file){
                    return file.toUpperCase()
                }
            })
            assert.ok(bairros['BOMFIM.JS'])
            assert.ok(bairros['SANTO-ANTONIO.JS'])
        })

        it('should be able to access the export object', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                name: function(obj, file){
                    return obj.name
                }
            })
            assert.ok(bairros['Bom Fim'])
            assert.ok(bairros['Santo Antônio'])
        })

    })

    describe('with a string', function(){

        it('should use the string as key for the export name', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                name: 'name'
            })
            assert.ok(bairros['Bom Fim'])
            assert.ok(bairros['Santo Antônio'])
        })

    })

})

describe('when given the main option', function(){

    describe('with a function', function(){

        it('should run once for each file', function(){
            var x = 0
            function increment(){ x++ }
            require_tree('./porto-alegre/bairros', {
                main: increment
            })
            assert.equal(x, 2)
        })

        it('should define the export object', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                main: function(){
                    return { nil: null }
                }
            })
            assert.deepEqual(bairros, {
                'bomfim': { nil: null }
              , 'santo-antonio': { nil: null }
            })
        })

        it('should be able to access the export object', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                main: function(obj){
                    return obj.rating
                }
            })
            assert.deepEqual(bairros, {
                'bomfim': '*****'
              , 'santo-antonio': '***'
            })

        })

    })

    describe('with an array', function(){

        it ('should filter the exports object', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                main: ['rating', 'zone']
            })
            assert.deepEqual(bairros, {
                'bomfim': {
                    rating: '*****'
                  , zone: 'd'
                }
              , 'santo-antonio': {
                    rating: '***'
                  , zone: 'w'
              }
            })
        })

    })

    describe('with a string', function(){

        it('should filter the exports object', function(){
            var bairros = require_tree('./porto-alegre/bairros', {
                main: 'zone'
            })
            assert.deepEqual(bairros, {
                'bomfim': 'd'
              , 'santo-antonio': 'w'
            })
        })

    })

})

describe('when given the filter option', function(){

    describe('as a string', function () {

        it('should filter the required files', function(){
            var res = require_tree('./porto-alegre/bairros', {
                filter: 'bom'
            })
            assert.deepEqual(res.bomfim, bairros.bomfim)
            assert.deepEqual(Object.keys(res), ['bomfim'])
        })

    })

    describe('as a regular expression', function () {

        it('should filter the required files', function(){
            var res = require_tree('./porto-alegre/bairros', {
                filter: /^bo..im/
            })
            assert.deepEqual(res.bomfim, bairros.bomfim)
            assert.deepEqual(Object.keys(res), ['bomfim'])
        })

    })

    describe('as a function', function () {

        it('should filter the required files', function(){
            var res = require_tree('./porto-alegre/bairros', {
                filter: function (file) { return file.indexOf('bomfim') === 0 }
            })
            assert.deepEqual(res.bomfim, bairros.bomfim)
            assert.deepEqual(Object.keys(res), ['bomfim'])
        })

    })

})
