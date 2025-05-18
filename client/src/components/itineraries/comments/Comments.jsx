import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addComment,
  getCommentsByItineraryId,
} from "../../../services/comments";
import "./Comments.scss";

const Comments = ({ itineraryId, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByItineraryId(itineraryId);
      setComments(response);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    if (itineraryId) fetchComments();
  }, [itineraryId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await addComment(itineraryId, newComment);
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments">
      <h1 className="comments__title">Comments</h1>

      <div className="comments__list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment__avatar">
                {comment.user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="comment__body">
                <strong>@{comment.user?.username}</strong>
                <p>{comment.content}</p>
                <span className="comment__timestamp">{comment.postedAgo}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {isAuthenticated ? (
        <div className="comments__form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="btn btn__primary"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <div className="comments__login-message">
          <p>
            You must <Link to="/login">log in</Link> to post a comment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Comments;
