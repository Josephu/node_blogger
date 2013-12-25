var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: { type: String, trim: true, require: true},
  body: { type: String},
  author: { type: String, ref: 'User'},
  created: { type: Date, default: Date.now}
});

var lifecycle = require('mongoose-lifecycle');
schema.plugin(lifecycle);

Post = mongoose.model('Post', schema);

Post.on('afterInsert', function(post){
  url = "http://localhost:3000/posts/"+post._id;
  console.log('Jimmy\'s new post: '+url);
});
