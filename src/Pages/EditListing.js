import React, {useState, useEffect, useRef} from 'react'
import {v4 as uuidv4} from 'uuid'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../Components/Layout/Layout/Layout'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Spinner from '../Components/Spinner'
import {AiOutlineFileAdd} from 'react-icons/ai'
import {toast} from 'react-toastify'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {db} from '../firebase.config'
import {addDoc, collection, serverTimestamp, doc, updateDoc, getDoc} from 'firebase/firestore'
// import '../Styles/EditListing.css'

const EditListing = () => {
    
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState('')
    const params = useParams()
    // const [geoLocationEnable, setGeoLocationEnable] = useState(false)
    const [formData, setFormData] = useState({
        type : "rent",
        name : "",
        bedrooms : 1,
        bathrooms : 1,
        parking : false,
        furnished : false,
        address : "",
        offer : false,
        regularPrice : 0,
        discountedPrice : 0,
        images : {},
        latitude : 0,
        longitude : 0,
    })

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData;

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                setFormData({
                    ...formData,
                    useRef : user.uid,
                })
            })
        }
        else {
            navigate('/signin')
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(listing && listing.useRef !== auth.currentUser.uid) {
            toast.error("You can 'NOT' edit this Listing")
            navigate("/")
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setLoading(true)
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({...docSnap.data()})
                setLoading(false)
            }
            else {
                navigate("/")
                toast.error("Listing Not Exists")
            }
        }
        fetchListing()
    }, [])

    const onChangeHandler = (e) => {
        let boolean = null;

        if(e.target.value === "true") {
            boolean = true;
        }
        if(e.target.value === "false") {
            boolean = false;
        }

        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images : e.target.files,
            }))
        }
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id] : boolean ?? e.target.value,
            }))
        }
    }

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        // let geoLocation ={}
        // let location;
        // if(geoLocationEnable) {
        //     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDYlAzcvXPLwF8SOZ3_G40X--F05gFJK8I`)
        //     const data = await response.json()
        // }
        // else {
        //     geoLocation.lat = latitude
        //     geoLocation.long = longitude
        //     // location = address
        // }

        const  storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage,'images/'+fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
                    console.log('uploads is ' + progress+'% done');
                    switch(snapshot.state) {
                        case 'paused' :
                            break
                        case 'running' :
                            break
                    }
                },
                (error) => {reject(error)},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadUrl) => {resolve(downloadUrl)})
                }
                )
            })
        }
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        )
        .catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        // const formDataCopy = {
        //     ...formData, 
        //     imgUrls, 
        //     geoLocation, 
        //     timestamp:serverTimestamp()
        // }
        const formDataCopy = {
            ...formData, 
            imgUrls, 
            timestamp:serverTimestamp()
        }
        formData.location = address;
        delete formDataCopy.images
        !formDataCopy.offer && delete formDataCopy.discountedPrice
        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy)
        toast.success("Listing Updated..!")
        setLoading(false)
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    if(loading) {
        return <Spinner />
    }

    return (
        <Layout title={"Edit Your Listing"}>
            <div className="full_page container-fluid d-flex flex-column align-items-center justify-content-center">
                <h1 className="heading text-center">
                    Update Listing &nbsp;
                    <AiOutlineFileAdd />
                </h1>

                <form action="" className="form_container mb-4 p-4" onSubmit={onSubmit}>
                    {/* Radio */}
                    <div className="d-flex flex-row mt-4">
                        <div className="form-check">
                            <input
                                className='form-check-input'
                                type="radio"
                                value="buy"
                                onChange={onChangeHandler}
                                name="type"
                                id="type"
                            />
                            <label htmlFor="buy" className="form-check-label">
                                Sell
                            </label>
                        </div>
                        <div className="form-check ms-3">
                            <input
                                className='form-check-input'
                                type="radio"
                                value="rent"
                                defaultChecked
                                onChange={onChangeHandler}
                                name="type"
                                id="type"
                            />
                            <label htmlFor="rent" className="form-check-label">
                                Rent
                            </label>
                        </div>
                    </div>
                    {/* name */}
                    <div className="mb-3 mt-4">
                        <label htmlFor="name" className="form-label">
                            House Name
                        </label>
                        <input
                            type="text"
                            className='form-control'
                            id="name"
                            value={name}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                    {/* Bedrooms */}
                    <div className="mb-3 mt-4">
                        <label htmlFor="bedrooms" className="form-label">
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            className='form-control'
                            id="bedrooms"
                            value={bedrooms}
                            onChange={onChangeHandler}
                            min="0"
                            required
                        />
                    </div>
                    {/* Bathrooms */}
                    <div className="mb-3 mt-4">
                        <label htmlFor="bathrooms" className="form-label">
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            className='form-control'
                            id="bathrooms"
                            value={bathrooms}
                            onChange={onChangeHandler}
                            min="0"
                            required
                        />
                    </div>
                    {/* Parking */}
                    <div className="mb-3">
                        <label htmlFor="parking" className="form-label">
                            Parking :
                        </label>
                        <div className="d-flex flex-row">
                            <div className="form-check">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={true}
                                    onChange={onChangeHandler}
                                    name="parking"
                                    id="parking"
                                />
                                <label htmlFor="yes" className="form-check-label">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check ms-3">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={false}
                                    defaultChecked
                                    onChange={onChangeHandler}
                                    name="parking"
                                    id="parking"
                                />
                                <label htmlFor="no" className="form-check-label">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Furnished */}
                    <div className="mb-3">
                        <label htmlFor="furnished" className="form-label">
                            Furnished :
                        </label>
                        <div className="d-flex flex-row">
                            <div className="form-check">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={true}
                                    onChange={onChangeHandler}
                                    name="furnished"
                                    id="furnished"
                                />
                                <label htmlFor="yes" className="form-check-label">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check ms-3">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={false}
                                    defaultChecked
                                    onChange={onChangeHandler}
                                    name="furnished"
                                    id="furnished"
                                />
                                <label htmlFor="no" className="form-check-label">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* address */}
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">City :</label>
                        <textarea 
                            className="form-control"
                            placeholder="eg. Motera, Ahmedabad"
                            id="address"
                            name='address'
                            value={address}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                    {/* geoLocation */}
                    <div className="d-none">
                        {/* {!geoLocationEnable && (
                            <div className="mb-3">
                                <div className="d-flex flex-row">
                                    <div className="form-check">
                                        <label htmlFor="yes" className="form-check-label">
                                            Latitude
                                        </label>
                                        <input
                                            className='form-control'
                                            type="number"
                                            value={latitude}
                                            onChange={onChangeHandler}
                                            name="latitude"
                                            id="latitude"
                                        />
                                    </div>
                                    <div className="form-check ms-3">
                                        <label htmlFor="no" className="form-check-label">
                                            Longitude
                                        </label>
                                        <input
                                            className='form-control'
                                            type="number"
                                            value={longitude}
                                            onChange={onChangeHandler}
                                            name="longitude"
                                            id="longitude"
                                        />
                                    </div>
                                </div>
                            </div>
                        )} */}

                    </div>
                    {/* offers */}
                    <div className="mb-3">
                        <label htmlFor="offer" className="form-label">
                            Offer :
                        </label>
                        <div className="d-flex flex-row">
                            <div className="form-check">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={true}
                                    onChange={onChangeHandler}
                                    name="offer"
                                    id="offer"
                                />
                                <label htmlFor="yes" className="form-check-label">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check ms-3">
                                <input
                                    className='form-check-input'
                                    type="radio"
                                    value={false}
                                    defaultChecked
                                    onChange={onChangeHandler}
                                    name="offer"
                                    id="offer"
                                />
                                <label htmlFor="no" className="form-check-label">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* regular price */}
                    <div className="mb-3 mt-4">
                        <label htmlFor="name" className="form-label">
                            Regular Price :
                        </label>
                        <div className="d-flex flex-row">
                            <input
                                type="number"
                                className='form-control w-50'
                                id="regularPrice"
                                name="regularPrice"
                                value={regularPrice}
                                onChange={onChangeHandler}
                                min="0"
                                required
                            />
                            {type === 'rent' && <p className='ms-4 mt-2'>RS / Month</p>}
                        </div>
                    </div>
                    {/* offer discounted price */}
                    {offer && (
                        <div className="mb-3 mt-4">
                            <label htmlFor="discountedPrice" className="form-label">
                                Discounted Price :
                            </label>
                            <div className="d-flex flex-row">
                                <input
                                    type="number"
                                    className='form-control w-50'
                                    id="discountedPrice"
                                    name="discountedPrice"
                                    value={discountedPrice}
                                    onChange={onChangeHandler}
                                    min="0"
                                    max={regularPrice-1}
                                    required
                                />
                                {type === 'rent' && <p className='ms-4 mt-2'>RS / Month</p>}
                            </div>
                        </div>
                    )}
                    {/* files, images, etc */}
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                            Select Image :
                        </label>
                        
                        <input
                            type="file"
                            className='form-control'
                            id="images"
                            name="images"
                            onChange={onChangeHandler}
                            max="1"
                            accept=".jpg, .png, .jpeg"
                            multiple={false}
                            required
                        />
                    </div>
                    {/* Submit button */}
                    <div className="mb-3">
                        <input
                            className='btn btn-primary w-100'
                            disabled={!name || !address || !regularPrice || !images}
                            type="submit"
                            value="Update"
                        />
                    </div>
                </form>

            </div>
        </Layout>
    )
    
}

export default EditListing