import React from "react";
import "./Spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner-loader-container">
      <div className="spinner-loader">
        <img src="/loaderSpinner.gif" alt="Loading..." />
        <p>LOADING...</p>
      </div>
    </div>
  );
};

export default Spinner;
