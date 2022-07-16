import React, { useEffect } from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import axios from "axios";
import { useContext } from "react";
import { Context } from "./Context";
import { useState } from "react";

export default function FormUpdatePost(props) {

const {setPostUpdate} = useContext(Context);


const[file, setFile] = useState(null)
const [fileDataURL, setFileDataURL] = useState(null)
const [imgErr, setImgErr] = useState({type: '', erreur:''})

useEffect (() => {
    let fileReader, isCancel = false;

    if(file) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
            const {result} = e.target;

            if(result && !isCancel) {
                setFileDataURL(result)
            }
        }

        fileReader.readAsDataURL(file)
    }

    return () => {
        isCancel = true;
        if(fileReader && fileReader.readyState === 1) {
            fileReader.abort();
        }
    }
}, [file])

// get user's file
function handleFile(e) {
    const file = e.target.files[0]

   if (file.size > 625000) {
        setImgErr({type: 'format', message: 'Taille maximal: 5MB'});
        return imgErr;
    } else {
        setFile(file)
        setImgErr({type: '', message:''})
    }
    
};

function resetFile() {
  const input = document.querySelector('#file')
  input.value='';
  setFile(null);
  setFileDataURL(null);
}

// Yup object for control form
const ValidationSchema = Yup.object().shape({
     
     message: Yup.string()
         .max(1024, 'Votre message est trop long')
         .min(1, 'Le message de votre post est vide')
         .required('Merci de saisir votre message')
 })
 
 // validation form
 const {register, handleSubmit, formState, reset} = useForm({
     mode: "onBlur",
     resolver: yupResolver(ValidationSchema),
 })
 
 // stock errors
 const { errors } = formState;

 const updatePost = (data) => {
    
    const formData = new FormData()
    formData.append('message', data.message)
    {file !== null && formData.append('file', file)}


    axios({
        method: 'put',
        url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}`,
        withCredentials: true,
        data: formData

    })
    .then(() => {
        setPostUpdate(true)
        setFile(null)
        setFileDataURL(null)
        reset()
    })
    .catch(err => {throw err})
}
   

    return ( 
        
        <form className="form--post" onSubmit={handleSubmit(updatePost)}>

        <div className="form--post__header">
            <textarea {...register('message')} 
            className='form--post__text'
            placeholder= "test put"
            defaultValue={props.message}
            ></textarea>

            <input type='file' id="fileUpdate" className='form--post__input' onChange={handleFile}  accept='image/png, image/jpeg, image/jpg'/>
        <label htmlFor="fileUpdate" 
        className="form--post__btnImg" 
        aria-label='ajouter une image'> 
            <i className="fa-regular fa-image"></i> 
        </label>

        {file !== null && <button className='form--post__deleteImg'
        type='button' onClick={resetFile} 
        aria-label='supprimer image'> 
            <i className="fa-solid fa-trash"></i> 
        </button> }

        </div>

        <small className="form--post__error">{errors.message?.message}</small>

        {fileDataURL ?
            <div className="form--post__previewImg">
                 <img src={fileDataURL} alt="preview" />
            </div> :  props.imageUrl && <img src={props.imageUrl} alt="image du post" crossOrigin="anonymous"/>}

        <small className="form--post__error" >{imgErr.message}</small>

        <button type="submit" className="form--post__submit" >Modifier</button>

    </form>
    )

}