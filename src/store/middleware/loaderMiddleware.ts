import { setLoading } from "../services/slice/loaderSlice"
import { Middleware } from '@reduxjs/toolkit'

import { isAction } from '@reduxjs/toolkit'

export const loaderMiddleware: Middleware = (store) => (next) => (action) => {
  if (isAction(action)) {    
    if (action.type.endsWith('/pending')) store.dispatch(setLoading(true))
    if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
      store.dispatch(setLoading(false))
    }
  }
  return next(action)
}