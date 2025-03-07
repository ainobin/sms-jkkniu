import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";

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
            // console.log("verifyUser: ");
            
            try {
                const response = await axios.get("http://localhost:3000/api/v1/users/me", {
                    withCredentials : true
                })

                if (response.data) {
                    setUser({
                        id: response.data.data._id,
                        fullName: response.data.data.fullName,
                        email: response.data.data.email,
                        department: response.data.data.department,
                        designation: response.data.data.designation,
                        role: response.data.data.role,
                        signature: response.data.data.signature,
                    })
                    setIsLoggedIn(true);
                }
                // console.log("User: ",user);
                console.log("isLoggedIn: ",isLoggedIn);
                
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
