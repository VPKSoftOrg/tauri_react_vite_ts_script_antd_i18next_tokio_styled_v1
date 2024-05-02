//@ts-expect-error - React is required for JSX
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faGear, faInfo } from "@fortawesome/free-solid-svg-icons";
import { LocalizeFunction } from "../localization/Localization";

import { ToolBarItem, ToolBarSeparator } from "./AppToolbar";
import { MenuKeys } from "./MenuItems";

export const appToolbarItems = (localize?: LocalizeFunction): (ToolBarItem<MenuKeys> | ToolBarSeparator)[] => [
    {
        icon: <FontAwesomeIcon icon={faGear} />,
        title: localize?.("preferences") ?? "Preferences",
        tooltipTitle: localize?.("preferences") ?? "Preferences",
        clickActionObject: "preferencesMenu",
    },
    {
        icon: <FontAwesomeIcon icon={faDoorOpen} />,
        title: localize?.("exitMenu") ?? "Exit",
        tooltipTitle: localize?.("exitMenu") ?? "Exit",
        clickActionObject: "exitMenu",
    },
    "|",
    {
        icon: <FontAwesomeIcon icon={faInfo} />,
        title: localize?.("aboutMenu") ?? "About",
        tooltipTitle: localize?.("aboutMenu") ?? "About",
        clickActionObject: "aboutMenu",
    },
];
