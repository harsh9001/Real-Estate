import React,{useState} from 'react'
import Layout from '../Components/Layout/Layout/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import forgot_img from '../Images/forgot_img.svg'
import '../Styles/ForgotPassword.css'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email);
            toast.success('Email sent')
            navigate("/signin")

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={"Forgot Password Page"}>
            <div className="row forgot_password_container container-fluid">
                <div className="col-md-7">
                    <img src={forgot_img} alt="Forgot Password..." />
                </div>
                <div className="col-md-5 forgot_password_col2">
                    <h1 className='p-2 mt-4 text-center text-decoration-underline'>Reset Your Password</h1>
                    <form className='p-4' onSubmit={onSubmitHandler}>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1" className='form-label'>Email address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control" 
                                id="exampleInputEmail1" 
                                aria-describedby="emailHelp" 
                                placeholder="Enter email" 
                            />
                            <div className="form-text text-center text-secondary" id='emailHelp'>Reset email will sent to this email</div>
                        </div>
                        <div className="d-flex btn_grp">
                            <button type="submit" className="btn btn-primary reset">
                                Reset
                            </button>
                            <button className="btn signin">
                                <Link to='/signin' className='signin'>
                                    Sign In
                                </Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default ForgotPassword