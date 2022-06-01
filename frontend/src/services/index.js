import axios from "axios";
import { makeAuth } from "./auth";
import { makeInfo } from "./info";
import { makeEvent } from "./event";
import { makeInvite } from "./invite";
import { makeJoinEvent } from "./joinEvent";
import { makeReward } from "./reward";

const services = {};

const instance = axios.create({
  baseURL: "/api/",
});

services.auth = makeAuth(instance);
services.info = makeInfo(instance);
services.events = makeEvent(instance);
services.invite = makeInvite(instance);
services.joinEvent = makeJoinEvent(instance);
services.reward = makeReward(instance);

export default services;
