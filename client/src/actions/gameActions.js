
  export const toggleXIsNext = () => ({
    type: 'TOGGLE_X_IS_NEXT',
  })
  
  export const changeStep = (step) => ({
    type: 'CHANGE_STEP',
    step
  })
  
  export const addHistory = (i, j) => ({
    type: 'CLICK_SQUARE',
    i, j
  })
  
  export const clickSquare = (history) => ({
    type: 'CLICK_SQUARE',
    history
  })
  
  export const sortMoves = (isDescending) => ({
    type: 'SORT_MOVES',
    isDescending
  })
  