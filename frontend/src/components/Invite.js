import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import services from "../services";
import Loading from "./Loading";

function Invite() {
    const authState = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteData, setInviteData] = useState([]);

    useEffect(() => {
        services.invite.getInvite()
        .then((res) => {
            setInviteData(res.data.data);
            setIsLoading(true);
        })
        .catch((err) => {
        })
    }, []);

    const handleAppectReject = (event) => {
        var splited = event.target.value.split(" ");
        var id = splited[1]
        if (splited[0] === "patch") {
            services.invite.accpet(id)
            .then((res) => {
                setIsLoading(false);
                services.invite.getInvite()
                .then((res2) => {
                    setInviteData(res2.data.data);
                    setIsLoading(true);
                })
                .catch((err) => {
                })
            })
            .catch((err) => {
            })
        } else if (splited[0] === "delete") {
            services.invite.deleteOne(id)
            .then((res) => {
                setIsLoading(false);
                services.invite.getInvite()
                .then((res2) => {
                    setInviteData(res2.data.data);
                    setIsLoading(true);
                })
                .catch((err) => {
                })
            })
            .catch((err) => {
            })
        }
    }

    if (authState.isAuth === true) {
        if (isLoading === false) {
            return <Loading/>
        }
        
        if (authState.character === "store") {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Your invitation: </h1>
                    </div>
                    {inviteData.length <= 0 && <div className="mt-3 lg:w-3/5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span class="block sm:inline">You don't have any invitation.</span>
                    </div>}
                    {
                        inviteData.map((invite) => (
                            <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                                <div className="flex items-center mt-2 mb-1 text-sm text-gray-700 dark:text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300">{invite.event_owner_username} invite you to event {invite.event_name}</h1>
                                </div>
                                <div className="flex">
                                    <button onClick={handleAppectReject} value={"patch " + invite.invite_id} type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    appect
                                    </button>

                                    <button onClick={handleAppectReject} value={"delete " + invite.invite_id} type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    reject
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            ); 
        } else {
            return (<Error/>)
        }
    } else {
        return (<Error/>);
    }
}

export default Invite;