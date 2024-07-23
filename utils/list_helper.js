const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogPosts) => {
  return blogPosts.reduce((accum, blogPost) => {
    return blogPost.likes + accum;
  }, 0)
};

const favoriteBlog = (blogPosts) => {
  let maxLikes = Math.max(...blogPosts.map(post => post.likes));

  return blogPosts.find(post => post.likes === maxLikes);
}

const mostBlogs = (blogPosts) => {
  blogPosts = _.sortBy(blogPosts, function(o) { return o.author });
  let maxCount = 0;
  let authorWithMost = null;
  let current = blogPosts[0].author;
  let count = 0;

  for (let i = 0; i < blogPosts.length; i ++) {
    let author = blogPosts[i].author;

    if (author === current) {
      count++;
    } else if (author !== current && count <= maxCount) {
      count = 1;
      current = author;
    } else if (author !== current && count > maxCount) {
      maxCount = count;
      authorWithMost = blogPosts[i - 1].author;
      current = author;
      count = 1;
    }

  }

  return { author: authorWithMost, blogs: maxCount };
}

const mostLikes = (blogPosts) => {
  blogPosts = _.sortBy(blogPosts, function(o) { return o.author });
  let maxCount = 0;
  let authorWithMost = null;
  let current = blogPosts[0].author;
  let count = 0;

  for (let i = 0; i < blogPosts.length; i ++) {
    let author = blogPosts[i].author;

    if (author === current) {
      count += blogPosts[i].likes;
    } else if (author !== current && count <= maxCount) {
      count = blogPosts[i].likes;
      current = author;
    } else if (author !== current && count > maxCount) {
      maxCount = count;
      authorWithMost = blogPosts[i - 1].author;
      current = author;
      count = blogPosts[i].likes;
    }

  }

  return { author: authorWithMost, likes: maxCount };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};