import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton.jsx";
import UsersSection from "../../components/users/UsersSection.jsx";
import useDebouncedEffect from "../../hooks/useDebounced.js";
import { selectIsAuthenticated } from "../../store/auth/authSelectors.js";
import { initAllUsers, loadMoreUsers } from "../../store/users/usersActions";
import {
  selectAllUsers,
  selectAllUsersCurrentPage,
  selectAllUsersError,
  selectAllUsersLoading,
  selectAllUsersLoadingMore,
  selectAllUsersTotalPages,
} from "../../store/users/usersSelectors";

const Community = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectAllUsersLoading);
  const loadingMore = useSelector(selectAllUsersLoadingMore);
  const error = useSelector(selectAllUsersError);
  const currentPage = useSelector(selectAllUsersCurrentPage);
  const totalPages = useSelector(selectAllUsersTotalPages);

  const [searchName, setSearchName] = useState("");
  const loadMoreRef = useRef(null);
  const hasMore = currentPage < totalPages;

  const handleLoadMore = () => {
    if (hasMore) {
      dispatch(loadMoreUsers(currentPage + 1));
    }
  };

  const handleRetry = () => dispatch(initAllUsers({ searchName, page: 1 }));
  const handleFilterChange = (e) => setSearchName(e.target.value);
  const handleReset = () => setSearchName("");

  useDebouncedEffect(
    () => {
      if (isAuthenticated) {
        dispatch(initAllUsers({ searchName, page: 1 }));
      }
    },
    [searchName],
    400
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(initAllUsers({ page: 1 }));
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <section className="explore section__container">
        <div className="explore__results">
          <UsersSection users={users} isLoading={loading} />
          <div className="explore__results-ctas">
            <p>Join the community to see more users.</p>
            <button
              className="btn btn__secondary"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="explore section__container">
      <Filters
        searchName={searchName}
        handleFilterChange={handleFilterChange}
        handleReset={handleReset}
      />

      <div className="explore__results">
        <p>
          Showing users{" "}
          {searchName ? `matching "${searchName}"` : "from the community"}
        </p>

        {error && (
          <div className="explore__error">
            <p className="error-message">
              Oops! Something went wrong while loading users.
            </p>
            <button className="btn btn__danger-outline" onClick={handleRetry}>
              Try again
            </button>
          </div>
        )}

        {!users?.length && !loading && !error && (
          <div className="explore__no-results">
            <p>No users found with that name.</p>
            <p>Try adjusting your search.</p>
          </div>
        )}

        <UsersSection users={users} isLoading={loading && !users?.length} />

        {hasMore && (
          <div ref={loadMoreRef} className="explore__results-ctas">
            <LoadingButton onClick={handleLoadMore} isLoading={loadingMore}>
              Load More
            </LoadingButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default Community;

const Filters = ({ searchName, handleFilterChange, handleReset }) => (
  <div className="explore__filters">
    <label>
      Search by username:
      <input
        type="text"
        name="searchName"
        value={searchName}
        placeholder="Search users..."
        onChange={handleFilterChange}
      />
    </label>

    <button onClick={handleReset} className="btn btn__primary">
      Reset Filters
    </button>
  </div>
);
