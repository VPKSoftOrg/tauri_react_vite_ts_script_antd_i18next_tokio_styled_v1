import * as React from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { exit } from "@tauri-apps/api/process";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { StyledTitle } from "./components/app/WindowTitle";
import { styled } from "styled-components";
import { useTranslate } from "./localization/Localization";
import { AppMenu } from "./menu/AppMenu";
import { MenuKeys, appMenuItems } from "./menu/MenuItems";

const textColor = "white";
const backColor = "#f05b41";

/**
 * Renders the main application component.
 *
 * @return {JSX.Element} The rendered application component.
 */
const App = () => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const { translate } = useTranslate();

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

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const menuItems = React.useMemo(() => {
        return appMenuItems(translate);
    }, [translate]);

    const onMenuItemClick = React.useCallback((key: string) => {
        const keyValue = key as MenuKeys;
        switch (keyValue) {
            case "exitMenu": {
                void exit(0);
                break;
            }
            default: {
                break;
            }
        }
    }, []);

    return (
        <>
            <StyledTitle //
                title={"TauriTemplate"}
                onClose={onClose}
                textColor={textColor}
                backColor={backColor}
            />
            <div className="AppMenu">
                <AppMenu //
                    items={menuItems}
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

                <p>Click on the Tauri, Vite, and React logos to learn more.</p>

                <form className="row" onSubmit={onSubmit}>
                    <input id="greet-input" onChange={onChange} placeholder={translate("enterNameHolder")} />
                    <button type="submit">Greet</button>
                </form>

                <p>{greetMsg}</p>
            </div>
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
