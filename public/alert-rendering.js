let notvalidalertdiv = document.querySelector('#notvalidalert');
let notyourturnalertdiv = document.querySelector('#notyourturnalert');

export function showNotYourTurnAlert() {
    notyourturnalertdiv.style.display = "block";
    setTimeout(() => notyourturnalertdiv.style.display = "none", 3000);
};

export function showNotValidAlert() {
    notvalidalertdiv.style.display = "inline";
    setTimeout(() => notvalidalertdiv.style.display = "none", 3000);
};