import React, { useState, useEffect } from 'react'
import './skill.scss'

export default function Skill(props) {

    const [min, setMin] = useState(3);

    const modifySkill = (skill, modif, min, max) => {
        let xpModif = calcModif(skill.level);

        let isUnderStarting = modif < 0 && skill.level <= min;
        let isOverMax = modif > 0 && skill.level >= max;
        let noPoints = props.xp <= 0 && modif > 0;
        let needMorePoints = xpModif * modif > props.xp;

        if (isUnderStarting || isOverMax || noPoints || needMorePoints) return;

        let temp = props.skills.map((element) => {
            if (element.name === skill.name) {
                return { name: skill.name, level: skill.level + modif }
            }
            return element
        });

        props.setXp(props.xp - modif * xpModif);
        props.setSkills([...temp]);
    }

    const calcModif = (level) => {
        // Taken directly from the book's ruleset
        if (level >= 50) return 4;
        if (level >= 30) return 3;
        if (level >= 20) return 2;
        return 1;
    }

    useEffect(() => {
        setMin(props.skill.level);
    }, []);

    return (
        <li className="skill">
            <span>{props.skill.name} - {props.skill.level} </span>

            <div className="skill__controls">
                <button className="skill__btn" onClick={() => modifySkill(props.skill, 1, min, props.max)}>+</button>
                <button className="skill__btn" onClick={() => modifySkill(props.skill, -1, min, props.max)}>-</button>
            </div>
        </li>
    )
}
