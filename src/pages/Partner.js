import React from 'react';
import bgImg from '../images/bg.png';
import Footer from '../Component/Footer';

export default function Partner() {
    return (

        <section className="main-container3">
            {/* <Container> */}
            <div className='referra-body-container text-center'>
                <img src={bgImg} alt="lo" className="img-fluid" />
                <p className='partner-text'>
                    Gold Retriever is proud to partner with Flash Sender. Gold Retriever is the decentralized financial asset of the future. By combining the exponential growth opportunities of cryptocurrency with the stable reserve currency of gold, Gold Retriever represents decentralized financial freedom at its finest.
                    Flash Sender will support Gold Retriever with the revenue generated from this platform.
                </p>
            </div>


            <Footer />

            {/* </Container> */}
        </section>
    )
}
