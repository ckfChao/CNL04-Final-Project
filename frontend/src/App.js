import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
    return (
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
    );
}

export default App;
