import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import services from "./services";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import authContext from "./components/Auth";


function App() {
   const [ authState, setAuthState] = useState({
    isAuth: false,
    character: null
   });
   useEffect(() => {
    services.auth.validSession()
      .then( (res) => {
          console.log(res.status);
          console.log("GG");
          setAuthState({
            isAuth: true,
            character: res.data.character
          })
      })
      .catch( (err) => {
          setAuthState({
            isAuth: false,
            character: null
          })
      });
    }, []);

    return (
      <authContext.Provider value={{isAuth: authState.isAuth, character: authState.character}}>
        <div>
            <HashRouter>
              <Navbar />
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<div>React Router Not Implement</div>} />
              </Routes>
            </HashRouter>
          </div>
      </authContext.Provider>
    );
}

export default App;
