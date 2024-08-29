import React, {  useState } from 'react'
import './Login.css'
import cross_icon from './../../assets/cross_icon.png'
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atom/UserAtom';
const LoginPopUp = ({setShowLogin }) => {

  const [currentState, setCurrState] = useState("Login");
  const setUser = useSetRecoilState(userAtom);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;

    const value = event.target.value;
    //console.log(`Input changed: ${name} = ${value}`); // Debug statement
    setData(data => ({ ...data, [name]: value }))
  }
  const onSubmitHandler = async(e) =>{
    e.preventDefault();
    try {
      console.log(data)
      const res = await fetch(`/api/user/${currentState}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const datas = await res.json();
      console.log(datas,"data");
      if (datas.err) {
        console.log(datas.err)
        return;
      } else {
        localStorage.setItem("user", JSON.stringify(datas));
        setUser(datas);
        console.log(datas)
      }
    } catch (error) {
      console.log(error)
    }
    setShowLogin(false);
  }

  return (
    <div className='login-popup'>
      <form  className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={cross_icon} onClick={() => setShowLogin(false)} alt="" />
        </div>
        <div className="login-popup-inputs">
           <input name='username' onChange={onChangeHandler} value={data.username} type="text" placeholder='Your name ' required />
           {currentState === "Login" ? <></> :<input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email ' required />}
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password ' required />
        </div>
        <button type='submit' onClick={onSubmitHandler}>{currentState === "signup" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By Continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currentState === "Login"
          ? <p>Create a new account ? <span onClick={() => setCurrState("signup")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
        }
      </form>
    </div>
  )
}
export default LoginPopUp