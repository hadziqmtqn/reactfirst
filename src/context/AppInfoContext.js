import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppInfoContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const useAppInfo = () => useContext(AppInfoContext);

export function AppInfoProvider({ children }) {
    const [info, setInfo] = useState({ appName: "", appLogo: "" });

    useEffect(() => {
        async function fetchAppInfo() {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get(`${API_URL}/app`, { headers });
                
                if (res.data.success && res.data.data) {
                    setInfo({
                        appName: res.data.data.appName,
                        appLogo: res.data.data.appLogo
                    });
                }
            } catch (e) {
                // fallback, bisa tambahkan error handling jika perlu
            }
        }
        fetchAppInfo();
    }, []);

    return (
        <AppInfoContext.Provider value={info}>
            {children}
        </AppInfoContext.Provider>
    );
}