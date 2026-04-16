import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    homeworkList: [],
    loading: false,
    error: null,
    response: null,
};

const homeworkSlice = createSlice({
    name: 'homework',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.homeworkList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },
    },
});

export const { getRequest, getSuccess, getFailed, getError, stuffDone } = homeworkSlice.actions;
export const homeworkReducer = homeworkSlice.reducer;
