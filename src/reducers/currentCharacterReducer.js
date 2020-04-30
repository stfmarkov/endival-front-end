export const currentCharacterReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload };
    case "RESET":
      return {};
    default:
      return state;
  }
};
