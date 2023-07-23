function handleJimWork() {
    return new Promise((resolve, reject) => {
      // Slow method that runs in the background
      const success = doJimWork()
      if (success) {
        resolve()
      } else {
        reject()
      }
    })
  }
  
  const promise = handleJimWork()
  promise
    .then(() => {
      console.log("Success")
    })
    .catch(() => {
      console.error("Error")
    })


