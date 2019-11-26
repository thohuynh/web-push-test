const publicVapidKey = 'publicVapidKey';
const sendPush       = document.querySelector('#send-push');
const endPoint       = document.querySelector('#end-point');

subscribePush()

sendPush.addEventListener('click', () => {
  this.postData('/push', JSON.parse(endPoint.value))
})

function urlBase64ToUint8Array(base64String) {
  const padding     = '='.repeat((4 - base64String.length % 4) % 4)
  const base64      = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData     = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

async function postData(url = '/subscribe', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })

  return await response.json() // parses JSON response into native JavaScript objects
}


async function subscribePush() {
  if ('serviceWorker' in navigator) {
    const register = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    })

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } else {
    console.error('Service workers are not supported in this browser')
  }
}