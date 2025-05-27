import "./Spinner.scss";

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="spinner__container">
      <div className="spinner" />
      {text && <p className="spinner__text">{text}</p>}
    </div>
  );
};

export default Spinner;
