const SubmitButton = ({ label, loading = false }) => (
  <button type="submit" className="btn btn__primary" disabled={loading}>
    {label}
  </button>
);

export default SubmitButton;
