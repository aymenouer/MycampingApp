import "./login.css"
import {Cancel, Room} from '@material-ui/icons'
import { useState } from 'react';
import { useRef } from "react";
import axios from 'axios';

function Login({setShowlogin,myStorage,setCurrentUser}) {

    const [error,setError] = useState(false);
    const nameRef = useRef();

    const passwordRef = useRef();
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };
        try{
             const res =await axios.post('/users/login',user);
             myStorage.setItem('User',res.data.username);
          setCurrentUser(res.data.username);
          setShowlogin(false);
             setError(false)
            
        }
        catch(err){
        
            setError(true)
        }
    };
    return (
        <div className="loginContainer">
            <div className="logo" >
                <Room/>
                My Camping Map
                 </div>
            <form onSubmit={handleSubmit} >
                <input ref={nameRef} type="text" placeholder="username" />
                <input ref={passwordRef} type="password" placeholder="password" />
                <button className="loginBtn" >Login</button>
            
                 {
                    error &&(<span className="failure" >Something went wrong!</span>
                    )
                }
                <Cancel className="logincancel" onClick={()=>setShowlogin(false)} />
          
            </form>
        </div>
    )
}

export default Login
