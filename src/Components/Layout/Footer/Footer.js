import React from 'react'
import {Link} from 'react-router-dom'
import '../../../Styles/Footer.css'
import {
    AiOutlineLinkedin,
    AiOutlineInstagram,
    AiOutlineGithub,
} from "react-icons/ai"

const Footer = () => {
    return (
        <>
        <div className='footer d-flex w-100 flex-column align-items-center justify-content-center bg-dark text-light p-4'>
            {/* <h3>Real-Estate</h3> */}
            <div className="d-flex flex-row p-2">
                <p className="me-4" title='LinkedIn'>
                    <Link to="/">
                        <AiOutlineLinkedin color="#E9E9E9" style={{opacity:"0.5"}} size={30} />
                    </Link>
                </p>
                <p className="me-4" title='Github'>
                    <Link to="/">
                        <AiOutlineGithub color="#E9E9E9" style={{opacity:"0.5"}} size={30} />
                    </Link>
                </p>
                <p className="me-4" title='Instagram'>
                    <Link to="/">
                        <AiOutlineInstagram color="#E9E9E9" style={{opacity:"0.5"}} size={30} />
                    </Link>
                </p>
            </div>
            <h6>All rights reserved &copy; Real-Estate - <strong>2022</strong></h6>
        </div>
        </>
    )
}

export default Footer