import React from 'react'
import './Button.scss'

export default function Button(props) {
    return (
        <button className={`btn ${props.class}`} onClick={props.click}><span>{props.text}</span></button>
    )
}
