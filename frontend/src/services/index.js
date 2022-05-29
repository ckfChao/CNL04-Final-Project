import axios from "axios";
import { makeAuth } from "./auth";

const services = {};

const instance = axios.create({
  baseURL: "/api/",
});

services.auth = makeAuth(instance);

export default services;
