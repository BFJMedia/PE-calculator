const parseJSON = (isJson) => (response) => {
  return new Promise((resolve) => (isJson ? response.json() : response.text())
    .then((json) => {
      if (response.status === 401 || response.status === 403 ) {
        localStorage.removeItem('jwt')
        // exclude for auth (login / register)
        if (response.url?.indexOf('/auth/') < 0) {
          window.location.replace('/')
        }
      }
      resolve({
        status: response.status,
        ok: response.ok,
        json,
      })
    }))
}

const request = (url, options, isJson = true) => {

  // console.log('env', process.env.API_URL)
  const localData = localStorage.getItem('jwt')
  const token = localData ? (JSON.parse(localData)).token : ''
  // eslint-disable-next-line no-param-reassign
  
  options.headers = {...options.headers, 
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin':'*'
  }

/*   options.headers = {...options.headers, 
    'Authorization': 'Basic '+btoa('flywheel:enlightened-racket')
  } */
  options.mode = 'cors'
  
  if (token) {
    // eslint-disable-next-line no-param-reassign
    options.headers.Authorization = `Bearer ${token}`
  }
  const onSuccess = (response) => {
    if (response.status === 401 || response.status === 403) {
      //localStorage.removeItem('jwt')      
    }
    if (isJson) {
      return response.json()
    } return response.text()
  }

  const onError = (error) => {
    console.log(error)
    //return Promise.reject(error.response)
    //localStorage.removeItem('jwt')
    //window.location.href = "/login";
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('jwt')      
    }
  }
/* 
  return fetch(`${url}`, options)
    .then(onSuccess)
    .catch(onError) */

    return new Promise((resolve, reject) => {
      fetch(`${url}`, options)
        .then(parseJSON(isJson))
        .then((response) => {
          // some validation return 422, already handled in (then/resolve)
          if (response.status === 200) {
            return resolve(response.json)
          }
          // extract the error from the server's json
          return reject(response.json)// return all
        })
        .catch((error) => {
          reject(error)
        })
    })
}

export default request