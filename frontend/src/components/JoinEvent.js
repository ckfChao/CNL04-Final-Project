import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import services from "../services";
import Loading from "./Loading";

function JoinEvent() {
    const authState = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
            services.joinEvent.getJoinEventData()
            .then((res) => {
                setEventData(res.data.data)
                setIsLoading(true);
            })
            .catch((err) => {
                
            })
        }, []);
    
     if (authState.isAuth === true) {
        if (isLoading === false) {
            return <Loading/>
        }

        if (authState.character === "customer") {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">The events you may interset:</h1>
                    </div>
                    {eventData.map((event) => (
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
                                    Detail
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <Error/>;
        }
     } else {
        return <Error/>;
     }
}

export default JoinEvent;