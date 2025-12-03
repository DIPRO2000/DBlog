// simple mock posts

const mockPosts = [
  {
    id: "1",
    title: "First Post",
    excerpt: "This is a mock excerpt",
    content: "Mock content",
    author: "Admin",
    cover_image: "",
    likes: 5,
    dislikes: 1,
    tags: ["mock"],
    created_date: Date.now()
  },
  {
    id: "2",
    title: "Second Post",
    excerpt: "Another sample post",
    content: "More mock content",
    author: "User",
    cover_image: "",
    likes: 3,
    dislikes: 0,
    tags: ["sample"],
    created_date: Date.now() - 5000
  }
];

const Postdb = {
  list: async (sort = "", limit = 6) => {
    let posts = [...mockPosts];

    if (sort === "-created_date") {
      posts.sort((a, b) => b.created_date - a.created_date);
    }

    return posts.slice(0, limit);
  }
};

export default Postdb;
