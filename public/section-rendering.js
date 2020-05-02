export function showSwapSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').style.visibility = 'visible';
};

export function showGameSection() {
    document.querySelector('#joinsection').innerHTML = '';
    document.querySelector('#swapsection').innerHTML = '';
    document.querySelector('#gamesection').style.visibility = 'visible';
};

