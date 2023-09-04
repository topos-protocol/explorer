import React, { Dispatch, SetStateAction } from 'react'

interface ErrorsContext {
  setErrors: Dispatch<SetStateAction<string[]>>
}

export const ErrorsContext = React.createContext<ErrorsContext>({
  setErrors: () => {},
})
