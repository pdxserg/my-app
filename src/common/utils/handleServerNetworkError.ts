import { Dispatch } from "redux"
import { setAppErrorAC, setAppStatusAC } from "../../app/appSlice"

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppErrorAC(error.message))
  dispatch(setAppStatusAC("failed"))
}
