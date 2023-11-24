import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allTImeZones: [],
    allTimeZonesLoading: false,
    allTImeZonesError: null,
    timezoneArea: {},
    timezoneAreaLoading: false,
    timezoneAreaError: null
}

const timezoneSlice = createSlice({
    name: 'timezone',
    initialState,
    reducers: {
        allTImeZonesStart: (state) => {
            state.allTimeZonesLoading = true
            state.allTImeZonesError = null
        },
        allTImeZonesSuccess: (state, action) => {
            state.allTimeZonesLoading = false
            state.allTImeZones = action.payload
            state.allTImeZonesError = null
        },
        allTImeZonesFailure: (state, action) => {
            state.allTimeZonesLoading = false
            state.allTImeZones = []
            state.allTImeZonesError = action.payload
        },
        timezoneAreaStart: (state) => {
            state.timezoneAreaLoading = true
            state.timezoneArea = null
            state.timezoneAreaError = null
        },
        timezoneAreaSuccess: (state, action) => {
            state.timezoneAreaLoading = false
            state.timezoneArea = action.payload
            state.timezoneAreaError = null
        },
        timezoneAreaFailure: (state, action) => {
            state.timezoneAreaLoading = false
            state.timezoneAreaError = action.payload
            state.timezoneArea = null
        }
    }
});

export const {
    allTImeZonesStart,
    allTImeZonesSuccess,
    allTImeZonesFailure,
    timezoneAreaStart,
    timezoneAreaSuccess,
    timezoneAreaFailure
} = timezoneSlice.actions

export default timezoneSlice.reducer