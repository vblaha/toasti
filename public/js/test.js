const expect = require('chai').expect;
const app = require('./app.js');

//christian test

//Unit
describe('average', function(){
    it('should return the average of ratings for recipe', function(){
        expect(app.average(4)).to.equal(4);
    });
})

//DOM/UI
// describe('ratingRender', function(){
//     it('should ')
// })

//****************Gina code starts*************************************
// const expect = require('chai').expect;
// const validateRecipe = require('./app.js').validateRecipe;
//Unit Test

describe('validateRecipe', function() {
    it('should return false if name is not a string ', function() {
        expect(validateRecipe(123,'mix ingredients', ['vodka','OJ'])).to.equal(false);
    });
    it('should return false if instruction is not a string ', function() {
        expect(validateRecipe('Screwdriver', [] , ['vodka','OJ'])).to.equal(false);
    });
    it('should return false if ingrdient is not an [] ', function() {
        expect(validateRecipe('Screwdriver','mix ingredients', 'OJ')).to.equal(false);
    });

    it('should return false if name is empty ', function() {
        expect(validateRecipe('','mix ingredients', ['vodka','OJ'])).to.equal(false);
    });
    it('should return false if description is empty ', function() {
        expect(validateRecipe('Screwdriver','', ['vodka','OJ'])).to.equal(false);
    });
    it('should return false if ingrdient is empty ', function() {
        expect(validateRecipe('Screwdriver','mix ingredients', [])).to.equal(false);
    });
    it('should return true for if above criteria are met ', function() {
        expect(validateRecipe('Screwdriver','mix ingredients', ['vodka','OJ'])).to.equal(true);
    });

  });

// Functional/DOM/UI Test
describe('add recipe', function () {
    let server;

    before(function() {
        server = sinon.fakeServer.create(),
        server.respondWith('POST', '/recipe', [
            200, { 'Content-Type': 'application/json'}, JSON.stringify({data})
        ]);
    });

    after(function () {
        server.restore();
    })

    it('should add recipe on click', function () {
        // assign values for input boxes
        $('#recipeName').val('Screwdriver');
        $('#instruction').val('Mix vodka and orange juice');
        $('#ingredient').val('1 cup vodka');
        $('#Ingredient2').val('1 1/2 cups orange juice');

        // mock server to handle Post
        server.respondWith('POST', '/recipe', [
            200, { 'Content-Type': 'application/json' }, JSON.stringify({result: 'success'})
          ]);
      
        //button trigger
        $('#btnAddRecipe').trigger('click');

        //get expect
        server.respond();
        expect($('#showResult').text()).to.equal('Successfully added!');
    })

    it('should not add existing recipe on click', function () {
        // assign values for input boxes
        $('#Name').val('Screwdriver');
        $('#Description').val('Mix vodka and orange juice');
        $('#Ingredient1').val('1 cup vodka');
        $('#Ingredient2').val('1 1/2 cups orange juice');

        // mock server to handle Post
        server.respondWith('POST', '/recipe', [
            200, { 'Content-Type': 'application/json' }, JSON.stringify({result: 'error'})
          ]);
      
        //button trigger
        $('#addRecipe').trigger('click');

        //get expect
        server.respond();
        expect($('#showResult').text()).to.equal('Oops, the recipe already exists! Try again.');
    })

    it('should add ingredient on click', function () {
      
        //button trigger
        $('#btnAddIngredient').trigger('click');

        //get Expect
        server.respond();
        expect($('.ingredient').length).to.be.gt(1);
    })

    it('should remove ingredient on click', function () {
      
        //button trigger
        $('#btnRemoveIngredient1').trigger('click');

        //get Expect
        server.respond();
        expect($('.ingredient').length).to.equal(1);
    })
})
//****************Gina code ends*************************************

describe('search', function () {

  let server;

  beforeEach(function () {
    server = sinon.fakeServer.create();
    total = 0;
  });

  afterEach(function () {
    server.restore();
  });

  it('should run search on click', function () {

    server.respondWith('GET', '/api/search', [
      200, { 'Content-Type': 'application/json' }, JSON.stringify([{
        instruction: 'Stir into glass over ice, garnish and serve',
        name: 'Negroni',
        ingredients: [
            { name: '1 oz Gin' },
            { name: '1 oz Campari' },
            { name: '1 oz Sweet Vermouth' }],
        // image: 'https://www.thecocktaildb.com/images/media/drink/tutwwv1439907127.jpg'
      }])
    ]);

    $('#search').trigger('submit');

    server.respond();
    expect($('#name-0').text()).to.equal('Negroni');
    expect($('#instruction-0').text()).to.equal('Stir into glass over ice, garnish and serve');
    expect($('#image-0').attr('src')).to.equal('https://www.thecocktaildb.com/images/media/drink/tutwwv1439907127.jpg');
    expect($('#ingredient-0').html()).to.equal('<ul><li>1 oz Gin</li><li>1 oz Campari</li><li>1 oz Sweet Vermouth</li></ul>');
    //may need to go back in and redo the ul structure
  });


});



