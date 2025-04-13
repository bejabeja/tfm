import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
