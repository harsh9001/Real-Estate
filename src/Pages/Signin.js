import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Layout from '../Components/Layout/Layout/Layout'
import {BsFillEyeFill} from 'react-icons/bs'
import {BsFillEyeSlashFill} from 'react-icons/bs'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {toast} from 'react-toastify'
import OAuth from '../Components/OAuth'
import '../Styles/InsideInput.css'
import '../Styles/Signin.css'
import signin_img from "../Images/signin_img.png"

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        email : '',
        password : '',
    })
    const {email, password} = formData;
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id] : e.target.value,
        }))
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if(userCredential.user) {
                toast.success('Login Successful')
                navigate('/')
            }

        } catch (error) {
            toast.error("Invalid Email or Password")
        }
    }

    return (
        <Layout title={"Login"}>
            <div className="row signin_container container-fluid">
                <div className="col-md-6">
                    <img src={signin_img} alt="Sign In..." />
                </div>
                <div className='col-md-6 signin_container_col2'>
                    <h4 className='p-2 mt-2 text-center text-decoration-underline'>Sign In</h4>
                    <form className='p-4' onSubmit={loginHandler}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input 
                                type="email" 
                                value={email} 
                                className="form-control" 
                                id="email" 
                                aria-describedby="emailHelp" 
                                onChange={onChange} 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <div className="buttonInside mb-2">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    value={password} 
                                    className="form-control" 
                                    id="password" 
                                    onChange={onChange} 
                                />
                                <span className='eyeBtn'>
                                    {/* show password */}
                                    {showPassword ? 

                                        <BsFillEyeSlashFill
                                            className='ms-2 text-primary'
                                            style={{ cursor : "pointer"}}
                                            onClick={() => {
                                                setShowPassword((prevState) => !prevState)
                                            }}
                                        /> :
                                    
                                    <BsFillEyeFill 
                                        className='ms-2 text-primary' 
                                        style={{ cursor : "pointer" }}
                                        onClick={() => {
                                            setShowPassword((prevState) => !prevState)
                                        }} 
                                    />} 
                                </span>
                            </div>
                            <Link to='/forgot-password'>Forgot Password</Link>
                        </div>
                        <div className='d-flex flex-column'>
                            <button type="submit" className="btn btn-primary signin_btn">Sign In</button>
                            <span className='mt-2'>New User ? <Link to='/signup'>Sign Up</Link></span> 
                        </div>
                        {/* <OAuth /> */}
                    </form>
                </div>

            </div>
        </Layout>
    )
}

export default SignIn