import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { attemptLogin } from "../store";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const login = (ev) => {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
    // Close the modal after clicking Login
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      modal.style.display = "none";
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
    }
  };

  return (
    <nav className="navbar navbar-light bg-secondary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <i className="fa-solid fa-charging-station"></i>
          <span className="ml-2">ZapQuest</span>
        </Link>
        {auth.username ? (
          <>
            <span className="navbar-text mr-2">Welcome, {auth.username}!</span>
            <button className="btn btn-dark" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-dark"
            data-toggle="modal"
            data-target="#loginModal"
          >
            Login
          </button>
        )}
      </div>
      {/* Login Modal */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="loginModalLabel"
      >
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="loginModalLabel">
                Login
              </h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={login}>
                <div className="form-group">
                  <label htmlFor="modalUsername">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modalUsername"
                    placeholder="Username"
                    name="username"
                    value={credentials.username}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modalPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="modalPassword"
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
