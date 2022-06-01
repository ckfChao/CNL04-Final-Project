import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import services from "../services";
import Loading from "./Loading";


function Dashboard() {
    const authState = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [selfEventData, setSelfEventData] = useState({});

    useEffect(() => {
        services.info.getInfo()
        .then((res) => {
            setUserData(res.data);
            services.events.getSelfEventData()
            .then((res) => {
                setSelfEventData(res.data.data);
                setIsLoading(true);
            })
        })
        .catch((err) => {
            
        })
    }, []);

    if (authState.isAuth === true) {
        if (isLoading === false) {
            return <Loading/>;
        }

        if (authState.character === "store") {
             return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Profile:</h1>
                    </div>
                    <div className="break"></div>
                    <div id="profile" className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0 mt-10">
                        <div className="p-4 md:p-12 text-center lg:text-left">
                            <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"></div>
                        
                            <h1 className="text-3xl font-bold pt-8 lg:pt-0">{userData["store name"]}</h1>
                            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                            <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            address: {userData.address}
                            </p>
                            <p className="pt-8 text-sm">
                                {userData.intro}
                            </p>
                            <div className="flex justify-end items-end">
                                <Link className="inline-flex items-center h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800" to="/profile/edit">Edit</Link>
                            </div>
                        </div>
                    </div>
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Your events:</h1>
                    </div>

                    {selfEventData.map((event) => (
                        <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{event["event_name"]}</h2>
                            </div>
                            <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                                Reward: {event["reward"]}
                            </div>
                            <div className="flex items-center mt-1 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Invitation time: {event["invite_start"]} ~ {event["invite_end"]}
                            </div>
                            <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Time of event: {event["event_start"]} ~ {event["event_end"]}
                            </div>
                            <div className="flex">
                                <Link to={"/events/" + event["id"]}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                                    Manage
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {selfEventData.length <= 0 && <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">You don't have any events.</h2>
                            </div>
                            <div className="flex mt-2">
                                <Link to={"/events/create"}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Create a event.
                                    </button>
                                </Link>
                            </div>
                        </div>} 
                    {selfEventData.length > 0 && <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">You can create a new event.</h2>
                            </div>
                            <div className="flex mt-2">
                                <Link to={"/events/create"}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Create a event.
                                    </button>
                                </Link>
                            </div>
                        </div>} 
                </div>
                );
        } else if (authState.character === "customer") {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Welcome, customer {userData.username}. </h1>
                    </div>
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h2 className="text-3xl font-bold pt-8 lg:pt-0">Joined Event</h2>
                    </div>
                    {selfEventData["unfinish"].map((event) => (
                        <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{event["event_name"]}</h2>
                            </div>
                            <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                                Reward: {event["reward"]}
                            </div>
                            <div className="flex items-center mt-1 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Invitation time: {event["invite_start"]} ~ {event["invite_end"]}
                            </div>
                            <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Time of event: {event["event_start"]} ~ {event["event_end"]}
                            </div>
                            <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                                Progress:  {event["progress"].map( (record) => {
                                    return <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">{record["store_name"]}
                                    {record["is_arrive"] ? <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>},
                                    </div> 
                                })}
                            </div>
                            <div className="flex">
                                <Link to={"/events/" + event["id"]}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                                    Manage
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {selfEventData["unfinish"].length <= 0 && <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">You don't have joined any event</h2>
                            </div>
                            <div className="flex mt-2">
                                <Link to={"/events/join"}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Join event
                                    </button>
                                </Link>
                            </div>
                        </div>} 
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h2 className="text-3xl font-bold pt-8 lg:pt-0">finished event:</h2>
                    </div>
                    {selfEventData["finish"].map((event) => (
                        <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{event["event_name"]}</h2>
                            </div>
                            <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                                Reward: {event["reward"]}
                            </div>
                            <div className="flex items-center mt-1 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Invitation time: {event["invite_start"]} ~ {event["invite_end"]}
                            </div>
                            <div className="flex items-center mt-1 mb-2 text-sm text-gray-700 dark:text-gray-300">
                                <svg className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Time of event: {event["event_start"]} ~ {event["event_end"]}
                            </div>
                            <div className="flex">
                                <Link to={"/events/" + event["id"]}>
                                    <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                                    Manage
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {selfEventData["finish"].length <= 0 && <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">You don't have finish any event</h2>
                            </div>
                        </div>}
                </div>
            );
        } else {
            return (<Error/>);
        }
    } else {
        return (<Error/>);
    }
}

export default Dashboard;