
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

describe('when given a file tree', function(){

    it('returned object should match file structure', function(){
        var poa = require_tree('test/porto-alegre')
        assert.deepEqual(poa, {
            city: 'Porto Alegre'
          , bairros: bairros
        })
    })

})

describe('when given the index:false option', function(){

    it('should ignore index files', function(){
        var poa = require_tree('test/porto-alegre', { index: false })
        assert.deepEqual(poa, {
            bairros: bairros
        })
    })

})

describe('when given the each option', function(){

    it('should run once for each file', function(){
        var files = []
        function each(file){
            files.push(file)
        }
        var poa = require_tree('test/porto-alegre', { each: each })
        assert.equal(files.length, 3)
        assert.deepEqual(files, ['bomfim.js', 'santo-antonio.js', 'index.js'])
    })

})

describe('when given the name option', function(){

    describe('with a function', function(){

        it('should run once for each file', function(){
            var x = 0
            function increment(){ x++ }
            require_tree('test/porto-alegre/bairros', {
                name: increment
            })
            assert.equal(x, 2)
        })

        it('should define the exports name', function(){
            var bairros = require_tree('test/porto-alegre/bairros', {
                name: function(obj, file){
                    return file.toUpperCase()
                }
            })
            assert.ok(bairros['BOMFIM.JS'])
            assert.ok(bairros['SANTO-ANTONIO.JS'])
        })

        it('should be able to access the export object', function(){
            var bairros = require_tree('test/porto-alegre/bairros', {
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
            var bairros = require_tree('test/porto-alegre/bairros', {
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
            require_tree('test/porto-alegre/bairros', {
                main: increment
            })
            assert.equal(x, 2)
        })

        it('should define the export object', function(){
            var bairros = require_tree('test/porto-alegre/bairros', {
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
            var bairros = require_tree('test/porto-alegre/bairros', {
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
            var bairros = require_tree('test/porto-alegre/bairros', {
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
            var bairros = require_tree('test/porto-alegre/bairros', {
                main: 'zone'
            })
            assert.deepEqual(bairros, {
                'bomfim': 'd'
              , 'santo-antonio': 'w'
            })
        })

    })

})


