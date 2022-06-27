import React, {useState, useEffect} from 'react'
import {toast } from 'react-toastify';
import { useNavigate, Link, useParams } from 'react-router-dom'
import Layout from '../Components/Layout/Layout/Layout'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config';
import {FaEdit, FaArrowAltCircleRight} from 'react-icons/fa'
import {MdDoneOutline} from 'react-icons/md'
import { doc, updateDoc, collection, query, getDocs,where,orderBy, deleteDoc, limit, startAfter } from 'firebase/firestore';
import ListingItem from '../Components/ListingItem';
import {IoReloadCircle} from 'react-icons/io5'
import profile_img from '../Images/profile_img.png'
import '../Styles/Profile.css'
import Spinner from '../Components/Spinner';

const Profile = () => {

    const auth = getAuth()
    const navigate = useNavigate();
    const params = useParams()

    const [listings, setListings] = useState('')
    const [lastFetchListing, setLastFetchListing] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, 
                where('useRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc'),
                limit(1)
            )
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchListing(lastVisible)
            let listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id : doc.id,
                    data : doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const fetchLoadMoreListing = async () => {
        try {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, 
                where('useRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchListing),
                limit(10)
            )
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchListing(lastVisible)
            const listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id : doc.id,
                    data : doc.data()
                })
            });
            setListings(prevState => [...prevState, ...listings])
            setLoading(false)

        } catch (error) {
                toast.error('Unable to fetch Data')
        }
    }

    const [changeDetails, setChangeDetails] = useState(false)

    const [formData, setFormData] = useState({
        name : auth.currentUser.displayName,
        email : auth.currentUser.email,
    })
    const {name, email} = formData

    const logoutHandler = () => {
        auth.signOut()
        toast.success('Logout Successfully')
        navigate("/")
    }

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const onSubmit = async () => {
        try {
            if(auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName : name
                })
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {name})
                toast.success('User Updated!')
            }
            
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    const onDelete = async (listingId) => {
        setLoading(true)
        if(window.confirm("Are you sure..! You Want to permenantly Delete This Listing..?")) {
            const docRef = doc(db, 'listings', listingId)
            await deleteDoc(docRef)
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success("Listing Deleted Successfully")
            navigate('/')
        }
        else {
            navigate('/')
        }
    }

    const onEdit = async (listingId) => {
        setLoading(true)
        navigate(`/editlisting/${listingId}`)
    }
    // console.log(updatedListings);
    if(loading) {
        return <Spinner />
    }

    return (
        <Layout title={"Account Details"}>
            <div className="row profile_container">
                <div className="col-md-6 profile_container_col1">
                    <img src={profile_img} alt="Profile" />
                </div>
                <div className="col-md-5 profile_container_col2">
                    <div className="container d-flex justify-content-between">
                        <h2>Profile Details</h2>
                        <button className="btn btn-danger" onClick={logoutHandler} >
                            Logout
                        </button>
                    </div>
                    <div className="mt-4 card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <p>User Personal Details</p>
                                <span 
                                    style={{ cursor: "pointer" }} 
                                    onClick={() => {
                                        changeDetails && onSubmit(); 
                                        setChangeDetails(prevState => !prevState);
                                    }} 
                                >
                                    {changeDetails ? <MdDoneOutline color='green' /> : <FaEdit color='red' />}
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className='form-label'>
                                        Name
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name"
                                        value={name}
                                        onChange={onChange}
                                        disabled={!changeDetails}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className='form-label'>
                                        Email address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        className="form-control" 
                                        id="email" 
                                        aria-describedby="emailHelp" 
                                        onChange={onChange}
                                        disabled={!changeDetails}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="mt-3 create_listing">
                        <Link to='/sell'>
                            <FaArrowAltCircleRight color='primary'/>&nbsp; Sell Or Rent Your Home
                        </Link>
                    </div>

                </div>
            </div>

            <div className="container-fluid mt-4 your_listings">
                {(listings && listings?.length > 0) ? (
                    <>
                        <h3>Your Listings</h3>
                        <div className='cards'>
                            {listings.map(listing => (
                                <ListingItem 
                                    key={listing.id} 
                                    listing={listing.data} 
                                    id={listing.id} 
                                    onDelete={() => onDelete(listing.id)} 
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </div>
                        <div className='d-flex pb-4 md-4 justify-content-center align-items-center'>
                            {lastFetchListing && (
                                <button className="load-btn" onClick={fetchLoadMoreListing}><IoReloadCircle className='me-2' />Load More</button>
                            )}
                        </div>
                    </>
                ) : (
                    <h6 className='text-center'>You Don't have any Listings..!</h6>
                )}
            </div>
        </Layout>
    )
}

export default Profile