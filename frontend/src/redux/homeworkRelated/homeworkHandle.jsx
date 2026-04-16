import axios from 'axios';
import { getRequest, getSuccess, getFailed, getError, stuffDone } from './homeworkSlice';

export const getHomeworkList = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const addHomework = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/HomeworkCreate`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const deleteHomeworkById = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/Homework/${id}`);
        dispatch(stuffDone());
    } catch (error) {
        dispatch(getError(error));
    }
};
