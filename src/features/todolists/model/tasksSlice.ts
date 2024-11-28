import {ResultCode} from "common/enums"
import {handleServerAppError} from "common/utils/handleServerAppError"
import {handleServerNetworkError} from "common/utils/handleServerNetworkError"
import {Dispatch} from "redux"
import {setAppStatus} from "../../../app/appSlice"
import {RootState} from "../../../app/store"
import {tasksApi} from "../api/tasksApi"
import {DomainTask, UpdateTaskDomainModel, UpdateTaskModel} from "../api/tasksApi.types"
import {createSlice} from "@reduxjs/toolkit";
import {Todolist} from "../api/todolistsApi.types";

export type TasksStateType = {
	[key: string]: DomainTask[]
}

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState: {} as TasksStateType,
	reducers: (create) => {
		return {
			setTasks: create.reducer<{ todolistId: string; tasks: DomainTask[] }>(() => {
			}),
			removeTask: create.reducer<{ taskId: string; todolistId: string }>((state, action) => {
			}),
			addTask: create.reducer<{ task: DomainTask }>((state, action) => {
				// 			const newTask = action.payload.task
// 			return {...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]]}
			}),
			updateTask: create.reducer<{
				taskId: string;
				todolistId: string;
				domainModel: UpdateTaskDomainModel
			}>((state, action) => {
				//	return {
// 				...state,
// 				[action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
// 					t.id === action.payload.taskId
// 						? {
// 							...t,
// 							...action.payload.domainModel,
// 						}
// 						: t,
// 				),
// 			}
			}),
			addTodolist: create.reducer<{ todolist: Todolist }>((state, action) => {
				// return {...state, [action.payload.todolist.id]: []}
			}),
			clearTasks: create.reducer((state, action)=>{}),
		}
	},
})


export const tasksReducer = tasksSlice.reducer
export const {setTasks, removeTask, addTask, updateTask,clearTasks} = tasksSlice.actions

// export const _tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
// 	switch (action.type) {
// 		case "SET-TASKS": {
// 			const stateCopy = {...state}
// 			stateCopy[action.payload.todolistId] = action.payload.tasks
// 			return stateCopy
// 		}
//
// 		case "REMOVE-TASK": {
// 			return {
// 				...state,
// 				[action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
// 			}
// 		}
//
// 		case "ADD-TASK": {
// 			const newTask = action.payload.task
// 			return {...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]]}
// 		}
//
// 		case "UPDATE-TASK": {
// 			return {
// 				...state,
// 				[action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
// 					t.id === action.payload.taskId
// 						? {
// 							...t,
// 							...action.payload.domainModel,
// 						}
// 						: t,
// 				),
// 			}
// 		}
//
// 		case "ADD-TODOLIST":
// 			return {...state, [action.payload.todolist.id]: []}
//
// 		case "REMOVE-TODOLIST": {
// 			let copyState = {...state}
// 			delete copyState[action.payload.id]
// 			return copyState
// 		}
//
// 		case "CLEAR-TASKS": {
// 			return {}
// 		}
//
// 		default:
// 			return state
// 	}
// }

// Action creators
// export const setTasksAC = (payload: { todolistId: string; tasks: DomainTask[] }) => {
// 	return {
// 		type: "SET-TASKS",
// 		payload,
// 	} as const
// }
//
// export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
// 	return {
// 		type: "REMOVE-TASK",
// 		payload,
// 	} as const
// }
//
// export const addTaskAC = (payload: { task: DomainTask }) => {
// 	return {type: "ADD-TASK", payload} as const
// }
//
// export const updateTaskAC = (payload: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) => {
// 	return {
// 		type: "UPDATE-TASK",
// 		payload,
// 	} as const
// }
//
// export const clearTasksAC = () => {
// 	return {type: "CLEAR-TASKS"} as const
// }

// Actions types
// export type SetTasksActionType = ReturnType<typeof setTasksAC>
// export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
// export type AddTaskActionType = ReturnType<typeof addTaskAC>
// export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
// export type ClearTasksActionType = ReturnType<typeof clearTasksAC>

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	tasksApi
		.getTasks(todolistId)
		.then((res) => {
			dispatch(setAppStatus({status: "succeeded"}))
			dispatch(setTasks({todolistId, tasks: res.data.items}))
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	tasksApi
		.deleteTask(arg)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(removeTask(arg))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
	dispatch(setAppStatus({status: "loading"}))
	tasksApi
		.createTask(arg)
		.then((res) => {
			if (res.data.resultCode === ResultCode.Success) {
				dispatch(setAppStatus({status: "succeeded"}))
				dispatch(addTask({task: res.data.data.item}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}

export const updateTaskTC =
	(arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
		(dispatch: Dispatch, getState: () => RootState) => {
			const {taskId, todolistId, domainModel} = arg

			const allTasksFromState = getState().tasks
			const tasksForCurrentTodolist = allTasksFromState[todolistId]
			const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

			if (task) {
				const model: UpdateTaskModel = {
					status: task.status,
					title: task.title,
					deadline: task.deadline,
					description: task.description,
					priority: task.priority,
					startDate: task.startDate,
					...domainModel,
				}

				dispatch(setAppStatus({status: "loading"}))
				tasksApi
					.updateTask({taskId, todolistId, model})
					.then((res) => {
						if (res.data.resultCode === ResultCode.Success) {
							dispatch(setAppStatus({status: "succeeded"}))
							dispatch(updateTask(arg))
						} else {
							handleServerAppError(res.data, dispatch)
						}
					})
					.catch((error) => {
						handleServerNetworkError(error, dispatch)
					})
			}
		}

// type ActionsType =
// 	| RemoveTaskActionType
// 	| AddTaskActionType
// 	| UpdateTaskActionType
// 	| AddTodolistActionType
// 	| RemoveTodolistActionType
// 	| SetTasksActionType
// 	| ClearTasksActionType
