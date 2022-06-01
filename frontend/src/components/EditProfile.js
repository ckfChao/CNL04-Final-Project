import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import React,{ useContext } from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import DateTimePicker from 'react-datetime-picker';
import services from "../services";

function EditProfile() {
    const authState = useContext(authContext);
    const [readOnly, setReadOnly] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [succMsg, setSuccMsg] = useState(false);

    const [textInput, setTextInput] = useState({
        store_name: "",
        address: "",
        intro: ""
    });

    const {store_name, address, intro} = textInput;

    const handleTextInputChange = ({ target: { name, value } }) => {
        setTextInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setReadOnly(true);
        var data = {};
        if (store_name.length > 0) {
            data["store_name"] = store_name;
        }
        if (address.length > 0) {
            data["address"] = address;
        }
        if (intro.length > 0) {
            data["intro"] = intro;
        }
        services.info.updateInfo(data)
        .then((res) => {
            setReadOnly(false);
            setErrMsg(false);
            setSuccMsg(true);
        })
        .catch((err) => {
            setReadOnly(false);
            setErrMsg(true);
            setSuccMsg(false);
        })
    }

    if (authState.isAuth === true && authState.character === "store") {
        return (
            <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Edit your profile:</h1>
                    </div>
                    <form onSubmit={handleFormSubmit} className="w-full lg:w-3/5 mt-8">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="event_name">
                                    store name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="store_name" 
                                    name="store_name"
                                    type="text"
                                    value={store_name}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={handleTextInputChange}
                                    />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="reward">
                                    address
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="address" 
                                    name="address"
                                    type="text" 
                                    value={address}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={handleTextInputChange}
                                    />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="reward">
                                    intro
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="intro" 
                                    name="intro"
                                    type="text" 
                                    value={intro}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={handleTextInputChange}
                                    />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                                <button
                                type="submit"
                                className="mt-8 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                disabled={readOnly}
                                >
                                Edit
                                </button>
                            </div>
                            {errMsg ? <div class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span class="block sm:inline">There was a problem.</span>
                            </div> : null}
                            {succMsg ? <div class="mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <span class="block sm:inline">update successful.</span>
                            </div> : null}
                     </form>
                </div>
        );
    } else {
        return <Error/>;
    }
}

export default EditProfile;