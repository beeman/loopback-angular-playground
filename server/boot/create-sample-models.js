var async = require('async');

module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs;
  var mysqlDs = app.dataSources.mysqlDs;

  //create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops),
  }, function(err, results) {
    if (err) throw err;
    createReviews(results.reviewers, results.coffeeShops, function(err) {
      console.log('> reviews created sucessfully');
    });
    createNotes(results.reviewers, function(err) {
      console.log('> notes created sucessfully');
    });
  });

  //create reviewers
  function createReviewers(cb) {
    mysqlDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {email: 'foo@bar.com', password: 'foobar'},
        {email: 'john@doe.com', password: 'johndoe'},
        {email: 'jane@doe.com', password: 'janedoe'}
      ], cb);
    });
  }

  //create coffee shops
  function createCoffeeShops(cb) {
    mongoDs.automigrate('CoffeeShop', function(err) {
      if (err) return cb(err);
      var CoffeeShop = app.models.CoffeeShop;
      CoffeeShop.create([
        {name: 'Bel Cafe', city: 'Vancouver'},
        {name: 'Three Bees Coffee House', city: 'San Mateo'},
        {name: 'Caffe Artigiano', city: 'Vancouver'},
      ], cb);
    });
  }

  //create reviews
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: reviewers[2].id,
        }
      ], cb);
    });
  }

  //create notes
  function createNotes(owners, cb) {
    mongoDs.automigrate('Note', function(err) {
      if (err) return cb(err);
      var Note = app.models.Note;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Note.create([
        {
          created: Date.now() - (DAY_IN_MILLISECONDS * 4),
          title: 'Initial Note by ' + owners[0].email,
          body: 'This is the Initial Note.',
          ownerId: owners[0].id
        },
        {
          created: Date.now() - (DAY_IN_MILLISECONDS * 2),
          title: 'Initial Note by ' + owners[1].email,
          body: 'This is the Initial Note.',
          ownerId: owners[1].id
        }
    ], cb);
    });
  }

};
