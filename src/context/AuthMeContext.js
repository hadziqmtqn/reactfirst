import React, { createContext, useContext, useEffect, useState }
    from "react";

import axios from "../api/axios";

const AuthMeContext = createContext(undefined);

export const useAuthMe = () => useContext(AuthMeContext);

export function AuthMeProvider({ children }) {
    const [authMe, setAuthMe] = useState({
        name: "",
        email: "",
        avatar: ""
    });

    useEffect(() => {
        async function fetchAuthMe() {
            try {
                const res = await axios.get("/auth/me");
                if (res.data.success && res.data.data) {
                    setAuthMe(res.data.data);
                }
            } catch (e) {
                // Handle error if needed
            }
        }
        fetchAuthMe();
    }, []);

    return (
        <AuthMeContext.Provider value={authMe}>
            {children}
        </AuthMeContext.Provider>
    );
}