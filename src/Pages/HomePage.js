import React, {useState} from 'react'
import Layout from '../Components/Layout/Layout/Layout'
import styles from '../Styles/HomePage.module.scss'

import { Link } from 'react-router-dom'
import building1 from '../Images/building1.jpg'
import {FaArrowRight} from 'react-icons/fa'

const HomePage = () => {

    return (
        <Layout>
            <div className="container-fluid">
                <section className={styles.section_2} >

                    <div className={styles.section_2_image_container}>
                        <img src={building1} alt="House-Marketing" />
                    </div>

                    <div className={styles.section_2_slogan} >
                        <h1>
                            Whether You're Buying, Selling or Renting, We Can Help You Move Forward
                        </h1>
                    </div>

                    <div className={styles.selection}>
                        
                        <div className={styles.buy}>
                            <h3>Buy a Home</h3>
                            <p>
                                Find your place with and immersive photo experience and the most listing, including things you won't find anywhere else
                            </p>
                            <Link className='text-dark mt-1' to='/category/buy'>Search Houses<FaArrowRight className='ms-2'/></Link>
                        </div>
                        
                        <div className={styles.rent}>
                            <h3>Rent a Home</h3>
                            <p>
                                We're creating a seamless online experience - from shopping on the largest rental network, to applying, to paying rent.
                            </p>
                            <Link className='text-dark mt-1' to='/category/rent'>Rent Your House<FaArrowRight className='ms-2'/></Link>
                        </div>
                        
                        <div className={styles.sell}>
                            <h3>Sell a Home</h3>
                            <p>
                                Whether you get a cash offer through Real Offer or choose to sell traditionally, we can help you navigate a successful sell.
                            </p>
                            <Link className='text-dark mt-1' to='/sell'>Sell Your House<FaArrowRight className='ms-2'/></Link>
                        </div>
                    </div>

                </section>
            </div>
        </Layout>
    )
}

export default HomePage