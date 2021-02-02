let notvalidalertdiv = document.querySelector('#notvalidalert');
let notyourturnalertdiv = document.querySelector('#notyourturnalert');
let notyetalertdiv = document.querySelector('#notyetalert');
let notJoinYetAlert = document.querySelector('#notjoinedalert');

export function showNotYourTurnAlert() {
    notyourturnalertdiv.style.display = "block";
    setTimeout(() => notyourturnalertdiv.style.display = "none", 3000);
};

export function showNotValidAlert() {
    notvalidalertdiv.style.display = "inline";
    setTimeout(() => notvalidalertdiv.style.display = "none", 3000);
};

export function showNotYetAlert() {
    notyetalertdiv.style.display = "block";
    setTimeout(() => notyetalertdiv.style.display = "none", 3000);
};

export function showNotJoinedAlert() {
    notJoinYetAlert.style.display = "block";
    setTimeout(() => notJoinYetAlert.style.display = "none", 3000);
};