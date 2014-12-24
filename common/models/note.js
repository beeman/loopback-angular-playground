module.exports = function(Note) {
  //remote hook
  Note.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    req.body.created = Date.now();
    req.body.ownerId = req.accessToken.userId;
    next();
  });
};
