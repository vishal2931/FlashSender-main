import React from 'react';
import 'react-rangeslider/lib/index.css'
import './App.css';
import Header from './Component/Header';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from './context/context';
import Referral from './pages/Referral';
import AboutUs from './pages/AboutUs';
import Partner from './pages/Partner';
import Tutorial from './pages/Tutorial';


function App() {



  return (
    <>
      
        <ContextProvider>
          <Router>

            <ToastContainer pauseOnFocusLoss={false} />
            <Header />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/referral">
                <Referral />
              </Route>
              <Route exact path="/contact-us">
                <AboutUs />
              </Route>
              <Route exact path="/partner">
                <Partner />
              </Route>
              <Route exact path="/tutorial">
                <Tutorial />
              </Route>
            </Switch>

          </Router>
        </ContextProvider>
     
    </>
  );
}

export default App;
