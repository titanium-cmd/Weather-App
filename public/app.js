if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/serviceWorker.js')
    .then((reg)=>{
        console.log('ServiceWorker registered');
    })
    .catch((err)=>console.log('ServiceWorker not registered: ',err));
}