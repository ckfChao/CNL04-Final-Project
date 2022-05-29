import { useState } from "react";
import { Link } from "react-router-dom";
import React from 'react';

import services from "../services";

function Login() {
   const [readOnly, setReadOnly] = useState(false);
   const [errMsg, setErrMsg] = useState(false);
   const [textInput, setTextInput] = useState({
    username: "",
    password: "",
    character: "",
  });
  
  const { username, password, character } = textInput;

  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleFormSubmit = (event) => {
      event.preventDefault();
      setReadOnly(true);
      services.auth
         .login({ username, password, character })
         .then((res) => {
            // do some redirect
            
         })
         .catch((err) => {
            setReadOnly(false);
            setErrMsg(true);
         });
   };

   return (
      <div>
         <section className="h-screen">
  <div className="px-6 h-full text-gray-800">
    <div
      className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
    >
      <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
        <form onSubmit={handleFormSubmit}>

          <div
            className="flex items-center my-10 text-2xl font-extrabold"
          >
            Please login your account
          </div>

          <div className="mb-6">
            <input
              type="text"
              name="username"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              placeholder="User name"
              value={username}
              readOnly={readOnly}
              disabled={readOnly}
              onChange={handleTextInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              placeholder="Password"
              value={password}
              readOnly={readOnly}
              disabled={readOnly}
              onChange={handleTextInputChange}
              required
            />
          </div>

            <div className="mb-6">
               <select name="character" required className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                  value={character}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={handleTextInputChange}
                  >
                  <option value="" disabled selected>Choose your character</option>
                  <option value="store">Store</option>
                  <option value="costumer">costumer</option>
               </select>
            </div>


          <div className="text-center lg:text-left">
            <button
              type="submit"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              disabled={readOnly}
            >
              Login
            </button>
            <p className="text-sm font-semibold mt-2 pt-1 mb-0">
              Don't have an account?
              <Link className="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out" to="/signup"> Sign up</Link>
            </p>
            {errMsg ? <div class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">There was a problem with your login.</span>
            </div> : null}
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
      </div>
   );
}

export default Login;