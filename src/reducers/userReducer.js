export const userReducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...payload };
    case "CLEAR":
      return { email: "", password: "", token: "" };
    default:
      return state;
  }
};
