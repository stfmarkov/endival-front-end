import React, { createContext, useReducer } from "react";
import { racesReducer } from '../reducers/racesReducer';
import axios from 'axios';
axios.defaults.baseURL = 'https://endival-api.herokuapp.com';


export const RacesContext = createContext();

const RacesContextProvider = (props) => {
    const [data, dispatch] = useReducer(racesReducer, {});

    const getRaces = (token) => {
        return new Promise((resolve, reject) => {
            if (!token) return;

            let config = {
                method: 'get',
                url: '/races',
                headers: {
                    Authorization: token
                }
            }

            axios(config)
                .then(res => {
                    dispatch({ type: "UPDATE", payload: { list: res.data.race } });
                })
                .catch(err => {
                    // if (err.response.status) reject();
                    reject();
                })
        })

    }

    return (
        <RacesContext.Provider value={{ data, dispatch, getRaces }}>
            {props.children}
        </RacesContext.Provider>
    );
}

export default RacesContextProvider;