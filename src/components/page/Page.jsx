import React, { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./page.scss";
import ChoseRace from "../choseRace/choseRace.jsx";
import ChoseClass from "../choseClass/choseClass.jsx";
import Login from "../login/Login.jsx";
import Profile from "../profile/Profile.jsx";
import Finalise from "../finalise/finalise.jsx";
import Sheet from "../sheet/Sheet.jsx";
import RacesContextProvider from "../../Context/racesContext";
import { UserContext } from "../../Context/userContext";
import ClassesContextProvider from "../../Context/classesContext";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Page = () => {
  const user = useContext(UserContext);

  const getLogedUser = () => {
    // Get user data from the local storage
    let user;
    try {
      user = localStorage.getItem("logedUser");
    } catch (error) {
      console.log(error);
    }
    return user ? JSON.parse(user) : '';
  };

  const saveLogedUser = (user) => {
    // Set user data to the local storage
    try {
      localStorage.setItem("logedUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const setLogedUser = (newUser, user) => {
    // Set user in the context
    if (newUser.token === user.data.token) return;
    user.dispatch({
      type: "UPDATE",
      payload: { email: newUser.email, token: newUser.token, id: newUser.id },
    });
  };

  useEffect(() => {
    // If user data is not saved in the local storage save it.
    // Set the saved user in the user context
    if (!getLogedUser().token) saveLogedUser(user.data);
    setLogedUser(getLogedUser(), user);
  }, [user]);

  return (
    <main className="page">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/profile/" exact component={Profile} />
          <Route path="/character/:id" exact component={Sheet} />
          <ClassesContextProvider>
            <RacesContextProvider>
              <Route path="/chose-class" exact component={ChoseClass} />
              <Route path="/chose-race" exact component={ChoseRace} />
              <Route path="/finalise" exact component={Finalise} />
            </RacesContextProvider>
          </ClassesContextProvider>
        </Switch>
        <Footer />
      </Router>
    </main>
  );
};

export default Page;
