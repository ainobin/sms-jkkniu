import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import config from "../config/config.js";

const UserContextProvider = ({ children }) => {  // ✅ Fixed function name
    const [user, setUser] = useState({
        id: "",
        fullName: "",
        email: "",
        department: "",
        designation: "",
        role: "",
        signature: "",
    });
    
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Fixed spelling
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            console.log("verifyUser: ");
            
            try {
                const response = await axios.get(`${config.serverUrl}/users/me`, {
                    withCredentials : true,
                    
                    // This is the key change - tell axios to accept 401 status as valid
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // Accept 401 as non-error
                    }
                })

                console.log(response)

                if (response.status === 200 && response?.data) {
                    setUser({
                        id: response.data.data._id,
                        fullName: response.data.data.fullName,
                        email: response.data.data.email,
                        department: response.data.data.department,
                        designation: response.data.data.designation,
                        role: response.data.data.role,
                        signature: response.data.data.signature,
                    });
                    setIsLoggedIn(true);
                }
                else if (response.status === 401) {
                    // Handle 401 silently (no console error)
                    setUser({
                        id: "",
                        fullName: "",
                        email: "",
                        department: "",
                        designation: "",
                        role: "",
                        signature: "",
                    });
                    setIsLoggedIn(false);
                }
                
            } catch (error) {
                setUser({
                    id: "",
                    fullName: "",
                    email: "",
                    department: "",
                    designation: "",
                    role: "",
                    signature: "",
                });
                setIsLoggedIn(false);               
            } finally{
                setIsLoading(false);
            }
        }
        verifyUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
