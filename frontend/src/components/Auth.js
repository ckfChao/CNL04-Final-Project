import React from "react";

const authContext = React.createContext({
    isAuth: false,
    character: null
});

export default authContext;