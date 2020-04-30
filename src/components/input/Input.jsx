import React, { useEffect, useRef } from 'react'
import './Input.scss'

/*
    Props
    type - property, the type of the input 
    placeholder - property, the placeholder of the input 
    value - property, initial value of the input 
    change - method, 1 param of type String
*/

export default function Input(props) {

    const input = useRef();

    useEffect(() => {
        input.current.value = props.value;
    }, [props.value]);

    return (
        <div className="input">
            <input
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.change(e.target.value)}
                ref={input}
            />
        </div>
    )
}
