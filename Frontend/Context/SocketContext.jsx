import React, { useContext, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import io from 'socket.io-client'
import userAtom from '../src/atom/UserAtom';




const SocketContext = React.createContext()

export const useSocket =()=>{
    return useContext(SocketContext)
}
export const SocketContextProvider =({children})=>{
    const [socket,setsocket] = useState(null);
    const user = useRecoilValue(userAtom);
    const [onlineUser,setOnlineUser] = useState([])
    useEffect(()=>{
       const socket = io("http://localhost:5000",{
           query:{
            userId: user?._id,
           }
       })   
       setsocket(socket)

       socket.on("getOnlineUsers",(user) =>{
        setOnlineUser(user)
       } )
       return ()=>{
        socket && socket.close();
       }
    },[user?._id])
    console.log("onlineUser",onlineUser);

    return(
        <SocketContext.Provider value={{socket,onlineUser}}>
            {children}
        </SocketContext.Provider>
    )
}