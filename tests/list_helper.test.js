const { test, describe } = require('node:test');
const assert = require('node:assert');
const _ = require('lodash');

const dummy = require('../utils/list_helper').dummy;
const totalLikes = require('../utils/list_helper').totalLikes;
const favoriteBlog = require('../utils/list_helper').favoriteBlog;
const mostBlogs = require('../utils/list_helper').mostBlogs;
const mostLikes = require('../utils/list_helper').mostLikes;

const blogPosts = [
  {
    title: 'LS Blog',
    author: 'Nick Perry',
    url: 'http://someblog.com',
    likes: 10,
  },
  {
    title: 'LS Blog 3',
    author: 'Some dude',
    url: 'http://someblog.com',
    likes: 20,
  },
  {
    title: 'LS Blog 4',
    author: 'Another dude',
    url: 'http://someblog.com',
    likes: 20,
  },
  {
    title: 'LS Blog 12',
    author: 'Some dude',
    url: 'http://someblog.com',
    likes: 20,
  },
  {
    title: 'LS Blog 15',
    author: 'Nick Perry',
    url: 'http://someblog.com',
    likes: 20,
  },
  {
    title: 'LS Blog 11',
    author: 'Nick Perry',
    url: 'http://someblog.com',
    likes: 20,
  }
];

describe('dummy', () => {
  test('returns 1', () => {
    assert.strictEqual(dummy([]), 1);
  })
});

describe('totalLikes', () => {
  test('returns 10', () => {
    const blogPosts = [
      {
        title: 'LS Blog',
        author: 'Nick Perry',
        url: 'http://someblog.com',
        likes: 10,
      }
    ];

    assert.strictEqual(totalLikes(blogPosts), 10);
  });

  test('returns 20', () => {
    const blogPosts = [
      {
        title: 'LS Blog',
        author: 'Nick Perry',
        url: 'http://someblog.com',
        likes: 10,
      },
      {
        title: 'LS Blog 2',
        author: 'Nick Perry',
        url: 'http://someblog.com',
        likes: 10,
      }
    ];

    assert.strictEqual(totalLikes(blogPosts), 20);
  });
});

describe('favorite blog', () => {
  test('in a list of 3, the favorite blog has 20 likes', () => {
    const blogPosts = [
      {
        title: 'LS Blog',
        author: 'Nick Perry',
        url: 'http://someblog.com',
        likes: 10,
      },
      {
        title: 'LS Blog 2',
        author: 'Nick Perry',
        url: 'http://someblog.com',
        likes: 20,
      }
    ];

    assert.strictEqual(favoriteBlog(blogPosts), blogPosts[1]);
  });
});

describe('mostBlogs', () => {
  test('an author with 3 blogs returns his name and 3', () => {
    assert.deepStrictEqual(
      mostBlogs(blogPosts),
      { author: 'Nick Perry', blogs: 3 }
    );
  });
});

describe('mostLikes', () => {
  test('testing for most likes', () => {
    assert.deepStrictEqual(
      mostLikes(blogPosts),
      { author: 'Nick Perry', likes: 50}
    )
  })
});