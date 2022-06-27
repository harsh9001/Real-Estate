import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Layout from '../Components/Layout/Layout/Layout'
import {BsFillEyeFill} from 'react-icons/bs'
import {BsFillEyeSlashFill} from 'react-icons/bs'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {doc, setDoc, serverTimestamp} from 'firebase/firestore'
import {toast} from 'react-toastify'
import OAuth from '../Components/OAuth'
import '../Styles/Signup.css'
import signup_img from '../Images/signup_img.png'

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name : '',
        email : '',
        password : '',
    })
    const {name, email, password} = formData;
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id] : e.target.value,
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            updateProfile(auth.currentUser, {displayName: name})
            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataCopy);
            toast.success('SignUp successfully')
            navigate("/")

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={"Register"}>
            <div className="row signup_container">
                <div className="col-md-6 signup_container_col1">
                    <img src={signup_img} alt="Welcome..." />
                </div>
                <div className="col-md-6 signup_container_col2">
                    {/* <h3 className='mt-2 text-center'>Sign Up</h3> */}
                    <h4 className='text-center text-decoration-underline'>Sign Up</h4>
                    <form className='p-4' onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                className="form-control" 
                                id="name" 
                                aria-describedby="nameHelp" 
                                onChange={onChange} 
                            />
                        </div>
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
                            <div className="buttonInside">
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
                        </div>
                        <div className='d-flex flex-column'>
                            <button type="submit" className="btn btn-primary signup_btn">Sign Up</button>
                            <span className='mt-2'>Already User ? <Link to='/signin'>Login</Link></span>
                        </div>
                        {/* <OAuth /> */}
                    </form>
                </div>

            </div>
        </Layout>
    )
}

export default Signup