import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/authReducer";
import { userLoggedReducer } from "./reducers/userLoggedReducer.js";
import { usersReducer } from "./reducers/usersReducer.js";

const reducer = combineReducers({
    auth: authReducer,
    myInfo: userLoggedReducer,
    users: usersReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);