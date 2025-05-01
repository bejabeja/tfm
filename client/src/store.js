import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./store/auth/authReducer.js";
import { userInfoReducer } from "./store/user/userInfoReducer.js";
import { usersReducer } from "./store/users/usersReducer.js";

const reducer = combineReducers({
    auth: authReducer,
    myInfo: userInfoReducer,
    users: usersReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);