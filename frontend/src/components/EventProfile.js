import { Link, useParams } from "react-router-dom";
import React,{useContext} from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import services from "../services";
import Loading from "./Loading";

function EventProfile() {
    const authState = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [eventIDData, setEvnetIDData] = useState({});
    const [username, setUsername] = useState("");
   const [readOnly, setReadOnly] = useState(false);
   const [errMsg, setErrMsg] = useState(false);
   const [succMsg, setSuccMsg] = useState(false);
    let { id } = useParams();

    useEffect(() => {
        services.events.getEventDataById(id)
        .then((res) => {
            setEvnetIDData(res.data);
            setIsLoading(true);
        })
        .catch((err) => {
        })
    }, []);

    var usernameOnChange = ({target: {name, value}}) => {
       setUsername(value); 
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setReadOnly(true);
        services.invite
            .addInvite({username, id})
            .then((res) => {
                setSuccMsg(true);
                setUsername("");
                setReadOnly(false);
            })
            .catch((err) => {
                setReadOnly(false);
                setUsername("");
                setErrMsg(true);
            });
    };

    const handleJoinEvent = (event) => {
        event.preventDefault();
        setReadOnly(true);
        services.joinEvent.joinEventByID(id)
        .then((res) => {
            setSuccMsg(true);
            setErrMsg(false);
            setReadOnly(false);
        })
        .catch((err) => {
            setSuccMsg(false);
            setErrMsg(true);
            setReadOnly(false);
        })
    }

    if (authState.isAuth === true) {
        if (isLoading === false) {
            return <Loading/>
        }

        if (authState.character === "store") {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">The event:</h1>
                    </div>
                    <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                        <div className="flex items-center">
                            <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{eventIDData["event_name"]}</h2>
                        </div>
                        <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                            Reward: {eventIDData["reward"]}
                        </div>
                        <div className="flex items-center mt-1 mb-1 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Invitation time: {eventIDData["invite_start"]} ~ {eventIDData["invite_end"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Time of event: {eventIDData["event_start"]} ~ {eventIDData["event_end"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            Partners: {eventIDData["partners"].join(", ")}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            number of participant (customer): {eventIDData["count_partic"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            number of participant finish the event (customer): {eventIDData["finish_count_partic"]}
                        </div>
                    </div>
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Invite the store you want:</h1>
                    </div>
                    <form onSubmit={handleFormSubmit} className="w-full lg:w-3/5 mt-8">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="username">
                                    store name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="username" 
                                    name="username"
                                    type="text"
                                    value={username}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={usernameOnChange}
                                    placeholder="input the username of store which you want to inite"
                                    required
                                    />
                            </div>
                            <div className="w-full px-3">
                            <button
                            type="submit"
                            className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            disabled={readOnly}
                            >
                            invite
                            </button>
                            </div>
                        </div>
                        {errMsg ? <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">There was a problem.</span>
                        </div> : null}
                        {succMsg ? <div className="mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">invite successful.</span>
                        </div> : null}
                    </form>
                </div>
            );
        } else if (authState.character === "customer") {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">The event:</h1>
                    </div>
                    <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                        <div className="flex items-center">
                            <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{eventIDData["event_name"]}</h2>
                        </div>
                        <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                            Reward: {eventIDData["reward"]}
                        </div>
                        <div className="flex items-center mt-1 mb-1 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Invitation time: {eventIDData["invite_start"]} ~ {eventIDData["invite_end"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Time of event: {eventIDData["event_start"]} ~ {eventIDData["event_end"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            Partners: {eventIDData["partners"].join(", ")}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            number of participant (customer): {eventIDData["count_partic"]}
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                            number of participant finish the event (customer): {eventIDData["finish_count_partic"]}
                        </div>
                        <div className="w-full px-3">
                            <button
                            onClick={handleJoinEvent}
                            className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            disabled={readOnly}
                            >
                            Join the event
                        </button>
                        </div>
                    </div>
                    <div className="w-full  lg:w-3/5 mt-10">
                    {errMsg ? <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">There was a problem for joining the event.</span>
                        </div> : null}
                    {succMsg ? <div className="mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">join successful.</span>
                    </div> : null}
                    </div>
                </div>);
        } else {
            return (<Error/>)
        }
    } else {
        return (<Error/>);
    }
}

export default EventProfile;

