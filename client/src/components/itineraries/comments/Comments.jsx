import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addComment,
  deleteComment,
  getCommentsByItineraryId,
} from "../../../services/comments";
import { selectMe } from "../../../store/user/userInfoSelectors";
import Modal from "../../modal/Modal";
import "./Comments.scss";

const Comments = ({ itineraryId, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const userMe = useSelector(selectMe);

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

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
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
                {isAuthenticated && comment.user?.id === userMe?.id && (
                  <div>
                    <button
                      className="comment__delete"
                      onClick={(e) => {
                        e.preventDefault();
                        setCommentToDelete(comment.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={async () => {
          if (commentToDelete) {
            await handleDeleteComment(commentToDelete);
            setIsModalOpen(false);
            setCommentToDelete(null);
          }
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Comments;
