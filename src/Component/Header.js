import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logoImg from '../images/logo.png';
import Connect from "./Connect";
import { Link, useParams, useLocation } from 'react-router-dom';
import queryString from "query-string";

const Header = () => {
    const router = useRouter();
    return (
        <>
            <Navbar expand="lg" className='cust-header'>
                <Container>
                    <Link to='/'>
                        <Navbar.Brand>
                            <img src={logoImg} alt="logo" className='logo mt-2' />
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} className={`nav-link-custom ${router.pathname === "/" ? "active" : ""}`} to="/">Home</Nav.Link>
                            {/* <Nav.Link as={Link} className={`nav-link-custom ${router.pathname === "/tutorial" ? "active" : ""}`} to="/tutorial">Tutorial</Nav.Link> */}
                            <Nav.Link as={Link} className={`nav-link-custom ${router.pathname === "/referral" ? "active" : ""}`} to="/referral">Referral</Nav.Link>
                            <Nav.Link as={Link} className={`nav-link-custom ${router.pathname === "/partner" ? "active" : ""}`} to="/partner">Partner</Nav.Link>
                            <Nav.Link className="nav-link-custom js-btn-tooltip--custom" data-toggle="tooltip" data-placement="top" title="Coming Soon">Verification</Nav.Link>
                            {/* <Nav.Link as={Link} to="/contact-us" className={`nav-link-custom ${router.pathname === "/contact-us" ? "active" : ""}`}>Contact</Nav.Link> */}
                            <Nav.Link className="nav-link-custom">
                                <i class="fa fa-github" style={{ "fontSize": "24px" }}></i>
                            </Nav.Link>
                            <Nav.Link className="nav-link-custom">
                                <i class="fa fa-telegram" style={{ "fontSize": "22px" }}></i>

                            </Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Connect />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* <div className=""> */}

        </>
    )
}

export function useRouter() {
    const params = useParams();
    const location = useLocation();

    // Return our custom router object
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
        return {
            // For convenience add push(), replace(), pathname at top level
            push: location.push,
            replace: location.replace,
            pathname: location.pathname,
            // Merge params and parsed query string into single "query" object
            // so that they can be used interchangeably.
            // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
            query: {
                ...queryString.parse(location.search), // Convert string to object
                ...params,
            },
            // Include match, location, history objects so we have
            // access to extra React Router functionality if needed.
            location,

        };
    }, [params, location]);
}


export default Header