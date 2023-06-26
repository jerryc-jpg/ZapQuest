import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-light bg-secondary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <i className="fa-solid fa-charging-station"></i>
          <span className="ml-2">ZapQuest</span>
        </Link>
        {auth.username ? (
          <>
            <span className="navbar-text mr-2">
              Welcome, {auth.username}!
            </span>
            <button className="btn btn-dark" onClick={()=> dispatch(logout())}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-dark">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
