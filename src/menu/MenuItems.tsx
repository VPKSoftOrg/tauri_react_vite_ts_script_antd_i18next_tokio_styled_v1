import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDoorOpen, faCircleQuestion, faInfo } from "@fortawesome/free-solid-svg-icons";
import { LocalizeFunction } from "../localization/Localization";
import { MenuItems } from "./AppMenu";

export const appMenuItems = (localize?: LocalizeFunction): MenuItems => [
    {
        key: "fileMenu",
        label: localize?.("fileMenu") ?? "File",
        icon: <FontAwesomeIcon icon={faFile} />,
        children: [
            {
                key: "exitMenu",
                label: localize?.("exitMenu") ?? "Exit",
                icon: <FontAwesomeIcon icon={faDoorOpen} />,
            },
        ],
    },
    {
        key: "helpMenu",
        label: localize?.("helpMenu") ?? "Help",
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        children: [
            {
                key: "aboutMenu",
                label: localize?.("aboutMenu") ?? "About",
                icon: <FontAwesomeIcon icon={faInfo} />,
            },
        ],
    },
];

export type MenuKeys = "fileMenu" | "helpMenu" | "aboutMenu" | "exitMenu";
