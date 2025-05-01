const initialState = {
    userInfo: null,
    loading: false,
    error: null,
};

export const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@user/loading":
            return {
                ...state,
                loading: true,
                error: null,
            };

        case "@user/init":
            return {
                ...state,
                userInfo: action.payload,
                loading: false,
                error: null,
            };

        case "@user/error":
            return {
                ...state,
                userInfo: null,
                loading: false,
                error: action.payload,
            };

        case "@user/reset":
            return initialState;

        default:
            return state;
    }
};
