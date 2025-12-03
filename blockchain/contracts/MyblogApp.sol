// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MyblogApp {
    struct Post {
        bytes32 id;
        string author;      // Name of the author
        string title;
        string contentHash; // IPFS hash
        uint256 upvote;
        uint256 downvote;
        uint256 timestamp;
    }

    struct Comment {
        bytes32 id;
        address commenterAddress;
        string commenterName; // Name of the commenter
        string content;
        uint256 upvote;
        uint256 downvote;
        uint256 timestamp;
    }

    // Post storage
    bytes32[] private allPostsIds;
    mapping(address => bytes32[]) private userPosts;
    mapping(bytes32 => Post) private posts;

    // Comment storage
    mapping(bytes32 => Comment[]) private postComments; // postId => array of comments
    mapping(bytes32 => mapping(address => bool)) private hasVoted; // post votes
    mapping(bytes32 => mapping(address => mapping(uint => bool))) private hasVotedComment; // comment votes

    // Events
    event Postcreation(bytes32 indexed postId, string title, string author, uint256 timestamp);
    event PostVoted(bytes32 indexed postId, address indexed voter, bool isUpvote);
    event CommentAdded(bytes32 indexed postId, bytes32 indexed commentId, address commenterAddress, string commenterName, string content, uint256 timestamp);
    event CommentVoted(bytes32 indexed postId, bytes32 indexed commentId, address voter, bool isUpvote);

    // Create a new post
    function createPost(string memory _author, string memory _title, string memory _contentHash) public {
        require(bytes(_author).length <= 32, "Author name too long");

        bytes32 _id = keccak256(abi.encodePacked(msg.sender, block.timestamp, _title, _contentHash));
        Post memory newpost = Post({
            id: _id,
            author: _author,
            title: _title,
            contentHash: _contentHash,
            upvote: 0,
            downvote: 0,
            timestamp: block.timestamp
        });

        allPostsIds.push(_id);
        userPosts[msg.sender].push(_id);
        posts[_id] = newpost;

        emit Postcreation(_id, _title, _author, block.timestamp);
    }

    // Upvote/Downvote post
    function upvotePost(bytes32 _postId) public {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        require(!hasVoted[_postId][msg.sender], "Already voted on this post.");
        posts[_postId].upvote++;
        hasVoted[_postId][msg.sender] = true;
        emit PostVoted(_postId, msg.sender, true);
    }

    function downvotePost(bytes32 _postId) public {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        require(!hasVoted[_postId][msg.sender], "Already voted on this post.");
        posts[_postId].downvote++;
        hasVoted[_postId][msg.sender] = true;
        emit PostVoted(_postId, msg.sender, false);
    }

    // Add comment to post
    function addComment(bytes32 _postId, string memory _commenterName, string memory _content) public {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        require(bytes(_commenterName).length <= 32, "Commenter name too long");

        bytes32 commentId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _content));
        Comment memory newComment = Comment({
            id: commentId,
            commenterAddress: msg.sender,
            commenterName: _commenterName,
            content: _content,
            upvote: 0,
            downvote: 0,
            timestamp: block.timestamp
        });

        postComments[_postId].push(newComment);

        emit CommentAdded(_postId, commentId, msg.sender, _commenterName, _content, block.timestamp);
    }

    // Upvote/Downvote comment
    function upvoteComment(bytes32 _postId, uint _commentIndex) public {
        require(_commentIndex < postComments[_postId].length, "Comment does not exist");
        require(!hasVotedComment[_postId][msg.sender][_commentIndex], "Already voted on this comment");

        postComments[_postId][_commentIndex].upvote++;
        hasVotedComment[_postId][msg.sender][_commentIndex] = true;

        emit CommentVoted(_postId, postComments[_postId][_commentIndex].id, msg.sender, true);
    }

    function downvoteComment(bytes32 _postId, uint _commentIndex) public {
        require(_commentIndex < postComments[_postId].length, "Comment does not exist");
        require(!hasVotedComment[_postId][msg.sender][_commentIndex], "Already voted on this comment");

        postComments[_postId][_commentIndex].downvote++;
        hasVotedComment[_postId][msg.sender][_commentIndex] = true;

        emit CommentVoted(_postId, postComments[_postId][_commentIndex].id, msg.sender, false);
    }

    // Fetch posts
    function getAllPosts() public view returns(Post[] memory) {
        Post[] memory allPosts = new Post[](allPostsIds.length);
        for(uint i = 0; i < allPostsIds.length; i++) {
            allPosts[i] = posts[allPostsIds[i]];
        }
        return allPosts;
    }

    function getAllPostsOfUser(address _user) public view returns(Post[] memory) {
        bytes32[] memory userPostIds = userPosts[_user];
        Post[] memory allPosts = new Post[](userPostIds.length);
        for (uint i = 0; i < userPostIds.length; i++) {
            allPosts[i] = posts[userPostIds[i]];
        }
        return allPosts;
    }

    // NEW: Fetch a single post by ID
    function getPostById(bytes32 _postId) public view returns (
        bytes32 id,
        string memory author,
        string memory title,
        string memory contentHash,
        uint256 upvote,
        uint256 downvote,
        uint256 timestamp
    ) {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        Post memory p = posts[_postId];
        return (p.id, p.author, p.title, p.contentHash, p.upvote, p.downvote, p.timestamp);
    }

    // Fetch comments of a post
    function getComments(bytes32 _postId) public view returns(Comment[] memory) {
        return postComments[_postId];
    }
}
