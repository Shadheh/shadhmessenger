function notify(msg) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification('shadh Messenger', { body: msg });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('shadh Messenger', { body: msg });
      }
    });
  }
}