import { combineReducers, configureStore } from "@reduxjs/toolkit";
import timezoneReducer from "./timezone/timezoneSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    timezone: timezoneReducer
})
const persistConfig = {
    key: 'root',
    storage,
    version: 1
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store);

persistor.purge()