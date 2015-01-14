module.exports = function (user) {

  user.afterRemote('create', function (context, user, next) {
    console.log('> user.afterRemote triggered');
    //console.log(context);
    console.log(user);
    next();
  });


};
