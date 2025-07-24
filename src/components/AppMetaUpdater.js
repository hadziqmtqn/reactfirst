import { useAppInfo } from "../context/AppInfoContext";
import { useEffect } from "react";

export default function AppMetaUpdater() {
    const { appName, appLogo } = useAppInfo();

    useEffect(() => {
        if (appName) {
            document.title = appName;
        }
        if (appLogo) {
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = appLogo.startsWith('http')
                    ? appLogo
                    : `${process.env.PUBLIC_URL || ''}/${appLogo}`;
            }
        }
    }, [appName, appLogo]);

    return null;
}