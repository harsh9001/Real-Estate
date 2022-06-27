import React from 'react'
import { Link } from 'react-router-dom'
import {FaBed} from 'react-icons/fa'
import {FaBath} from 'react-icons/fa'
import {IoLocation} from 'react-icons/io5'
import '../../src/index.css'
import '../Styles/ListingItem.css'

const ListingItem = ({listing, id, onDelete, onEdit}) => {
    return (
        <>
            <div className="container cards d-flex align-items-center justify-content-center">
                <div className="item_card category_link" style={{height : "460px"}}>
                    <h2 className='text-center d-flex align-items-center justify-content-center card-heading'>{listing.name}</h2>
                    <p className='text-end me-3'><IoLocation />&nbsp;{listing.address}</p>
                    <Link to={`/category/${listing.type}/${id}`}>
                        <div className="col d-flex align-items-center justify-content-center" style={{height : "200px"}}>
                            <div className="col-md-5 d-flex align-items-center justify-content-center">
                                <img className='img' src={listing.imgUrls[0]} alt={listing.name} height={"150px"} width={"250px"} />
                            </div>
                        </div>
                        <div className="col ms-4 allData">
                            <p className='mt-0'>
                                <FaBed /> &nbsp;
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}
                            </p>
                            <p className='mt-2'>
                                <FaBath /> &nbsp;
                                {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"}
                            </p>
                            <p className='mt-4'> <strong>Property For :</strong> &nbsp;
                                {listing.type === 'rent' ? "Rent" : "Sell"}
                            </p>
                            <p className='mt-4'>
                                <strong>RS : </strong>
                                {listing.offer 
                                    ? listing.discountedPrice 
                                    : listing.regularPrice}{" "} 
                                {listing.type === 'rent' ? " / Month" : " /-"}
                            </p>
                        </div>
                    </Link>
                    <div className='d-flex justify-content-around'>
                        {onDelete && (
                            <button 
                                style={{width : "100px"}}
                                className="btn btn-danger mt-4 ms-2" 
                                onClick={() => onDelete(listing.id)}
                            >
                                Delete
                            </button>
                        )}
                        {onEdit && (
                            <button 
                                style={{width : "100px"}}
                                className="btn btn-info mt-4 me-2" 
                                onClick={() => onEdit(listing.id)}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListingItem