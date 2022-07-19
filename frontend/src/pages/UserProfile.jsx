import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../components/Context";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Post from '../components/Post'
import cookie from 'js-cookie'
import Loading from "../components/Loading";

export default function UserProfile() {
  const { userId, userRole, setIsLoading, isLoading } = useContext(Context);
  const [user, setUser] = useState({});
  const [isUserPut, setIsUserPut] = useState(false);
  const [isPutForm, setIsPutForm] = useState(false);
  const [isPutPicture, setIsPutPicture] = useState(false);

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [imgErr, setImgErr] = useState({ type: "", erreur: "" });

  const [profileId, setProfileId] = useState(null);
  const [userPost, setUserPost] = useState([])

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.href.split("/profile/")[1];
    setProfileId(id);
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
    }).then((res) => {
      setIsUserPut(false);
      setUser(res.data);
    })
    .catch(err => console.log(err) )
  }, [profileId, isUserPut]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/posts`,
      withCredentials: true,
    }).then((res) => {
      const post = res.data
      const userPost = post.filter(post => post.userId === profileId)
      setUserPost(userPost);
    })
    .catch(err => console.log(err));
  }, [profileId]);



  // Yup object for control form
  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, "Votre prénom n'est pas renseigné")
      .matches("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$", "Prénom invalide"),

    function: Yup.string().max(50, "max 50 carac."),

    bio: Yup.string().max(500, "Votre desription est trop longue (500 carac. mac)"),
  });

  // validation form
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stock errors
  const { errors } = formState;

  function putUser(data) {

    setIsLoading(true)

    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
      data: {
        ...data,
      },
    }).then((res) => {
      setIsLoading(false)
      setIsUserPut(true);
      setIsPutForm(false);
      reset();
      console.log(res);
    });
  }

  function handlePutForm() {
    setIsPutForm((prevIsPutForm) => !prevIsPutForm);
  }

  function handlePutPicture() {
    setIsPutPicture((prevIsPutPicture) => !prevIsPutPicture);
  }

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;

        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };

      fileReader.readAsDataURL(file);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  // get user's file
  function handleFile(e) {
    const file = e.target.files[0];

    if (file.size > 5242880) {
      setImgErr({ type: "format", message: "Taille maximal: 5MB" });
      return imgErr;
    } else {
      setFile(file);
      setImgErr({ type: "", message: "" });
    }
  }

  function putUserPicture() {
    const formData = new FormData();
    formData.append("file", file);

    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}/upload`,
      withCredentials: true,
      data: formData,
    })
      .then((res) => {
        setIsUserPut(true);
        setIsPutPicture(false);
        reset();
        console.log(res);
      })
      .catch(() => setIsPutPicture(false));
  }

  const removeCookie = (key) => {
    if(window !== "undefined") {
        cookie.remove(key, {expires: 1});
    }
}


function deleteAllPostsUser() {

  userPost.map(post => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
      withCredentials: true,
    })
    .then((res) => console.log(res))
    .catch(err => console.log(err))
  })
}

  function deleteUser() {

    deleteAllPostsUser(); 

    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${userId}`,
      withCredentials: true,
    })
    .then((res) => {
      removeCookie('jwt')
      console.log(res)})
    
    window.location = '/'
  }

  const userPostElement = userPost.map((post) => {
    return <Post key={post._id} postId={post._id} />;
  });

  return (

    <main>
    <article className="user">
      {isPutPicture ? (
        <>
          <form
            onSubmit={handleSubmit(putUserPicture)}
            className="user--card__picture"
          >
            <input
              type="file"
              id="file"
              onChange={handleFile}
              className="user--card__input"
              accept="image/png, image/jpeg, image/jpg"
            />
            <label
              htmlFor="file"
              className="user--card__pictureBtn"
              aria-label="ajouter une image"
            >
              <i className="fa-regular fa-image"></i>
            </label>
            <button type="submit" className="user--card__pictureSubmit">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
            {fileDataURL ? (
              <div className="user--card__pictureImg">
                <img src={fileDataURL} alt="preview" />
              </div>
            ) : (
              <div className="user--card__pictureImg">
                <img
                  src={user.imageUrl}
                  alt="photo de profil"
                />
              </div>
            )}
          </form>
        </>
      ) : (
        user.imageUrl && ( isLoading ? <Loading /> :
          <div className="user--card__picture">
            <div className="user--card__pictureImg">
              <img
                src={user.imageUrl}
                alt="image du post"
              />
            </div>
            {userId === profileId || userRole==='admin' ?(
              <>
                <input
                  type="button"
                  onClick={handlePutPicture}
                  id="putPicture"
                  className="user--card__input"
                />
                <label htmlFor="putPicture" className="user--card__pictureBtn">
                  <i className="fa-solid fa-pencil"></i>
                </label>
              </>
            ): null}
          </div>
        )
      )}

      {isPutForm ? (
        <form onSubmit={handleSubmit(putUser)} className="user--card__form">
          <label className="user--card__formLabel" htmlFor="prenom">
            Prénom
          </label>
          <input
            id="prenom"
            type="text"
            {...register("firstName")}
            defaultValue={user.firstName}
            className="user--card__formInput"
          />
          <small className="user--card__formError"> {errors.firstName?.message}</small>
          <label className="user--card__formLabel" htmlFor="poste">
            Poste
          </label>
          <input
            id="poste"
            type="text"
            {...register("function")}
            defaultValue={user.function}
            className="user--card__formInput"
          />
           <small className="user--card__formError"> {errors.function?.message}</small>
          <label className="user--card__formLabel" htmlFor="bio">
            Bio
          </label>
          <textarea
            {...register("bio")}
            defaultValue={user.bio}
            className="user--card__formText"
            id="bio"
          />
           <small className="user--card__formError"> {errors.firstName?.bio}</small>

          <button type="submit" className="user--card__formSubmit">
            {" "}
            <i className="fa-solid fa-paper-plane"></i>{" "}
          </button>
        </form>
      ) : ( isLoading ? <Loading /> :
        <>
          <div className="user--card">
            <h1 className="user--card__name">{user.firstName}</h1>
            <h2 className="user--card__function">{user.function}</h2>
            <p className="user--card__bio">{user.bio}</p>
            {userId === profileId || userRole==='admin' ? (
              <div className="user--card__update">
                <input
                  type="button"
                  onClick={handlePutForm}
                  id="putBtn"
                  className="user--card__input"
                />
                <label htmlFor="putBtn" className="user--card__updateBtn">
                  <i className="fa-solid fa-pencil"></i>
                </label>
                <button onClick={deleteUser} className="user--card__updateBtn"> <i className="fa-solid fa-trash"></i> </button>
              </div>
            ): null }
          </div>
        </>
      )}

    </article>
    <div>
      {userPostElement}
    </div>
      </main>
    
  );
}
