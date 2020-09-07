import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import M from "materialize-css";
const imageProf = require("../../../public/uploads/chef2.jpg");
let modal = document.querySelectorAll(".modal");
M.Modal.init(modal);

const Followings = (props) => {
  const [followingsNumber, setFollowingsNumber] = useState(0);
  const [followings, setFollowings] = useState([]);
  const [modalFollowings, setModalFollowings] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    axios.post("/api/subscribe/followings", { userTo: id }).then((response) => {
      if (response.data.success) {
        setFollowings(response.data.followings);
        setFollowingsNumber(response.data.followingsNumber);
        let sorted = response.data.followings;
        setModalFollowings(
          sorted.sort(function (a, b) {
            if (
              a.userTo.username.toLowerCase() > b.userTo.username.toLowerCase()
            ) {
              return -1;
            }
            if (
              a.userTo.username.toLowerCase() < b.userTo.username.toLowerCase()
            ) {
              return 1;
            }
            return 0;
          })
        );
      } else {
        toast.error("Failed to get subscriber Number");
      }
    });
  }, [props.newFollowing, id]);
  return (
    <Fragment>
      <ul className="collection with-header">
        <li className="collection-header">
          <a className="modal-trigger" href="#modal2">
            followings {followingsNumber}
          </a>
        </li>
        {followings
          .reverse()
          .slice(0, 5)
          .map((following, i) => (
            <li key={following._id} className="collection-item avatar">
              <Link to={("/account/", following.userTo._id)}>
                <img
                  src={
                    following.userTo.image !== ""
                      ? following.userTo.image
                      : imageProf
                  }
                  alt=""
                  className="circle"
                ></img>
                <span style={{ color: "black" }} className="title">
                  {following.userTo.username}
                </span>
                <p style={{ color: "black" }}>{following.userTo.email}</p>
              </Link>
            </li>
          ))}
      </ul>
      <div id="modal2" className="modal bottom-sheet">
        <div className="modal-content">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn red right"
          >
            Close
          </a>

          <h4>Followings: {modalFollowings.length}</h4>
          <p>Sorted by username</p>
          <ul className="collection">
            {modalFollowings.map((follower) => (
              <li key={follower._id} className="collection-item avatar">
                <Link to={("/account/", follower.userTo._id)}>
                  <img
                    src={
                      follower.userTo.image !== ""
                        ? follower.userTo.image
                        : imageProf
                    }
                    alt=""
                    className="circle"
                  ></img>
                  <span style={{ color: "black" }} className="title">
                    {follower.userTo.username}
                  </span>
                  <p style={{ color: "black" }}>{follower.userTo.email}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Followings;
