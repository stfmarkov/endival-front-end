import React, { useState, useEffect } from 'react'
import "./stat.scss";

export default function Stat(props) {

    const [max, setMax] = useState(20);

    // Names of the stats. Use bulgarian by default
    const [statNames, setStatNames] = useState({
        str: 'Сила',
        dex: 'Ловкост',
        con: 'Издражливост',
        will: 'Воля',
        magic: 'Ефирност',
        spd: 'Бързина',
        divineKnowledge: 'Д П',
        magicalKnowledge: 'Е П',
        fightingKnowledge: 'Б П',
        practicalKnowledge: 'П П',
        teoreticalKnowledge: 'Т П',
        stamina: 'Активност',
        health: 'Жизнени точки',
        recovery: 'Възстановяване',
        mana: 'Мана',
        recharging: 'Презареждане',
        weightCap: "Товар",
        lifting: 'Вдигане',
        jump: 'Скок',
        baseDmg: 'Базова щета',
        wideAtack: 'Дъгова Атака',
        stabAtack: 'Права Атака',
        rangeAtack: 'Атака от Разстояние',
        parry: 'Париране',
        block: 'Блокиране',
        dodge: 'Отбягване'
    });

    const calcModif = (level) => {
        // Taken directly from the book's ruleset
        if (level >= 50) return props.statData ? props.statData.to60 : 3;
        if (level >= 40) return props.statData ? props.statData.to50 : 3;
        if (level >= 30) return props.statData ? props.statData.to40 : 2;
        if (level >= 20) return props.statData ? props.statData.to30 : 2;
        return props.statData ? props.statData.to20 : 1;
    }

    const addStat = (stat) => {
        /* 
        * If selected race don't have the stat the user wishes to update then it is a knowledge
        * stat and it can't exeed the threshold
        */
        const xpModif = calcModif(props.charData[stat] + props.added[stat]);

        if (
            props.xp < xpModif || (
                props.added[stat].toString() &&
                props.charData[stat].toString() &&
                props.charData[stat] + props.added[stat] >= max)
        ) return


        let updated = { ...props.added };
        updated[stat] += 1;
        props.setAdded({ ...updated });
        props.setXp(props.xp - 1 * xpModif);
    }

    const removeStat = (stat) => {
        // the -1 fixes the ">=" check. ( when going down and at 20 points we need to give back only 1 point instead of 2 )
        const xpModif = calcModif(props.charData[stat] + props.added[stat] - 1);

        if (props.added[stat] <= 0) return;

        let updated = props.added;
        updated[stat] -= 1;
        props.setAdded({ ...updated });
        props.setXp(props.xp + 1 * xpModif);
    }

    const value = props.isMainStat ? props.charData[props.stat] + props.added[props.stat] : props.addedStats[props.stat]

    useEffect(() => {
        if (props.stat.includes('Knowledge')) setMax(60);
        if (props.statData) setMax(props.statData.max);
    }, [props.statData])

    return (
        <li className={'stat ' + props.stat}>
            <h4>{statNames[props.stat]}</h4>
            <span>{value.toString()}</span>
            <button className={"stat__control " + (!props.isMainStat ? "stat__control_hiden" : "")} onClick={() => addStat(props.stat)}>+</button>
            <button className={"stat__control " + (!props.isMainStat ? "stat__control_hiden" : "")} onClick={() => removeStat(props.stat)}>-</button>
        </li>
    )
}
