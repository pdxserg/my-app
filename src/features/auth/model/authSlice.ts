import {ResultCode} from "common/enums"
import {handleServerAppError} from "common/utils/handleServerAppError"
import {handleServerNetworkError} from "common/utils/handleServerNetworkError"
import {Dispatch} from "redux"
import {clearTasksAC} from "../../todolists/model/tasks-reducer"
import {clearTodolistsAC} from "../../todolists/model/todolists-reducer"
import {authApi} from "../api/authAPI"
import {LoginArgs} from "../api/authAPI.types"
import {createSlice} from "@reduxjs/toolkit";
import {setAppStatus} from "../../../app/appSlice";


const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
		isInitialized: false,
	},
  reducers: create => ({
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    setIsInitialized: create.reducer<{ isInitialized: boolean }>((state, action) => {
      state.isInitialized = action.payload.isInitialized
    }),
  }),
})

export const {setIsLoggedIn, setIsInitialized} = authSlice.actions
export const authReducer = authSlice.reducer

// thunks
export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
	dispatch(setAppStatus("loading"))
	authApi
		.login(data)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus("succeeded"))
				dispatch(setIsLoggedIn({isLoggedIn: true}))
				localStorage.setItem("sn-token", res.data.data.token)
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const logoutTC = () => (dispatch: Dispatch) => {
	dispatch(setAppStatus("loading"))
	authApi
		.logout()
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus("succeeded"))
				dispatch(setIsLoggedIn({isLoggedIn: false}))
				dispatch(clearTasksAC())
				dispatch(clearTodolistsAC())
				localStorage.removeItem("sn-token")
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
	dispatch(setAppStatus("loading"))
	authApi
		.me()
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus("succeeded"))
				dispatch(setIsLoggedIn({isLoggedIn: true}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
		.finally(() => {
			dispatch(setIsInitialized({isInitialized: true}))
		})
}
