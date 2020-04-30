import React from 'react';
import './infoBlock.scss'

export default function InfoBlock(props) {
    return (
        <div className="info-block">
            <h2>{props.heading}</h2>
            <p>{props.text}</p>
        </div>
    )
}
