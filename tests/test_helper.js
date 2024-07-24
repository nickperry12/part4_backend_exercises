const Blog = require('../models/blog');

const initialBlogs = [
  {
    author: 'John Smith',
    title: 'Adventure blog',
    url: 'http://blog.adventures.com',
    likes: 4
  },
  {
    author: 'Eddie Hall',
    title: 'Powerlifter Chronicles vol. 4',
    url: 'http://blog.powerlifting.com',
    likes: 12
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

module.exports = {
  initialBlogs,
  blogsInDB
}