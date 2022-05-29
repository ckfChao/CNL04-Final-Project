import React from 'react';
import { useState } from "react";

import services from "../services";
import { Link } from "react-router-dom";

function Signup() {
   const [readOnly, setReadOnly] = useState(false);
   const [errMsg, setErrMsg] = useState(false);
   const [succMsg, setSuccMsg] = useState(false);
   const [textInput, setTextInput] = useState({
    username: "",
    password: "",
    character: "",
  });

  const [error, setError] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    character: ""
  })

  const { username, password, confirmPassword, character } = textInput;

  const validateInput = (name, value) => {
    setError(prev => {
        const stateObj = { ...prev, [name]: "" };
        switch (name) {
        case "username":
            if (!value) {
               stateObj[name] = "Please enter Username.";
            } else {
               stateObj[name] = "";
            }
            break;
    
        case "password":
            if (!value) {
                stateObj[name] = "Please enter Password.";
            } else if (textInput.confirmPassword && value !== textInput.confirmPassword) {
                stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
            } else {
                stateObj["confirmPassword"] = textInput.confirmPassword ? "" : error.confirmPassword;
            }
            break;
    
        case "confirmPassword":
            if (!value) {
                stateObj[name] = "Please enter Confirm Password.";
            } else if (textInput.password && value !== textInput.password) {
                stateObj[name] = "Password and Confirm Password does not match.";
            } else {
               stateObj[name] = "";
            }
            break;
         
         case "character":
            if (!value) {
                stateObj[name] = "Please select character.";
            } else {
               stateObj[name] = "";
            }
            break;

        default:
            break;
        }
        return stateObj;
    });
    }

  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(name, value)
  };

   const handleFormSubmit = (event) => {
      event.preventDefault();

      validateInput("username", username);
      validateInput("password", password);
      validateInput("confirmPassword", confirmPassword);
      validateInput("character", character);

      if (error.username === "" && error.password === "" && error.confirmPassword === "" && error.character === "") {
         setReadOnly(true);
         services.auth
            .signUp({ username, password, character })
            .then((res) => {
               setTextInput({username: "", password: "", confirmPassword: "", character: ""});
               setSuccMsg(true);
            })
            .catch((err) => {
               setTextInput({username: "", password: "", confirmPassword: "", character: ""});
               setReadOnly(false);
               setErrMsg(true);
            });
      }
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
            Sign up for free
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

          {error.username ? <div class="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">{error.username}</span>
            </div> : null}

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

          {error.password ? <div class="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">{error.password}</span>
            </div> : null}

          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              placeholder="Rely your Password"
              value={confirmPassword}
              readOnly={readOnly}
              disabled={readOnly}
              onChange={handleTextInputChange}
              required
            />
          </div>
           
           {error.confirmPassword ? <div class="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">{error.confirmPassword}</span>
            </div> : null}

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

            {error.character ? <div class="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">{error.character}</span>
            </div> : null}


          <div className="text-center lg:text-left">
            <button
              type="submit"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              disabled={readOnly}
            >
              Sign up
            </button>
            {errMsg ? <div class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">There was a problem with your sign up.</span>
            </div> : null}
            {succMsg ? <div class="mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
               <span class="block sm:inline">Account create successful and you can <Link className="underline font-bold" to="/login">login</Link> your account.</span>
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

export default Signup;