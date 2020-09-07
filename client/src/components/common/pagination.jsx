import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount <= 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <ul className="pagination col s12 center-align">
      {currentPage === 1 ? (
        <React.Fragment>
          <li className="disabled">
            <Link to="#">
              <i className="material-icons">first_page</i>
            </Link>
          </li>
          <li className="disabled">
            <Link to="#">
              <i className="material-icons">chevron_left</i>
            </Link>
          </li>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <li>
            <Link to="#" onClick={() => onPageChange(1)}>
              <i className="material-icons">first_page</i>
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => onPageChange(currentPage - 1)}>
              <i className="material-icons">chevron_left</i>
            </Link>
          </li>
        </React.Fragment>
      )}

      {pages.map((page) => (
        <li key={page} className={page === currentPage ? "active" : ""}>
          <Link to="#" onClick={() => onPageChange(page)}>
            {page}
          </Link>
        </li>
      ))}
      {currentPage === pagesCount ? (
        <React.Fragment>
          <li className="disabled">
            <Link to="#">
              <i className="material-icons">chevron_right</i>
            </Link>
          </li>
          <li className="disabled">
            <Link to="#">
              <i className="material-icons">last_page</i>
            </Link>
          </li>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <li>
            <Link to="#" onClick={() => onPageChange(currentPage + 1)}>
              <i className="material-icons">chevron_right</i>
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => onPageChange(pagesCount)}>
              <i className="material-icons">last_page</i>
            </Link>
          </li>
        </React.Fragment>
      )}
    </ul>
  );
};

export default Pagination;
