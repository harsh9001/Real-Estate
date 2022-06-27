import React from 'react'
import ReactLoading from "react-loading";
import '../Styles/Spinner.css'

const Spinner = () => {
    return (
        <>
            <div className="spinner" style={{height: "100vh"}}>
                <ReactLoading
                    type="spinningBubbles"
                    color="#4EB1BA"
                    height={150}
                    width={100}
                />
            </div>
        </>
        
    )
}

export default Spinner