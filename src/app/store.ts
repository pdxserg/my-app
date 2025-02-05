import {  combineReducers, UnknownAction } from "redux"
import {  ThunkDispatch } from "redux-thunk"
import { authReducer } from "../features/auth/model/authSlice"
import { tasksReducer } from "../features/todolists/model/tasksSlice"
import { todolistsReducer } from "../features/todolists/model/todolistsSlice"
import { appReducer } from "./appSlice"
import {configureStore} from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//   tasks: tasksReducer,
//   todolists: todolistsReducer,
//   app: appReducer,
//   auth: authReducer,
// })

//1 export const store = legacy_createStore(rootReducer, {}, applyMiddleware(thunk))
//2 export const store = configureStore({ reducer: rootReducer })
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  } })
export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch

// Создаем тип диспатча который принимает как AC так и TC
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>


