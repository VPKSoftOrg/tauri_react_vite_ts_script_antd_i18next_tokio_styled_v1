import * as React from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { exit } from "@tauri-apps/api/process";
import { styled } from "styled-components";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { StyledTitle } from "./components/app/WindowTitle";
import { useTranslate } from "./localization/Localization";
import { AppMenu } from "./menu/AppMenu";
import { MenuKeys, appMenuItems } from "./menu/MenuItems";
import { AboutPopup } from "./components/popups/AboutPopup";
import { AppToolbar } from "./menu/AppToolbar";
import { appToolbarItems } from "./menu/ToolbarItems";
import { PreferencesPopup } from "./components/popups/PreferencesPopup";
import { useSettings } from "./utilities/app/Settings";
import { useWindowStateSaver } from "./hooks/UseWindowStateListener";

const textColor = "white";
const backColor = "#199CF4";

/**
 * Renders the main application component.
 *
 * @return {JSX.Element} The rendered application component.
 */
const App = () => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [aboutPopupVisible, setAboutPopupVisible] = React.useState(false);
    const [preferencesVisible, setPreferencesVisible] = React.useState(false);
    const [settings, settingsLoaded, updateSettings] = useSettings();

    const { setStateSaverEnabled, restoreState } = useWindowStateSaver(10_000);

    React.useEffect(() => {
        if (settingsLoaded && settings !== null) {
            setStateSaverEnabled(settings.save_window_state);
            void restoreState();
        }
    }, [restoreState, settingsLoaded, settings, setStateSaverEnabled]);

    const { translate, setLocale } = useTranslate();

    React.useEffect(() => {
        if (settings) {
            void setLocale(settings.locale);
        }
    }, [setLocale, settings]);

    const greet = React.useCallback(async () => {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name }));
    }, [name]);

    const onClose = React.useCallback(() => {
        return false;
    }, []);

    const onSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            void greet();
        },
        [greet]
    );

    const aboutPopupClose = React.useCallback(() => {
        setAboutPopupVisible(false);
    }, []);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const menuItems = React.useMemo(() => {
        return appMenuItems(translate);
    }, [translate]);

    const onMenuItemClick = React.useCallback((key: unknown) => {
        const keyValue = key as MenuKeys;
        switch (keyValue) {
            case "exitMenu": {
                void exit(0);
                break;
            }
            case "aboutMenu": {
                setAboutPopupVisible(true);
                break;
            }
            case "preferencesMenu": {
                setPreferencesVisible(true);
                break;
            }
            default: {
                break;
            }
        }
    }, []);

    const onPreferencesClose = React.useCallback(() => {
        setPreferencesVisible(false);
    }, []);

    if (!settingsLoaded || settings === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <StyledTitle //
                title={"TauriTemplate"}
                onClose={onClose}
                textColor={textColor}
                backColor={backColor}
                maximizeTitle={translate("maximize")}
                minimizeTitle={translate("minimize")}
                closeTitle={translate("close")}
            />
            <div className="AppMenu">
                <AppMenu //
                    items={menuItems}
                    onItemClick={onMenuItemClick}
                />
                <AppToolbar //
                    toolBarItems={appToolbarItems(translate)}
                    onItemClick={onMenuItemClick}
                />
            </div>
            <div>
                <h1>Welcome to Tauri!</h1>

                <div className="row">
                    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                        <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                    </a>
                    <a href="https://tauri.app" target="_blank" rel="noreferrer">
                        <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                    </a>
                    <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>

                <div className="row">
                    <p>Click on the Tauri, Vite, and React logos to learn more.</p>
                </div>

                <form className="row" onSubmit={onSubmit}>
                    <input id="greet-input" onChange={onChange} placeholder={translate("enterNameHolder")} />
                    <button type="submit">Greet</button>
                </form>

                <div className="row">
                    <p>{greetMsg}</p>
                </div>
            </div>
            <AboutPopup //
                visible={aboutPopupVisible}
                onClose={aboutPopupClose}
                textColor={textColor}
            />
            {updateSettings && (
                <PreferencesPopup //
                    visible={preferencesVisible}
                    onClose={onPreferencesClose}
                    updateSettings={updateSettings}
                    settings={settings}
                    translate={translate}
                />
            )}
        </>
    );
};

const SyledApp = styled(App)`
    height: 100%;
    width: 100%;
    display: contents;
    .AppMenu {
        display: flex;
        flex-direction: column;
        min-height: 0px;
        margin-bottom: 10px;
    }
`;

export { SyledApp as App };
