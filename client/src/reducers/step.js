const step = (state = 0, action) => {

  switch (action.type) {
    case 'CHANGE_STEP':
      return action.step
    case 'CLICK_SQUARE':
      return action.history.length - 1
    default:
      return state
  }
}

export default step
