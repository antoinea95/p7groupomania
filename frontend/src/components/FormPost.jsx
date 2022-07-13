import React from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import axios from "axios";
import { useContext } from "react";
import { UserIdContext } from "./Context";
import { useState } from "react";

export default function FormPost() {

const userId = useContext(UserIdContext);

const[file, setFile] = useState({selectedFile: null})


// get user's file
function handleFile(e) {
    setFile({selectedFile: e.target.files[0]})
}

function resetFile() {
  const input = document.querySelector('#file')
  input.value='';
  setFile({selectedFile: null});
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

 console.log(file.selectedFile)
 const createPost = (data) => {

        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('message', data.message)
        {file !== null && formData.append('file', file.selectedFile)}


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

            <textarea {...register('message')}></textarea>
            <small>{errors.message?.message}</small>
            <input type='file' id="file" onChange={handleFile}/>
            <button type='button' onClick={resetFile}>delete file</button>
            <label htmlFor="file" className="form--post__btnImg"></label>
            <small>{errors.file?.message}</small>

            <button type="submit" >Créer post</button>

        </form>
    )
}