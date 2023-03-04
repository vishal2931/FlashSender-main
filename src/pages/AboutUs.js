import React, { useState } from 'react';
import './about.css';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import Footer from '../Component/Footer';

export default function AboutUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [desc, setDesc] = useState('');


    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.init("Pb3puYcYhOkd_Q0rs");
        if (name !== '' && email !== '' && desc !== '') {
            emailjs.sendForm("service_azzgs6g", "template_robvr5l", "#myForm")
                .then((result) => {
                    setName('')
                    setEmail('')
                    setDesc('')
                    toast.success('Sent mail successfully!');
                })
                .catch((err) => {
                    console.log(err.message);
                    toast.success('Something Went Wrong !');
                });
        }
        else {
            toast.error('All Field required !');
        }
    }


    return (
        <section class="main-container2">
            <div class="contact-form-wrapper d-flex justify-content-center">
                <form action="#" id="myForm" class="contact-form">
                    <h5 class="title">Contact us</h5>
                    <p class="description">Feel free to contact us if you need any assistance, any help or another question.
                    </p>
                    <div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} class="form-control rounded border-white mb-3 form-input" id="name" name="name" placeholder="Name" required />
                    </div>
                    <div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" class="form-control rounded border-white mb-3 form-input" placeholder="Email" required />
                    </div>
                    <div>
                        <textarea id="message" value={desc} name="desc" onChange={(e) => setDesc(e.target.value)} class="form-control rounded border-white mb-3 form-text-area" rows="5" cols="30" placeholder="Message" required></textarea>
                    </div>
                    <div class="submit-button-wrapper">
                        <button type="button" className='btn btn-primary submit-button-wrapper' onClick={(e) => sendEmail(e)}>Submit</button>
                    </div>
                </form>
            </div>
            <div className='footer-text'>
                <Footer />
            </div>
        </section>



    )
}
