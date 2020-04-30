import React from "react";

import Page from "./components/page/Page.jsx";
import UserContextProvider from "./Context/userContext";
import CurrentCharacterContextProvider from "./Context/currentCharacterContext";

function App() {
  return (
    <React.Fragment>
      <CurrentCharacterContextProvider>
        <UserContextProvider>
          <Page />
        </UserContextProvider>
      </CurrentCharacterContextProvider>
    </React.Fragment>
  );
}

export default App;
