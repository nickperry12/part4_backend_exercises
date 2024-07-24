const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(body.userId);

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

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  const userId = decodedToken.id;

  if (!decodedToken.id) {
    res.status(401).json({ error: 'invalid token' });
  }

  const blog = await Blog.findById(id);
  
  if (userId.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(401).json({ error: 'blog does not belong' })
  }

})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  res.json(updatedBlog);
});

module.exports = blogsRouter;