import React, {useState, useEffect} from 'react'
import Layout from '../Components/Layout/Layout/Layout'
import {getDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import { getAuth } from 'firebase/auth'
import { useNavigate, Link, useParams } from 'react-router-dom'
import Spinner from '../Components/Spinner'
import {
    FaBed,
    FaBath,
    FaParking,
    FaHouseDamage,
    FaArrowCircleRight,
} from 'react-icons/fa'
import {IoLocation} from 'react-icons/io5'
import '../Styles/Item.css'

const Item = () => {

    const [listing, setListing] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])

    if(loading) {
        return <Spinner />
    }

    return (
        <Layout title={"Listing Information"}>
            <div className="row listing_container container-fluid">
                <div className="col-md-8 listing_container_col1">
                    <img src={listing.imgUrls} alt={listing.name}/>
                </div>
                <div className="col-md-4 listing_container_col2">
                    <h2 className='mb-0'>{listing.name}</h2>
                    <p className='mt-0 d-flex align-items-center'><IoLocation className='me-1'/>{listing.address}</p>
                    <h6 className='mt-4 mb-0'><strong>Price :</strong>&nbsp;
                        {listing.offer ? (
                                <> 
                                    <span style={{textDecoration : "line-through", opacity : "0.7"}}>
                                        {listing.regularPrice} &nbsp;
                                        {listing.type === 'rent' ? 'RS/Month' : '/RS'}
                                    </span>
                                    <br /> 
                                    <span className='ms-5'>
                                        {listing.discountedPrice} &nbsp;
                                        {listing.type === 'rent' ? 'RS/Month' : '/RS'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {listing.regularPrice} &nbsp;
                                    {listing.type === 'rent' ? 'RS/Month' : '/RS'}
                                </>
                            )  
                        }
                    </h6>
                    <p>
                        {listing.offer && (
                            <span className='mt-1'>
                                {listing.regularPrice - listing.discountedPrice} Discount
                            </span>
                            )}
                    </p>
                    <p className='mt-3'><strong>Property For :</strong>&nbsp;{listing.type === 'rent' ? 'Rent' : 'Buy'}</p>
                    <p className='mt-3 d-flex justify-content-center align-items-center'>
                        <FaBed className='me-1'/>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </p>
                    <p className='mt-2 d-flex justify-content-center align-items-center'>
                        <FaBath className='me-1'/>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </p>
                    <p className='mt-2 d-flex justify-content-center align-items-center'>
                        <FaParking className='me-1'/>
                        {listing.parking ? 'Parking Spot' : 'No Parking Spot'}
                    </p>
                    <p className='mt-2 d-flex justify-content-center align-items-center'>
                        <FaHouseDamage className='me-1'/>
                        {listing.furnished ? 'Furnished House' : 'Not Furnished'}
                    </p>
                    <Link
                        className='btn btn-success mt-3'
                        to={`/contact/${listing.useRef}?listingName=${listing.name}`}
                    >
                        Contact LandLord<FaArrowCircleRight className='ms-2'/>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Item