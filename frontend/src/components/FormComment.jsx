import React from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import axios from "axios";
import { useContext } from "react";
import { Context } from "./Context";


export default function FormComment(props) {

    const {userId, setPostUpdate} = useContext(Context);

    // Yup object for control form
const ValidationSchema = Yup.object().shape({
     
    text: Yup.string()
        .max(500, 'Votre commentaire est trop long')
        .min(1, 'Votre commentaire est vide')
        .required('Merci de saisir votre commentaire')
})

// validation form
const {register, handleSubmit, formState, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
})

// stock errors
const { errors } = formState;

    function postComment (data) {
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/posts/${props.postId}/comment`,
            withCredentials: true,
            data: {
                userId: userId,
                text: data.text
            }
        })
        .then(res => {
            console.log(res)
            setPostUpdate(true)
            reset()
        })
    }

    




    return !props.isPut ? (
        <form onSubmit={handleSubmit(postComment)}>
            <input type='text' {...register('text')}/>
            <button type="submit"> <i className="fa-solid fa-paper-plane"></i> </button>
        </form>
    ) :  (
        <form onSubmit={handleSubmit(props.putComment)}>
            <input type='text' {...register('text')} defaultValue={props.comment.text}/>
            <button type="submit"> <i className="fa-solid fa-paper-plane"></i> </button>
        </form>
    )

}