import React, { createContext, useReducer } from "react";
import { classesReducer } from '../reducers/classesReducer';
import axios from 'axios';
axios.defaults.baseURL = 'https://endival-api.herokuapp.com';


export const ClassesContext = createContext();

const ClassesContextProvider = (props) => {
    const [data, dispatch] = useReducer(classesReducer, {});

    const getClasses = (token) => {
        return new Promise((resolve, reject) => {
            if (!token) return;

            let config = {
                method: 'get',
                url: '/class',
                headers: {
                    Authorization: token
                }
            }

            axios(config)
                .then(res => {
                    dispatch({ type: "UPDATE", payload: { list: res.data.class } });
                })
                .catch(err => {
                    if (err.response.status) reject();

                    console.log(err.response.data);
                })
        })
    }

    return (
        <ClassesContext.Provider value={{ data, dispatch, getClasses }}>
            {props.children}
        </ClassesContext.Provider>
    );
}

export default ClassesContextProvider;