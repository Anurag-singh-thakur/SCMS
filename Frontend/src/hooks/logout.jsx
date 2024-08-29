import React, { useState } from 'react'
import userAtom from '../atom/UserAtom.js'

function uselogout() {
   const [user,setuser] = useState(userAtom);
   const logout = async() => {
    try {
        const res = await fetch('/api/user/logout', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        if(!res.ok) {
            const errordata = await res.json();
            return;
        }
        const data = await res.json();
        console.log(data,"logout");
        localStorage.removeItem('user');
        setuser(null);
        window.location.reload();
    } catch (error) {
        console.log(error)
        toast("Error", error, "error");
    }
   }
   return logout;

}

export default uselogout