const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log('database cleared');

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog));

  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test('returns the correct amount of blog posts', async () => {
  const res = await api.get('/api/blogs');

  assert.strictEqual(res.body.length, 2);
});

test('successfully creates blog', async () => {
  const newBlog = {
    author: 'Tom Brady',
    title: 'Winning the Superbowl',
    url: 'http://blogs.tbarticles.com',
    likes: 200
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  const blogsAfter = await helper.blogsInDB();

  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1);
  
  const authors = blogsAfter.map(blog => blog.author);
  assert(authors.includes('Tom Brady'));
});

test('confirms new blogs without likes have a default value of 0', async () => {
  const newBlog = {
    author: 'Tom Brady',
    title: 'Winning the Superbowl',
    url: 'http://blogs.tbarticles.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAfter = await helper.blogsInDB();
  const latestBlog = blogsAfter[2];
  
  assert.strictEqual(latestBlog.likes, 0);
});

test('invalid blogs return status 400', async () => {
  const newBlog = {
    author: "Nick Perry"
  };

  const blogs = await helper.blogsInDB();

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  assert.strictEqual(blogs.length, 2);
});

after(async () => {
  mongoose.connection.close();
});

test('updated note is successfully updated', async () => {
  const blogsBefore = await helper.blogsInDB();
  const id = blogsBefore[0].id;

  const blog = {
    title: "New Blog",
    author: "Some author",
    url: "Some URL",
    likes: 0,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  const blogsAfter = await helper.blogsInDB();

  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200);

  assert.strictEqual(blogsAfter[0].author, 'Some author');
})