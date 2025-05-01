
const initialState = {
    featured: [],
    loading: false,
};

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@users/init/start":
            return { ...state, loading: true };
        case "@users/init/success":
            return { ...state, featured: action.payload, loading: false };
        case "@users/init/fail":
            return { ...state, featured: [], loading: false };
        default:
            return state;
    }
};
