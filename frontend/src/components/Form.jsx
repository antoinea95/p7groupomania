import React, { useState } from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import axios from "axios";
import { useEffect } from "react";


export default function Form(props) {

// get error backend
const [signupError, setSignupError] = useState({})
const [loginError, setLoginError] = useState({})

// Yup key for the firstName, if Login Form is on display, firstName is not required
const firstName = !props.isLogin && 
{ firstName: Yup.string()
                .required('Merci de renseigner votre prénom')
                .matches('^[A-Za-zÀ-ÖØ-öø-ÿ\-\'\ ]{2,}$', 'Prénom invalide')
}

// Yup object for control form
const ValidationSchema = Yup.object().shape({

   ...firstName,
    
    email: Yup.string()
        .email('Merci de renseigner un email valide')
        .required('Merci de renseigner votre email'),

    password: Yup.string()
        .required('Merci de renseigner un mot de passe')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/ , "Le mot de passe doit contenir au minimume 6 caractères, 1 majuscule et 1 nombre")

})

const {register, handleSubmit, formState, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(ValidationSchema),
})

const { errors } = formState;

    // Send signup's data with axios
    const onSignUp = data => {
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/auth/signup',
            'Access-Control-Allow-Credentials':true,

            data: {
               ...data
            }     
        })
        .then(res => {setSignupError(res.data.errors)
        console.log(res)})
        .catch(err => console.log(err))  

        //reset()
    }
    
    // send login's data with axios
    const onLogin = data => {
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/auth/login',
            'Access-Control-Allow-Credentials':true,

            data: {
               ...data
            }     
        })
        .then(res => setLoginError(res.data))
        .catch(err => console.log(err))  

        reset()
    }

    

    return (

        !props.isLogin ?


         <form onSubmit={handleSubmit(onSignUp)}>
                <label htmlFor='firstName'> Prénom </label>
                 <input 
                type='firstName' 
                id="firstName" 
                placeholder="firstName" 
                name='firstName'
                {...register('firstName')}/>

            <br/>

            <small>{errors.firstName?.message}</small>

            <br/>

            <label htmlFor='email'> Email </label>
            <input type='email' 
            id="email" 
            placeholder="email" 
            name='email' 
            onChange={() => setSignupError({})}
            {...register('email')}/>

            <br/>
            
            <small>{errors.email?.message}</small>

            <br/>

            <label htmlFor='password'>Mot de passe</label>
            <input type='password' 
            id="password" 
            placeholder="password" 
            name='password' 
            {...register('password')} 
            />
             <br/>
            <small>{errors.password?.message}</small>
           
            <br/>

            <button type="submit"> Créer un compte </button>
            <small>{signupError.email}</small>

            
        </form> : 
        
        <form onSubmit={handleSubmit(onLogin)}>
            <label htmlFor='email'> Email </label>
            <input type='email' 
            id="email" 
            placeholder="email" 
            name='email' 
            {...register('email')}/>

            <br/>

            <small>{errors.email?.message}</small>

            <br/>

            <label htmlFor='password'>Mot de passe</label>
            <input type='password' 
            id="password" 
            placeholder="password" 
            name='password' 
            {...register('password')} 
            />
            <br/>
            <small>{errors.password?.message}</small>

            <br/>

            <button type="submit"> Se connecter </button>
            <small>{loginError.message}</small>

        </form>
    )
}