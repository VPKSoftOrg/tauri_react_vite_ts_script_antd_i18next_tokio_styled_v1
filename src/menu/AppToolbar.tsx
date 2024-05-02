/*
MIT License

Copyright (c) 2024 Petteri Kautonen

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
import { TooltipObjectButton } from "../components/wrappers/TooltipObjectButton";

export type ToolBarItem<T> = {
    icon: React.ReactNode;
    title: string;
    tooltipTitle: string;
    clickActionObject: T;
};

export type ToolBarSeparator = "|";

/**
 * The props for the {@link AppToolbar} component.
 */
export type AppToolbarProps<T> = {
    toolBarItems: (ToolBarItem<T> | ToolBarSeparator)[];
    onItemClick: (item: T) => void;
} & CommonProps;

// Type quard for tool bar item
const isToolBarSeparator = <T,>(item: ToolBarItem<T> | ToolBarSeparator): item is ToolBarSeparator => {
    return (item as ToolBarSeparator) === "|";
};

/**
 * A component for the application toolbar for the PasswordKeeper.
 * @param param0 The component props {@link AppToolbarProps}.
 * @returns A component.
 */
const AppToolbarComponent = <T,>({
    className, //
    toolBarItems,
    onItemClick,
}: AppToolbarProps<T>) => {
    const onClick = React.useCallback(
        (item: unknown) => {
            onItemClick(item as T);
        },
        [onItemClick]
    );

    return (
        <div className={classNames(AppToolbar.name, className)}>
            {toolBarItems.map((item, index) =>
                isToolBarSeparator(item) ? (
                    <span
                        key={index} //
                        className="AppToolbar-separator"
                    />
                ) : (
                    <TooltipObjectButton //
                        key={index}
                        icon={item.icon}
                        tooltipTitle={item.tooltipTitle}
                        objectData={item.clickActionObject}
                        onClick={onClick}
                    />
                )
            )}
        </div>
    );
};

const AppToolbar = styled(AppToolbarComponent)`
    display: flex;
    flex-direction: row;
    gap: 4px;
    .AppToolbar-separator {
        width: 4px;
    }
`;

export { AppToolbar };
