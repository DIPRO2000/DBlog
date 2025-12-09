// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MyblogApp {
    struct Post {
        bytes32 id;
        string author;
        string title;
        string contentHash;
        uint256 upvote;
        uint256 downvote;
        uint256 timestamp;
    }

    struct Comment {
        bytes32 id;
        address commenterAddress;
        string commenterName;
        string content;
        uint256 upvote;
        uint256 downvote;
        uint256 timestamp;
    }

    bytes32[] private allPostsIds;
    mapping(address => bytes32[]) private userPosts;
    mapping(bytes32 => Post) private posts;

    // Comments stored per post
    mapping(bytes32 => Comment[]) private postComments;

    // Post votes
    mapping(bytes32 => mapping(address => bool)) public hasUpVoted;
    mapping(bytes32 => mapping(address => bool)) public hasDownVoted;

    // Comment votes 
    mapping(bytes32 => mapping(address => bool)) public  hasUpVotedComment;
    mapping(bytes32 => mapping(address => bool)) public hasDownVotedComment;

    // Global comment lookup + user → comment list
    mapping(bytes32 => Comment) private commentById;
    mapping(address => bytes32[]) private userCommentIds;

    //Comment->Post Mapping
    mapping(bytes32 => bytes32) private CommentToPost;

    // Events

    event Postcreation(bytes32 indexed postId, string title, string author, uint256 timestamp);
    event PostVoted(bytes32 indexed postId, address indexed voter, bool isUpvote);
    event CommentAdded(
        bytes32 indexed postId,
        bytes32 indexed commentId,
        address commenterAddress,
        string commenterName,
        string content,
        uint256 timestamp
    );
    event CommentVoted(
        bytes32 indexed postId,
        bytes32 indexed commentId,
        address voter,
        bool isUpvote
    );

    // Create Post

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

    // Vote on Post

    function upvotePost(bytes32 _postId) public {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        require(!hasUpVoted[_postId][msg.sender], "Already upvoted.");

        posts[_postId].upvote++;
        hasUpVoted[_postId][msg.sender] = true;

        emit PostVoted(_postId, msg.sender, true);
    }

    function downvotePost(bytes32 _postId) public {
        require(posts[_postId].id != bytes32(0), "Post does not exist.");
        require(!hasDownVoted[_postId][msg.sender], "Already downvoted.");

        posts[_postId].downvote++;
        hasDownVoted[_postId][msg.sender] = true;

        emit PostVoted(_postId, msg.sender, false);
    }

    // Add Comment

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

        // global lookup
        commentById[commentId] = newComment;

        // store comment under user index
        userCommentIds[msg.sender].push(commentId);

        //map comment to post
        CommentToPost[commentId] = _postId;

        emit CommentAdded(_postId, commentId, msg.sender, _commenterName, _content, block.timestamp);
    }

    // Vote on Comment 

    function upvoteComment(bytes32 _postId, bytes32 _commentId) public {
        require(commentById[_commentId].id != bytes32(0), "Comment does not exist");
        require(!hasUpVotedComment[_commentId][msg.sender], "Already upvoted this comment");

        // Update both storage locations
        hasUpVotedComment[_commentId][msg.sender] = true;
        commentById[_commentId].upvote++;

        // Sync inside postComments array
        Comment[] storage arr = postComments[_postId];
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].id == _commentId) {
                arr[i].upvote++;
                break;
            }
        }

        emit CommentVoted(_postId, _commentId, msg.sender, true);
    }

    function downvoteComment(bytes32 _postId, bytes32 _commentId) public {
        require(commentById[_commentId].id != bytes32(0), "Comment does not exist");
        require(!hasDownVotedComment[_commentId][msg.sender], "Already downvoted this comment");

        hasDownVotedComment[_commentId][msg.sender] = true;
        commentById[_commentId].downvote++;

        Comment[] storage arr = postComments[_postId];
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i].id == _commentId) {
                arr[i].downvote++;
                break;
            }
        }

        emit CommentVoted(_postId, _commentId, msg.sender, false);
    }

    // Fetch Functions

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

    function getComments(bytes32 _postId) public view returns(Comment[] memory) {
        return postComments[_postId];
    }

    // Fetch all comments by a user

    function getCommentsByUser(address _user) public view returns (Comment[] memory) {
        bytes32[] memory ids = userCommentIds[_user];
        Comment[] memory result = new Comment[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = commentById[ids[i]];
        }

        return result;
    }

    //Fetch comment to PostId

    function getPostIdfromComment(bytes32 _commentId) public view returns(bytes32) {
        require(commentById[_commentId].id != bytes32(0), "Comment does not exist");
        return CommentToPost[_commentId];
    }
}
