import React from "react";

export const useClickedOutside = callback => {
    const ref = React.useRef();
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
        callback();
        }
    };
    React.useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
        document.removeEventListener("click", handleClick);
        };
    });
    return ref;
}
