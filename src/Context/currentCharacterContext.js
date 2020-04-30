import React, { createContext, useState, useReducer } from "react";
import { currentCharacterReducer } from '../reducers/currentCharacterReducer';
import axios from 'axios';
axios.defaults.baseURL = 'https://endival-api.herokuapp.com';


export const CurrentCharacterContext = createContext();

const CurrentCharacterContextProvider = (props) => {
    const [data, dispatch] = useReducer(currentCharacterReducer, {});

    const getCurrentCharacter = (token, id) => {

        const setRaceStats = (race) => {
            let temp = {};

            for (const stat in race) {
                if (!stat.includes('Data')) continue; // Is not stat
                let striped = stat.replace('Data', '');
                temp[striped] = race[stat];
            }

            return temp;
        }

        return new Promise((resolve, reject) => {

            if (!token) return;

            let config = {
                method: 'get',
                url: '/characters/' + id,
                headers: {
                    Authorization: token
                }
            }

            axios(config)
                .then(res => {
                    const raceStats = setRaceStats(res.data.race);
                    dispatch({ type: "UPDATE", payload: { ...res.data, raceName: res.data.race.name, className: res.data.class.name, raceStats } });
                })
                .catch(err => {
                    // if (err.response.status) reject();
                    reject();
                })
        })
    }

    const createNew = (token, data) => {
        return new Promise((resolve, reject) => {
            if (!token) return;
            let config = {
                method: 'post',
                url: '/characters',
                headers: {
                    Authorization: token
                },
                data
            }

            axios(config)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    const updateChar = (id, token, data) => {
        return new Promise((resolve, reject) => {
            if (!token) return;
            let config = {
                method: 'patch',
                url: '/characters/' + id,
                headers: {
                    Authorization: token
                },
                data
            }

            axios(config)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    return (
        <CurrentCharacterContext.Provider value={{ data, dispatch, getCurrentCharacter, createNew, updateChar }}>
            {props.children}
        </CurrentCharacterContext.Provider>
    );
}

export default CurrentCharacterContextProvider;