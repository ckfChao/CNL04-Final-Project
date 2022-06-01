import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import services from "../services";
import Loading from "./Loading";

function Reward() {
    const authState = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const [rewardData, setRewardDate] = useState([]);

    useEffect(() => {
        services.reward.getReward()
        .then((res) => {
            setRewardDate(res.data.data);
            console.log(res.data.data);
            setIsLoading(true);
        })
        .catch((err) => {
            
        })
    }, []);

    if (authState.isAuth === true && authState.character === "customer") {
        if (isLoading === false) {
            return <Loading/>
        }
        return (
            <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full  lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Rewards:</h1>
                    </div>
                    {rewardData.map((reward) => (
                        <div id="alert-additional-content-5" className="mt-5 lg:w-3/5 p-4 bg-gray-100 rounded-lg dark:bg-gray-700" role="alert">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{reward["reward"]}</h2>
                            </div>
                            <div className="flex mt-2">
                                <button type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                                use
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
        )
    } else {
        return <Error/>
    }
}

export default Reward;