import React, { useState, useContext} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Context } from "../Context";
import FormComment from "./FormComment";

export default function Comment(props) {
  // import du context
  const { userId, userRole, setPostUpdate } = useContext(Context);

  //Etat qui permet d'afficher le formulaire pour modifier le commentaire
  const [isPut, setIsPut] = useState(false);

  // fonction qui permet d'afficher et de masquer le formulaire de modification du commentaire
  function handlePut() {
    setIsPut((prevIsPut) => !prevIsPut);
  }

  // requête axios pour supprimer le commentaire
  function deleteComment() {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
      },
    })
      .then(() => {
        // mise à jour du post
        setPostUpdate(true);
      })
      .catch((err) => console.log(err));
  }

  // requête pour la modification d'un commentaire
  function putComment(data) {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
      withCredentials: true,
      data: {
        commentId: props.comment._id,
        text: data.text,
      },
    })
      .then(() => {
        // mise à jour du post
        setPostUpdate(true);
        setIsPut(false);
      })
      .catch((err) => console.log(err));
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
                <h3 className="post--header__userName">
                  <Link to={`/profile/${user._id}`} id="userLink">
                    {user.firstName}
                  </Link>
                </h3>
              </div>
            );
          }
        })}
        {userId === props.comment.commenterId || userRole === "admin" ? (
          <div className="comment--header__btn">
            <button className="comment--header__btnModify" onClick={handlePut}>
              <i className="fa-solid fa-pencil"> </i>
            </button>
            <button
              className="comment--header__btnDelete"
              onClick={deleteComment}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ) : null}
      </div>
      {/* si l'utilisateur clique sur le bouton modifié, modification de l'état isPut et affichage du component formComment*/}
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
