/*
MIT License

Copyright (c) 2024 #COPYRIGHT#

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { CommonProps } from "../components/Types";
import { useTranslate } from "../localization/Localization";
import { AppMenu, MenuItems } from "./AppMenu";
import { AppToolbar } from "./AppToolbar";
import { MenuKeys } from "./MenuItems";
import { appToolbarItems } from "./ToolbarItems";

/**
 * The props for the {@link AppMenuToolbar} component.
 */
type AppMenuToolbarProps = {
    menuItems: MenuItems;
    onItemClick: (key: MenuKeys) => void;
} & CommonProps;

/**
 * A combined menu and toolbar component.
 * @param param0 The component props: {@link AppMenuToolbarProps}.
 * @returns A component.
 */
const AppMenuToolbarComponent = ({
    className, //
    menuItems,
    onItemClick,
}: AppMenuToolbarProps) => {
    const { translate } = useTranslate();

    const onToolbarItemInternal = React.useCallback(
        (key: unknown) => {
            onItemClick(key as MenuKeys);
        },
        [onItemClick]
    );

    return (
        <div //
            className={classNames(AppMenuToolbar.name, className)}
        >
            <AppMenu //
                items={menuItems}
                onItemClick={onToolbarItemInternal}
            />
            <AppToolbar //
                toolBarItems={appToolbarItems(translate)}
                onItemClick={onToolbarItemInternal}
            />
        </div>
    );
};

const AppMenuToolbar = styled(AppMenuToolbarComponent)`
    display: flex;
    flex-direction: column;
    min-height: 0px;
    margin-bottom: 10px;
`;

export { AppMenuToolbar };
