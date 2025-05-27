
const initialState = {
    all: {
        data: [],
        loading: false,
        error: null,
    },
    featured: {
        data: [],
        loading: false,
        error: null,
    },
};


export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@users/all/start":
            return {
                ...state,
                all: { ...state.all, loading: true, error: null },
            };

        case "@users/all/success":
            return {
                ...state,
                all: { data: action.payload, loading: false, error: null },
            };

        case "@users/all/fail":
            return {
                ...state,
                all: { ...state.all, loading: false, error: action.payload },
            };

        case "@users/featured/start":
            return {
                ...state,
                featured: { ...state.featured, loading: true, error: null },
            };

        case "@users/featured/success":
            return {
                ...state,
                featured: { data: action.payload, loading: false, error: null },
            };

        case "@users/featured/fail":
            return {
                ...state,
                featured: { ...state.featured, loading: false, error: action.payload },
            };

        default:
            return state;
    }
};
