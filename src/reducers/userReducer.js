export const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, token: action.payload.token, email: action.payload.email, id:action.payload.id }
        case "GET_CHARS":
            return { ...state, characters: action.payload.characters }
        case "CLEAR":
            return { email: '', password: '', token: '' }
        default:
            return state;
    }
}