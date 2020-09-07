import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../helper/auth";
import axios from "axios";
import { toast } from "react-toastify";
let userFromId;
if (isAuthenticated()) {
  const { _id } = JSON.parse(localStorage.getItem("user"));
  userFromId = _id;
}

const Subscribe = (props) => {
  let [subscribeVariables, setSubscribeVariables] = useState({
    userTo: "",
    userFrom: "",
  });
  let [subscribed, setSubscribed] = useState("");
  useEffect(() => {
    console.log(props.userId);
    if (isAuthenticated()) {
      setSubscribeVariables({ userTo: props.userId, userFrom: userFromId });
      axios
        .post("/api/subscribe/subscribed", {
          userTo: props.userId,
          userFrom: userFromId,
        })
        .then((response) => {
          if (response.data.success) {
            setSubscribed(response.data.subscribed);
          } else {
            toast.error("Failed to get Subscribed Information");
          }
        });
    }
  }, [props.userId]);

  const handleSubscribe = () => {
    if (!isAuthenticated()) {
      return toast.error("Please login");
    }
    if (subscribed) {
      axios.post("/api/subscribe/unfollow", subscribeVariables).then((res) => {
        if (res.data.success) {
          setSubscribed(!subscribed);
          props.onFollowersUpdate();
        } else {
          toast.error("Failed to Unsubscribe");
        }
      });
    } else {
      axios.post("/api/subscribe/follow", subscribeVariables).then((res) => {
        if (res.data.success) {
          setSubscribed(!subscribed);
          props.onFollowersUpdate();
        } else {
          toast.error("Failed to Subscribe");
        }
      });
    }
  };

  if (!isAuthenticated()) {
    return null;
  } else {
    if (userFromId === props.userId) {
      return null;
    } else {
      return (
        <button
          onClick={handleSubscribe}
          className={subscribed ? "btn grey" : "btn deep-orange"}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      );
    }
  }
};

export default Subscribe;
