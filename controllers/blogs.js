const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor, tokenExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }
  
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  });

  const result = await blog.save();

  user.blogs = user.blogs.concat(result._id);
  await user.save();

  res.status(201).json(result);
});

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const id = req.params.id;
  const userId = req.user;

  const blog = await Blog.findById(id);
  console.log(userId);

  if (!blog.user || userId !== blog.user.toString()) {
    res.status(401).json({ error: 'You don\'t have access to that blog' });
  } else {
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  }
});

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const userId = req.user;
  const blog = await Blog.findById(id);

  if (!blog.user || userId !== blog.user.toString()) {
    res.status(401).json({ error: 'You don\'t have access to that blog' });
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    res.json(updatedBlog);
  }

});

module.exports = blogsRouter;