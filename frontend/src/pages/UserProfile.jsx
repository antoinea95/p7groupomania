import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../components/Context";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";

export default function UserProfile() {
  const { userId } = useContext(Context);
  const [user, setUser] = useState({});
  const [isUserPut, setIsUserPut] = useState(false);
  const [isPutForm, setIsPutForm] = useState(false);
  const [isPutPicture, setIsPutPicture] = useState(false);

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [imgErr, setImgErr] = useState({ type: "", erreur: "" });

  const [profileId, setProfileId] = useState(null);

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
    });
  }, [profileId, isUserPut]);

  // Yup object for control form
  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, "Le poste n'est pas renseigné")
      .matches("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$", "Prénom invalide"),

    function: Yup.string().max(50, "max 50 carac."),

    bio: Yup.string().max(500, "Votre desription est trop longue"),
  });

  // validation form
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
  });

  // stock errors
  const { errors } = formState;

  function putUser(data) {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/auth/user/${profileId}`,
      withCredentials: true,
      data: {
        ...data,
      },
    }).then((res) => {
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
    }).then((res) => {
      setIsUserPut(true);
      setIsPutPicture(false);
      reset();
      console.log(res);
    });
  }

  return (
    <article className="user">
         {isPutPicture ? (
            <>
              <form onSubmit={handleSubmit(putUserPicture)} className='user--card__picture'>
                <input
                  type="file"
                  id="file"
                  onChange={handleFile}
                  className="user--card__input"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <label
                  htmlFor="file"
                  className="user--card__btn"
                  aria-label="ajouter une image"
                >
                  <i className="fa-regular fa-image"></i>
                </label>
                <button type="submit" className="user--card__submit"><i className="fa-solid fa-paper-plane"></i></button>
                {fileDataURL ? (
                  <div className="user--card__img">
                    <img src={fileDataURL} alt="preview" />
                  </div>
                ) : (
                  <div className="user--card__img">
                    <img
                      src={user.imageUrl}
                      alt="photo de profil"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
              </form>
            </>
          ) : (
            
            user.imageUrl && (
            <div className="user--card__picture">
              <div className="user--card__img">
                <img
                  src={user.imageUrl}
                  alt="image du post"
                  crossOrigin="anonymous"
                />
              </div>
               {userId === profileId && <>
                <input
                  type="button"
                  onClick={handlePutPicture}
                  id="putPicture"
                  className="user--card__input"
                />
                <label htmlFor="putPicture" className="user--card__btn">
                  <i className="fa-solid fa-pencil"></i>
                </label>
              </>
              }
              </div>
            )
          )}
      <form onSubmit={handleSubmit(putUser)}>
        <div className="user--card">
          {!isPutForm ? (
            <h1 className="user--card__name">{user.firstName}</h1>
          ) : (
            <input
              type="text"
              {...register("firstName")}
              defaultValue={user.firstName}
            />
          )}
        </div>

        <div className="user--content">
          <div className="user--content__function">
            <h2 className="user--content__title"> <i class="fa-solid fa-briefcase"></i> </h2>

            {!isPutForm ? (
              <p className="user--content__text">{user.function}</p>
            ) : (
              <input
                type="text"
                {...register("function")}
                defaultValue={user.function}
              />
            )}
          </div>

          <div className="user--content__bio">
            <h2 className="user--content__title"> <i class="fa-solid fa-user"></i> </h2>
            {!isPutForm ? (
              <p className="user--content__text">{user.bio}</p>
            ) : (
              <input type="text" {...register("bio")} defaultValue={user.bio} />
            )}
          </div>
        </div>
          {!isPutForm ? (
              userId === profileId && <>
                <input type="button" onClick={handlePutForm} id="putBtn" className="user--card__input"/>
                <label htmlFor="putBtn" className="user--card__btn">
                  <i className="fa-solid fa-pencil"></i>
                </label>
              </> 
              ) : (<button type="submit"> envoyer</button>) 
              
            }
      </form>
    </article>
  );
}
