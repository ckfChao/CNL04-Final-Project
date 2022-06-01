import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import services from "./services";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import EventCreate from "./components/EventCreate";
import authContext from "./components/Auth";
import EventProfile from "./components/EventProfile";
import Invite from "./components/Invite";
import JoinEvent from "./components/JoinEvent";
import Reward from "./components/Reward";
import EditProfile from "./components/EditProfile";


function App() {
   const [ authState, setAuthState] = useState({
    isAuth: false,
    character: null,
   });
   useEffect(() => {
    services.auth.validSession()
      .then( (res) => {
          setAuthState({
            isAuth: true,
            character: res.data.character,
          })
          window.location.replace("/#/dashboard");
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/events/create" element={<EventCreate />} />
                  <Route path="/events/:id" element={<EventProfile />} />
                  <Route path="/events/join" element={<JoinEvent />} />
                  <Route path="/invite" element={<Invite />} />
                  <Route path="/reward" element={<Reward />} />

                  <Route path="*" element={<Error />} />
              </Routes>
            </HashRouter>
          </div>
      </authContext.Provider>
    );
}

export default App;
