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
import { appWindow } from "@tauri-apps/api/window";
import { EventCallback, TauriEvent, UnlistenFn } from "@tauri-apps/api/event";
import { saveWindowState, StateFlags, restoreStateCurrent } from "tauri-plugin-window-state-api";

/**
 * A hook that adds an event listener to the window object for the given event type and callback function.
 *
 * @param {TauriEvent} event - The type of event to listen for.
 * @param {() => void} callback - The function to be called when the event is triggered.
 */
const useWindowEventListener = (event: TauriEvent, callback: () => void) => {
    const windowEventCallback: EventCallback<unknown> = React.useCallback(() => {
        callback();
    }, [callback]);

    React.useEffect(() => {
        let unListenResize: UnlistenFn;

        appWindow
            .listen(event, windowEventCallback)
            .then(unlisten => {
                unListenResize = unlisten;
            })
            // eslint-disable-next-line no-console
            .catch(console.error);

        return () => {
            if (typeof unListenResize === "function") {
                void unListenResize();
            }
        };
    }, [event, windowEventCallback]);
};

/**
 * A custom hook that listens for window state changes and saves the state periodically after a delay in case the window state was changed.
 *
 * @param {number} intervalMs - The interval in milliseconds at which the state should be saved.
 * @return {Object} An object containing the following properties:
 *   - stateSaverEnabled: A boolean indicating whether state saving is enabled.
 *   - setStateSaverEnabled: A function to enable or disable state saving. The default value is `false`.
 *   - restoreState: A function to restore the saved state.
 */
const useWindowStateSaver = (intervalMs: number) => {
    const [stateSaverEnabled, setStateSaverEnabled] = React.useState(false);
    const intervalPassed = React.useRef<boolean>(false);
    const windowEventOccurred = React.useRef<boolean>(false);
    const currentTime = React.useRef<Date>(new Date());

    const windowEventCallback = React.useCallback(() => {
        windowEventOccurred.current = true;
        currentTime.current = new Date();
        intervalPassed.current = false;
    }, []);

    useWindowEventListener(TauriEvent.WINDOW_RESIZED, windowEventCallback);
    useWindowEventListener(TauriEvent.WINDOW_CLOSE_REQUESTED, windowEventCallback);
    useWindowEventListener(TauriEvent.WINDOW_DESTROYED, windowEventCallback);
    useWindowEventListener(TauriEvent.WINDOW_MOVED, windowEventCallback);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (stateSaverEnabled && intervalPassed.current !== true && Date.now() - currentTime.current.getTime() > intervalMs) {
                intervalPassed.current = true;
                currentTime.current = new Date();
            }

            // Save the window state if the time interval has passed, the window event has occurred and the state saver is enabled.
            if (stateSaverEnabled && windowEventOccurred.current === true && intervalPassed.current === true) {
                windowEventOccurred.current = false;
                void saveWindowState(StateFlags.ALL);
                intervalPassed.current = false;
            }
        }, 50);
        return () => clearInterval(interval);
    }, [intervalMs, stateSaverEnabled]);

    const restoreState = React.useCallback(() => {
        void restoreStateCurrent(StateFlags.ALL);
    }, []);

    return { stateSaverEnabled, setStateSaverEnabled, restoreState };
};

export { useWindowStateSaver };
