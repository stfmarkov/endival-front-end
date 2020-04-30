import React, { useState, useEffect } from 'react';
import './popup.scss';

export default function Popup(props) {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(props.open)
    }, [props.open]);

    return (
        <div className={"card popup " + (isOpen ? 'popup_open' : '')}>
            {props.children}
        </div>
    )
}
