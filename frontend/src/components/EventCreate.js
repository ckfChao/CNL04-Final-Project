import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import React,{ useContext } from 'react';
import { useEffect, useState } from "react";
import authContext from "./Auth";
import Error from "./Error";
import DateTimePicker from 'react-datetime-picker';
import services from "../services";


function EventCreate() {
    const authState = useContext(authContext);

    const [errMsg, setErrMsg] = useState(false);
    const [succMsg, setSuccMsg] = useState(false);
    const [invite_start, setInvite_start] = useState(new Date());
    const [invite_end, setInvite_end] = useState(new Date());
    const [event_start, setEvent_start] = useState(new Date());
    const [event_end, setEvent_end] = useState(new Date());

    const [readOnly, setReadOnly] = useState(false);
    const [textInput, setTextInput] = useState({
        event_name: "",
        reward: "",
    });

    const { event_name, reward} = textInput;

    const handleTextInputChange = ({ target: { name, value } }) => {
        setTextInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validDataTime = (t1, t2, t3, t4) => {
        return t1 > t2 && t2 > t3 && t3 > t4;
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        if (validDataTime(event_end, event_start, invite_end, invite_start)) {
            setReadOnly(true);
            let new_invite_start = invite_start.toISOString();
            let new_invite_end = invite_end.toISOString();
            let new_event_start = event_start.toISOString();
            let new_event_end = event_end.toISOString();

            new_invite_start = new_invite_start.slice(0, new_invite_start.indexOf('.'));
            new_invite_end = new_invite_end.slice(0, new_invite_end.indexOf('.'));
            new_event_start = new_event_start.slice(0, new_event_start.indexOf('.'));
            new_event_end = new_event_end.slice(0, new_event_end.indexOf('.'));

            let data = {
                "event_name": event_name,
                "reward": reward,
                "invite_start": new_invite_start,
                "invite_end": new_invite_end,
                "event_start": new_event_start,
                "event_end": new_event_end,
            }
            services.events.addOneEvent(data)
            .then((res) => {
                setTextInput({
                    event_name: "",
                    reward: "",
                });
                setInvite_start(new Date());
                setInvite_end(new Date());
                setEvent_start(new Date());
                setEvent_end(new Date());
                setReadOnly(false)
                setSuccMsg(true);
                setErrMsg(false);
            }).catch((err) => {
                setReadOnly(false)
                setErrMsg(true);
            });
        } else {
            setErrMsg(true);
        }
    };

    if (authState.isAuth === true && authState.character === "store") {
        return (<div className="flex flex-wrap justify-center items-center">
                    <div className="w-full lg:w-3/5 mt-10">
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">Create a event:</h1>
                    </div>
                    <form onSubmit={handleFormSubmit} className="w-full lg:w-3/5 mt-8">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="event_name">
                                    Event name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="event_name" 
                                    name="event_name"
                                    type="text"
                                    value={event_name}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={handleTextInputChange}
                                    placeholder="The name of event you want"
                                    required
                                    />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="reward">
                                    Reward
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="reward" 
                                    name="reward"
                                    type="text" 
                                    value={reward}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    onChange={handleTextInputChange}
                                    placeholder="e.g. 20% off"
                                    required
                                    />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="invite_start">
                                Invitation start time
                            </label>
                            <DateTimePicker  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                id="invite_start"
                                name="invite_start"
                                value={invite_start} 
                                disabled={readOnly}
                                onChange={setInvite_start}
                                required
                            />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="invite_end">
                                Invitation end time
                            </label>
                            <DateTimePicker  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                id="invite_end"
                                name="invite_end"
                                value={invite_end} 
                                disabled={readOnly}
                                onChange={setInvite_end}
                                required
                            />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="event_start">
                                Event start time
                            </label>
                            <DateTimePicker  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                id="event_start"
                                name="event_start"
                                value={event_start} 
                                disabled={readOnly}
                                onChange={setEvent_start}
                                required
                            />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="event_end">
                                Event end time
                            </label>
                            <DateTimePicker  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                id="event_end"
                                name="event_end"
                                value={event_end} 
                                disabled={readOnly}
                                onChange={setEvent_end}
                                required
                            />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <button
                                type="submit"
                                className="mt-8 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                disabled={readOnly}
                                >
                                Create event
                                </button>
                            </div>
                            {errMsg ? <div class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span class="block sm:inline">There was a problem when you create a evnet.</span>
                            </div> : null}
                            {succMsg ? <div class="mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <span class="block sm:inline">The event created successful.</span>
                            </div> : null}
                        </div>
                    </form>
                </div>);
    } else {
        return <Error/>;
    }
}

export default EventCreate;