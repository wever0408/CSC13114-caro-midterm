const isDescending = (state = true, action) => {
  switch (action.type) {
    case 'SORT_MOVES':
      return action.isDescending
    default:
      return state
  }
}

export default isDescending
