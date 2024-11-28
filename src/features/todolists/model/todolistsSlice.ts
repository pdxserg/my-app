import {ResultCode} from "common/enums"
import {handleServerAppError} from "common/utils/handleServerAppError"
import {handleServerNetworkError} from "common/utils/handleServerNetworkError"
import {Dispatch} from "redux"
import {RequestStatus, setAppStatus} from "../../../app/appSlice"
import {todolistsApi} from "../api/todolistsApi"
import {Todolist} from "../api/todolistsApi.types"
import {createSlice} from "@reduxjs/toolkit";

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
	filter: FilterValuesType
	entityStatus: RequestStatus
}


export const todolistsSlice = createSlice({
	name: 'todolists',
	initialState: [] as DomainTodolist[],
	reducers: (create) => {
		return {
			removeTodolist: create.reducer<{ id: string }>((state, action) => {
				const index = state.findIndex(todo => todo.id === action.payload.id)
				if (index !== -1) {
					state.splice(index, 1)
				}
			}),
			addTodolist: create.reducer<{ todolist: Todolist }>((state, action) => {
				const newTodolist: DomainTodolist = {
					...action.payload.todolist,
					filter: "all",
					entityStatus: "idle",
				}
				return [newTodolist, ...state]
			}),
			changeTodolistTitle: create.reducer<{ id: string; title: string }>((state, action) => {
				// return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
				const index = state.findIndex(todo => todo.id === action.payload.id)
				if (index !== -1) state[index].title = action.payload.title
			}),
			changeTodolistFilter: create.reducer<{ id: string; filter: FilterValuesType }>((state, action) => {
				//       return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
				const index = state.findIndex(todo => todo.id === action.payload.id)
				if (index !== -1) state[index].filter = action.payload.filter
			}),
			changeTodolistEntityStatus: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action)=>{
				//return state.map((tl) =>
//         tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.entityStatus } : tl,
//       )
				const index = state.findIndex(todo => todo.id === action.payload.id)
				if (index !== -1) state[index].entityStatus = action.payload.entityStatus
			}),
			setTodolists: create.reducer<{todolists: Todolist[]}>((state, action)=>{
				//       return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
				// state.unshift(action.payload.todolists)
				action.payload.todolists.push({filter: "all", entityStatus: "idle" })
			}),
			clearTodolists: create.reducer((state, action)=>{
				return []
			}),
		}
	},
})
export const todolistsReducer = todolistsSlice.reducer
export const {removeTodolist, addTodolist, changeTodolistTitle,changeTodolistEntityStatus,setTodolists,clearTodolists } = todolistsSlice.actions

// export const _todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
//   switch (action.type) {
//     case "SET-TODOLISTS": {
//       return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
//     }
//
//     case "REMOVE-TODOLIST": {
//       return state.filter((tl) => tl.id !== action.payload.id)
//     }
//
//     case "ADD-TODOLIST": {
//       const newTodolist: DomainTodolist = {
//         ...action.payload.todolist,
//         filter: "all",
//         entityStatus: "idle",
//       }
//       return [newTodolist, ...state]
//     }
//
//     case "CHANGE-TODOLIST-TITLE": {
//       return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
//     }
//
//     case "CHANGE-TODOLIST-FILTER": {
//       return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
//     }
//
//     case "CHANGE-TODOLIST-ENTITY-STATUS":
//       return state.map((tl) =>
//         tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.entityStatus } : tl,
//       )
//
//     case "CLEAR-TODOLISTS":
//       return []
//
//     default:
//       return state
//   }
// }

// Action creators
// export const removeTodolistAC = (id: string) => {
//   return { type: "REMOVE-TODOLIST", payload: { id } } as const
// }

// export const addTodolistAC = (todolist: Todolist) => {
// 	return {type: "ADD-TODOLIST", payload: {todolist}} as const
// }
//
// export const changeTodolistTitleAC = (payload: { id: string; title: string }) => {
// 	return {type: "CHANGE-TODOLIST-TITLE", payload} as const
// }
//
// export const changeTodolistFilterAC = (payload: { id: string; filter: FilterValuesType }) => {
// 	return {type: "CHANGE-TODOLIST-FILTER", payload} as const
// }
//
// export const changeTodolistEntityStatusAC = (payload: { id: string; entityStatus: RequestStatus }) => {
// 	return {type: "CHANGE-TODOLIST-ENTITY-STATUS", payload} as const
// }
//
// export const setTodolistsAC = (todolists: Todolist[]) => {
// 	return {type: "SET-TODOLISTS", todolists} as const
// }
//
// export const clearTodolistsAC = () => {
// 	return {type: "CLEAR-TODOLISTS"} as const
// }

// Actions types
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
// export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
// export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
// export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
// export type ClearTodolistsActionType = ReturnType<typeof clearTodolistsAC>

// Thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	todolistsApi
		.getTodolists()
		.then((res) => {
			dispatch(setAppStatus({status: "succeeded"}))
			dispatch(setTodolists({todolists: res.data}))
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	todolistsApi
		.createTodolist(title)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(addTodolist({todolists:res.data.data.item}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	dispatch(changeTodolistEntityStatus({id, entityStatus: "loading"}))
	todolistsApi
		.deleteTodolist(id)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(removeTodolist({id}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			dispatch(changeTodolistEntityStatus({id, entityStatus: "failed"}))
			handleServerNetworkError(error, dispatch)
		})
}

export const updateTodolistTitleTC = (arg: { id: string; title: string }) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	todolistsApi
		.updateTodolist(arg)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(changeTodolistTitle({title: arg}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

// type ActionsType =
// 	| RemoveTodolistActionType
// 	| AddTodolistActionType
// 	| ChangeTodolistTitleActionType
// 	| ChangeTodolistFilterActionType
// 	| ChangeTodolistEntityStatusType
// 	| SetTodolistsActionType
// 	| ClearTodolistsActionType
