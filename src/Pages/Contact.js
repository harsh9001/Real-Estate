import React,{useState, useEffect} from 'react'
import Layout from '../Components/Layout/Layout/Layout'
import {getDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import contact_img from '../Images/contact_img.jpg'
import '../Styles/Contact.css'

const Contact = () => {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setLandlord(docSnap.data())
            }
            else {
                toast.error("Unable to fetch data");
            }
        }
        getLandlord()
    }, [params.landlordId])

    return (
        <Layout title={"Contact Here"}>
            <div className="row contact_container container-fluid">
                <div className="col-md-6 contact_container_col1">
                    <img src={contact_img} alt="Contact.." />
                </div>
                <div className="col-md-6 contact_container_col2">
                    <h1>Contact Details</h1>
                    {landlord !== '' && (
                        <main>
                            <h3 className='mb-4'>
                                Person Name : &nbsp;
                                    <span style={{color : "#470D21"}}>
                                        {landlord?.name}
                                    </span>
                                </h3>
                                <div className="form-floating">
                                    <textarea 
                                        className="form-control"
                                        placeholder='Leave a comment Here'
                                        value={message}
                                        id='message'
                                        required
                                        onChange={(e) => {
                                            setMessage(e.target.value)
                                        }}
                                    />
                                    <label htmlFor="floatingTextarea" className="form-label">Type Your Message Here</label>
                                </div>
                                    <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                                        <button className="mt-4 btn btn-primary">Send Message</button>
                                    </a>
                            </main>
                        )}
                </div>
                <div>
                </div>
            </div>
        </Layout>
    )
}

export default Contact