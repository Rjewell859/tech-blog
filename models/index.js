const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment')

User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Comment.belongsToMany(User, {
  through: 'User',
  foreignKey: 'user_id'

})

Comment.belongsToMany(Blog, {
  through: 'User'

})

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

Blog.hasMany(Comment, {

  foreignKey: 'blog_id',
  onDelete: 'CASCADE'
})




module.exports = { User, Blog, Comment };
