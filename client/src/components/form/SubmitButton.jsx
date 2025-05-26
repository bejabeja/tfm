const SubmitButton = ({ label, loading = false }) => {
  return (
    <button
      type="submit"
      className="btn btn__primary"
      disabled={loading}
      aria-busy={loading}
      aria-disabled={loading}
    >
      {loading ? "Loading..." : label}
    </button>
  );
};

export default SubmitButton;
