'use strict';

var async = require('async');

module.exports = function (app) {

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
  }

  var mongoDs = app.dataSources.mongoDs;

  async.waterfall([
      function (callback) {
        callback(null, createUsers());
      },
      function (users, callback) {
        callback(null, createNotes(users));
      },
      function (users, callback) {
        callback(null, createReviews(users))
      }
    ]
  );


  function createUsers() {

    console.error('Creating roles and users');

    var User = app.models.User;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    var users = [];
    var roles = [
      {
        name: 'admin',
        users: [
          {
            email: 'admin@admin.com',
            username: 'admin',
            password: 'admin'
          }
        ]
      }, {
        name: 'users',
        users: [
          {
            email: 'user1@user.com',
            username: 'user1',
            password: 'user1'
          }, {
            email: 'user2@user.com',
            username: 'user2',
            password: 'user2'
          }, {
            email: 'user3@user.com',
            username: 'user3',
            password: 'user3'
          }, {
            email: 'user4@user.com',
            username: 'user4',
            password: 'user4'
          }, {
            email: 'user5@user.com',
            username: 'user5',
            password: 'user5'
          }
        ]
      }
    ];

    roles.forEach(function (role) {
      Role.create({
        name: role.name
      }, function (err, createdRole) {
        role.users.forEach(function (roleUser) {
          User.create(roleUser, function (err, createdUser) {
            if (err) console.log('error creating roleUser', err);
            createdRole.principals.create({
              principalType: RoleMapping.USER,
              principalId: createdUser.id
            }, function (err, rolePrincipal) {
              users.push(createdUser);
              //console.log(' -', rolePrincipal.id, "user :", createdUser.username, '/', roleUser.password, ", role", createdRole.name);
            });

          });
        });
      });
    });

    return users;
  }


  function createNotes(users, cb) {

    mongoDs.automigrate('Note', function (err) {
      console.log('Creating notes for', users.length, 'users ');

      if (err) return cb(err);
      var Note = app.models.Note;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      var notes = [];

      var i = 0;
      users.forEach(function (user) {
        notes.push({
          created: Date.now() - (DAY_IN_MILLISECONDS * i),
          title: 'Initial Note by ' + user.username,
          body: 'This is the Initial Note by ' + user.username,
          ownerId: user.id
        });
        i++;
      });

      Note.create(notes, cb);
    });
    return users;
  }


  //create coffee shops
  function createCoffeeShops(cb) {
    mongoDs.automigrate('CoffeeShop', function (err) {
      if (err) return cb(err);
      var CoffeeShop = app.models.CoffeeShop;
      CoffeeShop.create([
        {name: 'Bel Cafe', city: 'Vancouver'},
        {name: 'Three Bees Coffee House', city: 'San Mateo'},
        {name: 'Caffe Artigiano', city: 'Vancouver'},
      ], cb);
    });
  }

  function createReviews(users) {
    createCoffeeShops(function (cb, coffeeShops) {
      console.log('Creating reviews for', users.length, 'users and', coffeeShops.length, 'coffeeshops');
      mongoDs.automigrate('Review', function (err) {
        if (err) return cb(err);
        var Review = app.models.Review;
        var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
        Review.create([
          {
            date: Date.now() - (DAY_IN_MILLISECONDS * 4),
            rating: 5,
            comments: 'A very good coffee shop.',
            publisherId: 1,
            coffeeShopId: coffeeShops[0].id
          },
          {
            date: Date.now() - (DAY_IN_MILLISECONDS * 3),
            rating: 5,
            comments: 'Quite pleasant.',
            publisherId: 2,
            coffeeShopId: coffeeShops[0].id
          },
          {
            date: Date.now() - (DAY_IN_MILLISECONDS * 2),
            rating: 4,
            comments: 'It was ok.',
            publisherId: 3,
            coffeeShopId: coffeeShops[1].id
          },
          {
            date: Date.now() - (DAY_IN_MILLISECONDS),
            rating: 4,
            comments: 'I go here everyday.',
            publisherId: 4,
            coffeeShopId: coffeeShops[2].id
          }
        ], cb);
      });

    });
    return [];
  }
}
;
