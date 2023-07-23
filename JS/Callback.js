function handleJimWork(successCallback, errorCallback) {
    // Slow method that runs in the background
    const success = doJimWork()
    if (success) {
      successCallback()
    } else {
      errorCallback()
    }
  }
  
  handleJimWork(
    () => {
      console.log("Success")
    },
    () => {
      console.error("Error")
    }
  )