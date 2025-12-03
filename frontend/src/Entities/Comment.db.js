// mock comment data

const mockComments = [
  {
    id: "c1",
    post_id: "1",
    username: "Alice",
    text: "Great post!",
    likes: 2,
    dislikes: 0,
  },
  {
    id: "c2",
    post_id: "1",
    username: "Bob",
    text: "Very informative.",
    likes: 1,
    dislikes: 0,
  },
  {
    id: "c3",
    post_id: "2",
    username: "Charlie",
    text: "Interesting thoughts!",
    likes: 3,
    dislikes: 1,
  }
];

const Commentdb = {
  list: async () => {
    return mockComments;
  },

  listByPostId: async (postId) => {
    return mockComments.filter((c) => c.post_id === postId);
  }
};

export default Commentdb;
