import React,{useState, useEffect} from 'react'
import Layout from '../Components/Layout/Layout/Layout'
import { useParams } from 'react-router-dom'
import {db} from '../firebase.config'
import { toast } from 'react-toastify'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import Spinner from '../Components/Spinner'
import ListingItem from '../Components/ListingItem'
import {IoReloadCircle} from 'react-icons/io5'
import '../Styles/Offer.css'

const Offer = () => {

    const [listing, setListing] = useState("")
    const [lastFetchListing, setLastFetchListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsRef = collection(db, 'listings')
                const q = query(listingsRef, 
                    where('offer', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                    )
                    const querySnap = await getDocs(q)
                    const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                    setLastFetchListing(lastVisible)
                    const listings = []
                    querySnap.forEach((doc) => {
                        return listings.push({
                            id : doc.id,
                            data : doc.data()
                        })
                    });
                    setListing(listings)
                    setLoading(false)

            } catch (error) {
                toast.error('Unable to fetch Data')
            }
        }
        fetchListing();
    }, [])

    const fetchLoadMoreListing = async () => {
        try {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, 
                where('offer', '==', true),
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
            setListing(prevState => [...prevState, ...listings])
            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error('Unable to fetch Data')
        }
    }
    
    return (
        <Layout title={"Latest Offers"}>
            <div className="offers">
                <h1 className='m-4'>Best Offers</h1>
                <div className="cards pt-3 container-fluid">
                        {loading ? (
                            <Spinner />
                        ) : listing && listing.length > 0 ? (
                            <>
                                {listing.map(list => (
                                    <ListingItem listing={list.data} id={list.id} key={list.id} />
                                ))}
                            </>
                        ) : (
                            <p>There Are No Current Offers</p>
                        )}
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        {lastFetchListing && (
                            <button className="load-btn" onClick={fetchLoadMoreListing}><IoReloadCircle className='me-2' />Load More</button>
                        )}
                </div>
            </div>
        </Layout>
    )
}

export default Offer