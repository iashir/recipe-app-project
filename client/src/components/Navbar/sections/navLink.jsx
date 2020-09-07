import React from "react";
import { Link, useLocation } from "react-router-dom";
const NavLink = ({ pathname, className, name, onLogout, onCloseNav }) => {
  const location = useLocation();
  return (
    <li
      className={
        location.pathname.includes(pathname) && pathname !== "" ? "active" : ""
      }
      onClick={onCloseNav}
    >
      <Link onClick={onLogout} to={pathname}>
        <i className={className} aria-hidden="true"></i> {name}
      </Link>
    </li>
  );
};

export default NavLink;
