import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Context";
import FormComment from "./FormComment";

export default function Comment(props) {
  const { userId, userRole, setPostUpdate } = useContext(Context);
  const [isPut, setIsPut] = useState(false);

  function handlePut() {
    setIsPut((prevIsPut) => !prevIsPut);
  }

  console.log(isPut);

  function deleteComment() {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
      },
    }).then(() => {
      setPostUpdate(true);
    });
  }

  function putComment(data) {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
        text: data.text,
      },
    }).then((res) => {
      console.log(res);
      setPostUpdate(true);
      setIsPut(false);
    });
  }

  return (
    <div className="comment">
      <div className="comment--header">
        {props.users.map((user) => {
          if (user._id === props.comment.commenterId) {
            return (
              <div className="comment--header__user" key={props.comment._id}>
                <img
                  className="comment--header__userImg"
                  src={user.imageUrl}
                  alt="photo de profil"
                />
                <Link to={`/profile/${user._id}`} key={user._id} id='userLink'>
                           <h3 className="post--header__userName">{user.firstName}</h3>
                </Link>
              </div>
            );
          }
        })}

        {userId === props.comment.commenterId || userRole === 'admin' ? (
          <div className="comment--header__btn">
            <button className="comment--header__btnModify" onClick={handlePut}>
              {" "}
              <i className="fa-solid fa-pencil"> </i>{" "}
            </button>
            <button
              className="comment--header__btnDelete"
              onClick={deleteComment}
            >
              {" "}
              <i className="fa-solid fa-xmark"></i>{" "}
            </button>
          </div> 
        ) : null }
      </div>

      {isPut ? (
        <FormComment
          isPut={isPut}
          comment={props.comment}
          postId={props.postId}
          putComment={putComment}
        />
      ) : (
        <p className="comment--message">{props.comment.text}</p>
      )}
    </div>
  );
}
