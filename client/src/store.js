import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/authReducer";
import { userReducer } from "./reducers/userReducer";

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);