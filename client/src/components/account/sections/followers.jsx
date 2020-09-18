import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import M from "materialize-css";

const imageProf = require("../../../public/uploads/chef2.jpg");
const Followers = (props) => {
  const [followersNumber, setFollowersNumber] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [modalFollowers, setModalFollowers] = useState([]);
  const { id } = useParams();
  let modal = document.querySelectorAll(".modal");
  M.Modal.init(modal);
  useEffect(() => {
    axios.post("/api/subscribe/followers", { userTo: id }).then((response) => {
      if (response.data.success) {
        setFollowers(response.data.followers);
        setFollowersNumber(response.data.followersNumber);
        let sorted = response.data.followers;
        sorted.sort(function (a, b) {
          if (
            a.userFrom.username.toLowerCase() <
            b.userFrom.username.toLowerCase()
          ) {
            return -1;
          }
          if (
            a.userFrom.username.toLowerCase() >
            b.userFrom.username.toLowerCase()
          ) {
            return 1;
          }
          return 0;
        });
        setModalFollowers(sorted);
      } else {
        toast.error("Failed to get subscriber Number");
      }
    });
  }, [props.newFollower, id]);

  return (
    <Fragment>
      <ul className="collection with-header">
        <li className="collection-header">
          <a className="modal-trigger" href="#modal1">
            Followers {followersNumber}
          </a>
        </li>
        {followers.slice(0, 3).map((follower) => (
          <li key={follower._id} className="collection-item avatar">
            <Link to={("/account/", follower.userFrom._id)}>
              <img
                src={
                  follower.userFrom.image !== ""
                    ? follower.userFrom.image
                    : imageProf
                }
                alt=""
                className="circle"
              ></img>
              <span style={{ color: "black" }} className="title">
                {follower.userFrom.username}
              </span>
              <p style={{ color: "black" }}>{follower.userFrom.email}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div id="modal1" className="modal bottom-sheet">
        <div className="modal-content">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn red right"
          >
            Close
          </a>

          <h4>Followers: {modalFollowers.length}</h4>
          <p>Sorted by username</p>
          <ul className="collection">
            {modalFollowers.map((follower) => (
              <li key={follower._id} className="collection-item avatar">
                <Link to={("/account/", follower.userFrom._id)}>
                  <img
                    src={
                      follower.userFrom.image !== ""
                        ? follower.userFrom.image
                        : imageProf
                    }
                    alt=""
                    className="circle"
                  ></img>
                  <span style={{ color: "black" }} className="title">
                    {follower.userFrom.username}
                  </span>
                  <p style={{ color: "black" }}>{follower.userFrom.email}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer"></div>
      </div>
    </Fragment>
  );
};

export default Followers;
