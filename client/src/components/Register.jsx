import "./register.css"
import {Cancel, Room} from '@material-ui/icons'
import { useState } from 'react';
import { useRef } from "react";
import axios from 'axios';

function Register({setShowregister}) {
    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };
        try{
            await  axios.post('/users/register',newUser);
                setSuccess(true)
                setError(false)
        }
        catch(err){
            console.log(err);
            setError(true)
        }
    };
    return (
        <div className="registerContainer">
            <div className="logo" >
                <Room/>
                My Camping Map
                 </div>
            <form onSubmit={handleSubmit} >
                <input ref={nameRef} type="text" placeholder="username" />
                <input ref={emailRef} type="email" placeholder="email" />
                <input ref={passwordRef} type="password" placeholder="password" />
                <button className="registerBtn" >Register</button>
                {
                    success &&(<span className="success" >Successfull.You can login now!</span>
                    )
                }
                 {
                    error &&(<span className="failure" >Something went wrong!</span>
                    )
                }
                <Cancel className="registercancel" onClick={()=>setShowregister(false)} />
          
            </form>
        </div>
    )
}

export default Register
