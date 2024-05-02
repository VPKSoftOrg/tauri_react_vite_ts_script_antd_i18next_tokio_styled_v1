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
import { Button, Tooltip } from "antd";
import { CommonProps } from "../Types";

/**
 * The props for the {@link TooltipObjectButton} component.
 */
type TooltipObjectButtonProps<T> = {
    icon?: React.ReactNode;
    objectData: T;
    children?: React.ReactNode;
    tooltipTitle: string;
    onClick: (objectData: T) => void;
} & CommonProps;

/**
 * A wrapper component for the {@link Button} with an predefined object data as {@link onClick} payload.
 * @param param0 The component props: {@link TooltipObjectButtonProps}.
 * @returns A component.
 */
const TooltipObjectButtonPropsComponent = <T,>({
    className, //
    icon,
    objectData,
    children,
    tooltipTitle,
    onClick,
}: TooltipObjectButtonProps<T>) => {
    const onClickCallback = React.useCallback(() => {
        onClick(objectData);
    }, [objectData, onClick]);

    return (
        <Tooltip title={tooltipTitle}>
            <Button //
                className={classNames(TooltipObjectButton.name, className)}
                onClick={onClickCallback}
                icon={icon}
            >
                {children}
            </Button>
        </Tooltip>
    );
};

const TooltipObjectButton = styled(TooltipObjectButtonPropsComponent)`
    // Add style(s) here
`;

export { TooltipObjectButton };
