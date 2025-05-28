import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "../../components/LoadingButton.jsx";
import UsersSection from "../../components/users/UsersSection.jsx";
import useDebouncedEffect from "../../hooks/useDebounced.js";
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

  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectAllUsersLoading);
  const loadingMore = useSelector(selectAllUsersLoadingMore);
  const error = useSelector(selectAllUsersError);

  const currentPage = useSelector(selectAllUsersCurrentPage);
  const totalPages = useSelector(selectAllUsersTotalPages);
  const [searchName, setSearchName] = useState("");

  const loadMoreRef = useRef(null);

  useEffect(() => {
    dispatch(initAllUsers({ searchName, page: 1 }));
  }, [dispatch, searchName]);

  useDebouncedEffect(
    () => {
      dispatch(initAllUsers({ searchName, page: 1 }));
    },
    [searchName],
    400
  );

  const handleFilterChange = (e) => setSearchName(e.target.value);
  const handleReset = () => setSearchName("");
  const handleRetry = () => dispatch(initAllUsers({ searchName, page: 1 }));

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(loadMoreUsers(currentPage + 1));
    }
  };

  const hasMore = currentPage < totalPages;

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

        {error ? (
          <div className="explore__error">
            <p className="error-message">
              Oops! Something went wrong while loading users.
            </p>
            <button className="btn btn__danger-outline" onClick={handleRetry}>
              Try again
            </button>
          </div>
        ) : users?.length === 0 && !loading ? (
          <div className="explore__no-results">
            <p>No users found with that name.</p>
            <p>Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <UsersSection
              users={users}
              isLoading={loading && users?.length === 0}
            />
            {hasMore && (
              <div ref={loadMoreRef} className="explore__results-ctas">
                <LoadingButton onClick={handleLoadMore} isLoading={loadingMore}>
                  Load More
                </LoadingButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Community;

const Filters = ({ searchName, handleFilterChange, handleReset }) => {
  return (
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
};
