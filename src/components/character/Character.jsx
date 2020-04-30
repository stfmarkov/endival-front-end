import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { CurrentCharacterContext } from "../../Context/currentCharacterContext";
import { UserContext } from "../../Context/userContext";
import Input from "../input/Input.jsx";
import Button from "../button/Button.jsx";
import Skill from "../skill/Skill.jsx";
import CharHeading from "../charHeading/CharHeading.jsx";
import "./character.scss";
import Experience from "../experience/Experience";
import Stat from "../stat/Stat";
import TempStat from "../tempStat/TempStat";
import Inventory from "../inventory/Inventory";
import Loader from "../loader/Loader";

/*

Props list:
change: call a method (
        param0: the added points from the "added" state, 
        param1: basic char data,
        param2: calculated char data,
        param3: char name )

xpPoint: the XP points available at the moment

flags: - isCreating - if the user is in the proces of creating the character
       - isRaceScreen - if the user is on the screen to choose race
       - isClassScreen - if the user is on the screen to choose class
*/

export default function Character(props) {
  const router = useHistory();

  const [xp, setXp] = useState(0);
  // the additional player selected points
  const [added, setAdded] = useState({
    str: 0,
    con: 0,
    dex: 0,
    spd: 0,
    will: 0,
    magic: 0,
    divineKnowledge: 0,
    magicalKnowledge: 0,
    fightingKnowledge: 0,
    practicalKnowledge: 0,
    teoreticalKnowledge: 0,
  });

  const [charData, setCharData] = useState({});
  const [addedStats, setAddedStats] = useState({});
  const [name, setName] = useState("");
  const [skill, setSkill] = useState({ name: "" });
  const [skills, setSkills] = useState([]);
  const [feat, setFeat] = useState({ name: "" });
  const [feats, setFeats] = useState([]);
  const [flags, setFlags] = useState({});
  const [stamina, setStamina] = useState({});
  const [health, setHealth] = useState({});
  const [mana, setMana] = useState({});
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);

  const [tab, setTabs] = useState(1);

  const [loading, setLoading] = useState(false);

  const currentCharacter = useContext(CurrentCharacterContext);

  // full user data
  const user = useContext(UserContext);

  const calcAdditionalStats = () => {
    //char data + added stats
    const fullData = {};

    for (const key in added) {
      fullData[key] = added[key] + charData[key];
    }

    const stats = {
      // TODO: Add check if the char is Neisk and change the hardcoded 'false' in the stamina equation
      stamina: Math.floor(
        fullData.con / 2 + fullData.will / 10 + (fullData.magic / 5) * false
      ),
      health: fullData.str + fullData.con,
      recovery: Math.floor(fullData.con / 2),
      mana: fullData.magic * 2,
      recharging: fullData.magic / 2,
      weightCap: fullData.str + fullData.con,
      lifting: fullData.str * 4,
      jump: fullData.dex / 10,
      baseDmg: Math.floor(fullData.str / 10),
      wideAtack: Math.floor(
        (fullData.str + 2 * fullData.dex + fullData.fightingKnowledge) / 10
      ),
      stabAtack: Math.floor(
        (fullData.str + 2 * fullData.spd + fullData.fightingKnowledge) / 10
      ),
      rangeAtack: Math.floor(
        (fullData.spd + 2 * fullData.dex + fullData.fightingKnowledge) / 10
      ),
      parry: Math.floor(
        (fullData.str + 2 * fullData.dex + fullData.fightingKnowledge) / 10
      ),
      block: Math.floor(
        (fullData.str + 2 * fullData.spd + fullData.fightingKnowledge) / 10
      ),
      dodge: Math.floor(
        (fullData.spd + 2 * fullData.dex + fullData.fightingKnowledge) / 10
      ),
    };

    setAddedStats(stats);
  };

  const resetAdded = () => {
    setAdded({
      str: 0,
      con: 0,
      dex: 0,
      spd: 0,
      will: 0,
      magic: 0,
      divineKnowledge: 0,
      magicalKnowledge: 0,
      fightingKnowledge: 0,
      practicalKnowledge: 0,
      teoreticalKnowledge: 0,
    });
    setXp(props.xpPoints);
  };

  const skillChange = (newSkill) => {
    setSkill({ name: newSkill, level: 3 });
  };

  const featChange = (newFeat) => {
    setFeat({ name: newFeat });
  };

  const addSkill = () => {
    const exists = skills.filter((element) => element.name === skill.name)[0];

    if (xp <= 0 || !skill.name || exists) return;
    setXp(xp - 3);

    let tempSkills;
    if (skills[0]) {
      tempSkills = [...skills, skill];
    } else {
      tempSkills = charData.skills ? [...charData.skills, skill] : [skill];
    }

    setSkills([...tempSkills]);
    setSkill({ name: "" });
  };

  const addFeat = () => {
    const exists = feats.filter((element) => element.name === feat.name)[0];

    if (!feat.name || exists) return;

    let tempFeats = [...feats, feat];

    setFeats([...tempFeats]);
    setFeat({ name: "" });
  };

  const addPoints = (points) => {
    setXp(xp + points);
  };

  const save = () => {
    setLoading(true);
    if (props.flags.isCreating) createNew();
    else updateChar();
  };

  const saveItems = (items) => {
    setItems(items);
  };

  const createNew = () => {
    if (xp || !name) return;

    const staminaData = {
      max: addedStats.stamina,
      current: addedStats.stamina,
    };
    const manaData = { max: addedStats.mana, current: addedStats.mana };
    const healthData = { max: addedStats.health, current: addedStats.health };

    currentCharacter
      .createNew(user.data.token, {
        healthData,
        manaData,
        staminaData,
        ...charData,
        ...addedStats,
        name,
        user: user.data.id,
        xp,
        skills,
        basicFeats: feats,
      })
      .then(() => {
        user.getChars();
        router.push("/profile");
        setLoading(false);
      })
      .catch(() => {
        router.push("/");
        setLoading(false);
      });
  };

  const updateChar = () => {
    const statsData = {
      str: charData.str + added.str,
      con: charData.con + added.con,
      dex: charData.dex + added.dex,
      spd: charData.spd + added.spd,
      will: charData.will + added.will,
      magic: charData.magic + added.magic,
      divineKnowledge: charData.divineKnowledge + added.divineKnowledge,
      magicalKnowledge: charData.magicalKnowledge + added.magicalKnowledge,
      fightingKnowledge: charData.fightingKnowledge + added.fightingKnowledge,
      practicalKnowledge:
        charData.practicalKnowledge + added.practicalKnowledge,
      teoreticalKnowledge:
        charData.teoreticalKnowledge + added.teoreticalKnowledge,
    };

    currentCharacter
      .updateChar(charData._id, user.data.token, {
        ...charData,
        ...statsData,
        ...addedStats,
        xp,
        skills,
        healthData: { current: health.current, max: addedStats.health },
        manaData: { current: mana.current, max: addedStats.mana },
        staminaData: { current: stamina.current, max: addedStats.stamina },
        inventory: items,
        money,
      })
      .then(() => setLoading(false))
      .catch(() => {
        router.push("/");
        setLoading(false);
      });
  };

  // JSX
  const mainStats = Object.keys(charData).map((stat) => {
    if (
      stat === "race" ||
      stat === "raceName" ||
      stat === "class" ||
      stat === "className"
    )
      return;
    // If its not on the 'added' object the stat is not directly changable and is not a base stat
    if (!added[stat] && added[stat] !== 0) return;

    return (
      <Stat
        xp={xp}
        added={added}
        key={stat}
        statData={charData.raceStats ? charData.raceStats[stat] : false}
        stat={stat}
        charData={charData}
        setAdded={(value) => setAdded(value)}
        setXp={(xp) => setXp(xp)}
        isMainStat={true}
      />
    );
  });

  const addedStatsTemplate = Object.keys(addedStats).map((stat) => {
    if (
      stat === "race" ||
      stat === "raceName" ||
      stat === "class" ||
      stat === "className"
    )
      return;

    return (
      <Stat
        xp={xp}
        added={added}
        key={stat}
        stat={stat}
        charData={charData}
        addedStats={addedStats}
        setAdded={(value) => setAdded(value)}
        setXp={(xp) => setXp(xp)}
        isMainStat={false}
      />
    );
  });

  const skillsTemplate = skills
    ? skills.map((skill) => (
        <Skill
          key={skill.name}
          xp={xp}
          // 21 is the max skill value for new character, 70 is the total max
          max={flags.isCreating ? 21 : 70}
          skill={skill}
          skills={skills}
          setXp={(xp) => setXp(xp)}
          setSkills={(skills) => setSkills(skills)}
        />
      ))
    : "";

  const featsTemplate = feats.map((feat) => (
    <h3 key={feat.name}>
      <span>{feat.name}</span>
    </h3>
  ));

  const nameTemplate =
    !props.flags.isCreating ||
    props.flags.isRaceScreen ||
    props.flags.isClassScreen ? (
      <CharHeading heading={"Име"} text={charData.name} />
    ) : (
      <Input type="text" placeholder="Име" value={name} change={setName} />
    );

  const race = charData.raceName ? (
    <CharHeading heading={"Раса"} text={charData.raceName} />
  ) : (
    ""
  );
  const charClass = charData.className ? (
    <CharHeading heading={"Клас"} text={charData.className} />
  ) : (
    ""
  );
  const classFeat = charData.classFeat ? (
    <h3>
      Класово качество: <span>{charData.classFeat.name}</span>
    </h3>
  ) : (
    ""
  );
  const racialFeat = charData.racialFeat ? (
    <h3>
      Расово качество: <span>{charData.racialFeat.name}</span>
    </h3>
  ) : (
    ""
  );
  const saveBtn =
    props.flags.isRaceScreen || props.flags.isClassScreen ? (
      ""
    ) : (
      <Button text="Запази" class={"page__btn btn_sticky"} click={save} />
    );
  const featControls =
    props.flags.isCreating &&
    !props.flags.isClassScreen &&
    !props.flags.isRaceScreen ? (
      <div>
        <Input
          type="text"
          placeholder="Ново качество"
          value={feat.name}
          change={featChange}
        />
        <Button click={addFeat} text="Добави" class={"btn_small"} />
      </div>
    ) : (
      ""
    );

  const inventoryWrapper = !props.flags.isCreating ? (
    <div
      className={
        "character__tab character__tab_inventory " +
        (tab == 3 ? "character__tab_active" : "")
      }
    >
      <Inventory
        weight={addedStats.weightCap}
        items={items}
        money={money}
        save={saveItems}
        saveMoney={(money) => setMoney(money)}
        change={() => setTabs(3)}
      />
    </div>
  ) : (
    ""
  );

  const skillScreenWrapper =
    (props.flags.isCreating &&
      !props.flags.isClassScreen &&
      !props.flags.isRaceScreen) ||
    !props.flags.isCreating ? (
      <div
        className={
          "card character__tab character__tab_skills " +
          (tab == 2 ? "character__tab_active" : "")
        }
      >
        <div
          className="inventory__sticy inventory__sticy_5"
          onClick={() => setTabs(2)}
        >
          Умения
        </div>

        <div className="character__tab-wrapper">
          <div className="row">
            <Experience xp={xp} add={addPoints} />
          </div>
          <div
            className={
              "character__skills " +
              (props.hideSkills ? "character__skills_hide" : "")
            }
          >
            <h2>Умения :</h2>
            <ul>{skillsTemplate}</ul>
            <div>
              <Input
                type="text"
                placeholder="Ново умение"
                value={skill.name}
                change={skillChange}
              />
              <Button click={addSkill} text="Добави" class={"btn_small"} />
            </div>
          </div>
        </div>
      </div>
    ) : (
      ""
    );

  // End Of JSX
  useEffect(() => {
    resetAdded();
    setCharData({ ...currentCharacter.data });

    const charSkills = currentCharacter.data.skills || [];
    setSkills(charSkills);

    const basicFeats = currentCharacter.data.basicFeats || [];
    setFeats(basicFeats);

    const charXp = currentCharacter.data.xp || props.xpPoints || 0;
    setXp(charXp);

    const charItems = currentCharacter.data.inventory || [];
    setItems(charItems);

    const charStamina = currentCharacter.data.staminaData || {
      max: 0,
      current: 0,
    };
    setStamina(charStamina);

    const charHealth = currentCharacter.data.healthData || {
      max: 0,
      current: 0,
    };
    setHealth(charHealth);

    const charMana = currentCharacter.data.manaData || { max: 0, current: 0 };
    setMana(charMana);

    setMoney(currentCharacter.data.money || 0);
  }, [currentCharacter]);

  useEffect(() => {
    if (!props.changeXp) return;
    props.changeXp(xp);
  }, [xp]);

  useEffect(() => {
    calcAdditionalStats();
  }, [added]);

  useEffect(() => {
    setXp(props.xpPoints);
  }, [props.xpPoints]);

  useEffect(() => {
    if (props.flags) setFlags(props.flags);
  }, [props.flags]);

  useEffect(() => {
    calcAdditionalStats();
  }, [charData]);

  useEffect(() => {
    if (!props.changeAdded) return;
    props.changeAdded(added);
  }, [added]);

  return (
    <div className="character">
      <div
        className={
          "card character__tab character__tab_main " +
          (tab == 1 ? "character__tab_active" : "")
        }
      >
        <div
          className="inventory__sticy inventory__sticy_4"
          onClick={() => setTabs(1)}
        >
          Статистики
        </div>
        <div className="character__tab-wrapper">
          <div className="row">
            <div className="character__header">
              {nameTemplate}
              <div>
                {race}
                {racialFeat}
              </div>
              <div>
                {charClass}
                {classFeat}
                <div className="character__feats">
                  <h2> Общи качества : </h2>
                  <ul>{featsTemplate}</ul>
                  {featControls}
                </div>
              </div>
            </div>
            <div className="character__resources">
              <TempStat
                stat={health}
                name="Жизнени точки"
                color="#be7575"
                modify={(hp) => setHealth(hp)}
              />
              <TempStat
                stat={stamina}
                name="Активност"
                color="#445c3c"
                modify={(stam) => setStamina(stam)}
              />
              <TempStat
                stat={mana}
                name="Мана Точки"
                color="#484c7f"
                modify={(mt) => setMana(mt)}
              />
            </div>
          </div>
          <div className="row">
            <Experience xp={xp} add={addPoints} />
          </div>
          <div className="character__body">
            <div className="character__stats">
              <ul className="character__list">
                {mainStats}
                {addedStatsTemplate}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {skillScreenWrapper}
      {inventoryWrapper}
      {saveBtn}

      <Loader isShown={loading} />
    </div>
  );
}
