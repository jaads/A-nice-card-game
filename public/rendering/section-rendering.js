export function showSwapSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').style.visibility = 'visible';
};

export function showGameSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').innerHTML = '';
    document.querySelector('#gamesection').style.visibility = 'visible';
};

export function showPlayerLeftSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').innerHTML = '';
    document.querySelector('#gamesection').innerHTML = '';
    document.querySelector('#playerleftsection').style.display = 'block';
};
