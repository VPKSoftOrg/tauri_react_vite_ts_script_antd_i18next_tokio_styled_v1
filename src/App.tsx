import * as React from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { exit } from "@tauri-apps/api/process";
import { styled } from "styled-components";
import { Button, Form, Input } from "antd";
import classNames from "classnames";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { StyledTitle } from "./components/app/WindowTitle";
import { useTranslate } from "./localization/Localization";
import { MenuKeys, appMenuItems } from "./menu/MenuItems";
import { AboutPopup } from "./components/popups/AboutPopup";
import { PreferencesPopup } from "./components/popups/PreferencesPopup";
import { useSettings } from "./utilities/app/Settings";
import { useWindowStateSaver } from "./hooks/UseWindowStateListener";
import { useAntdTheme, useAntdToken } from "./context/AntdThemeContext";
import { CommonProps } from "./components/Types";
import { AppMenuToolbar } from "./menu/AppMenuToolbar";

type AppProps = CommonProps;

/**
 * Renders the main application component.
 *
 * @return {JSX.Element} The rendered application component.
 */
const App = ({ className }: AppProps) => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [aboutPopupVisible, setAboutPopupVisible] = React.useState(false);
    const [preferencesVisible, setPreferencesVisible] = React.useState(false);
    const [settings, settingsLoaded, updateSettings, reloadSettings] = useSettings();
    const { token } = useAntdToken();
    const { setStateSaverEnabled, restoreState } = useWindowStateSaver(10_000);
    const { setTheme, updateBackround } = useAntdTheme();
    const [previewDarkMode, setPreviewDarkMode] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        if (settingsLoaded && settings !== null) {
            setStateSaverEnabled(settings.save_window_state);
            void restoreState();
        }
    }, [restoreState, settingsLoaded, settings, setStateSaverEnabled]);

    const { translate, setLocale } = useTranslate();

    React.useEffect(() => {
        if (settings && setTheme) {
            void setLocale(settings.locale);
            setTheme(settings.dark_mode ? "dark" : "light");
        }
    }, [setLocale, setTheme, settings]);

    const greet = React.useCallback(async () => {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        if (name.trim().length > 0) {
            setGreetMsg(await invoke("greet", { name }));
        }
    }, [name]);

    React.useEffect(() => {
        void greet();
    }, [greet, name]);

    const onClose = React.useCallback(() => {
        return false;
    }, []);

    const aboutPopupClose = React.useCallback(() => {
        setAboutPopupVisible(false);
    }, []);

    const onFinish = React.useCallback(async (e: { greetName: string }) => {
        setName(e.greetName);
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
        void reloadSettings().then(() => {
            setPreviewDarkMode(null);
            setTheme && setTheme(settings?.dark_mode ? "dark" : "light");
        });
    }, [reloadSettings, setTheme, settings?.dark_mode]);

    // This effect occurs when the theme token has been changed and updates the
    // root and body element colors to match to the new theme.
    React.useEffect(() => {
        updateBackround && updateBackround(token);
    }, [token, updateBackround]);

    const toggleDarkMode = React.useCallback(
        (antdTheme: "light" | "dark") => {
            setTheme && setTheme(antdTheme);
            setPreviewDarkMode(antdTheme === "dark");
        },
        [setTheme]
    );

    if (!settingsLoaded || settings === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <StyledTitle //
                title="TauriTemplate"
                onClose={onClose}
                darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                maximizeTitle={translate("maximize")}
                minimizeTitle={translate("minimize")}
                closeTitle={translate("close")}
            />
            <AppMenuToolbar //
                menuItems={menuItems}
                onItemClick={onMenuItemClick}
            />
            <div //
                className={classNames(App.name, className)}
            >
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

                <Form className="row" onFinish={onFinish}>
                    <Form.Item
                        name="greetName"
                        rules={[
                            {
                                required: true,
                                message: translate("enterNameHolder"),
                            },
                        ]}
                    >
                        <Input id="greet-input" />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                <div className="row">
                    <p>{greetMsg}</p>
                </div>
            </div>
            <AboutPopup //
                visible={aboutPopupVisible}
                onClose={aboutPopupClose}
                textColor="white"
            />
            {updateSettings && (
                <PreferencesPopup //
                    visible={preferencesVisible}
                    onClose={onPreferencesClose}
                    updateSettings={updateSettings}
                    settings={settings}
                    translate={translate}
                    toggleDarkMode={toggleDarkMode}
                />
            )}
        </>
    );
};

const SyledApp = styled(App)`
    height: 100%;
    width: 100%;
    display: contents;
`;

export { SyledApp as App };
