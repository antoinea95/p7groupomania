import React, { useEffect } from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import axios from "axios";
import { useContext } from "react";
import { UserIdContext } from "./Context";
import { useState } from "react";

export default function FormPost() {

const userId = useContext(UserIdContext);

const[file, setFile] = useState(null)
const [fileDataURL, setFileDataURL] = useState(null)

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
    setFile(e.target.files[0])
}

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
         .required('Merci de saisir votre message'),
 })
 
 // validation form
 const {register, handleSubmit, formState, reset} = useForm({
     mode: "onBlur",
     resolver: yupResolver(ValidationSchema),
 })
 
 // stock errors
 const { errors } = formState;

 const createPost = (data) => {

        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('message', data.message)
        {file !== null && formData.append('file', file)}


        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/posts`,
            withCredentials: true,
            data: formData
        })
        .then((res) =>{ console.log(res) 
            reset()})
        .catch(err => {throw err})
 }


    return (

        <form className="form--post" onSubmit={handleSubmit(createPost)}>

            <div className="form--post__header">
                <textarea {...register('message')} 
                className='form--post__text'
                placeholder= "Quoi de neuf ?"
                ></textarea>
                <small className="form--post__error">{errors.message?.message}</small>

                <input type='file' id="file" onChange={handleFile}/>
            <label htmlFor="file" 
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

            {fileDataURL ?
                <div className="form--post__previewImg">
                     <img src={fileDataURL} alt="preview" />
                </div> : null }

            
          
            <small className="form--post__error" >{errors.file?.message}</small>

            <button type="submit" className="form--post__submit" >Publier</button>

        </form>
    )
}