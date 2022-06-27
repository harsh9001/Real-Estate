import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Helmet } from 'react-helmet'

const Layout = ({children, title}) => {
    return (
        <>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>{title}</title>
            </Helmet>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}

Layout.defaultProps = {
    title : "Real-Estate"
}

export default Layout