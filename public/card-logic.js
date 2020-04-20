// TODO: Use recursive function based on the actual stack
export function isValidMove(prev, current, next) {
    if (current == 2) {
        return true;
    }
    if (current == 3) {
        if (prev == 7) {
            return next <= prev ? true : false;
        }
        if (next >= prev || next == 10) {
            return true;
        } else {
            return false;
        }
    }
    if (current == 7) {
        return next <= 7 ? true : false;
    }
    if (next >= current || next == 2 || next == 3 || next == 10) {
        return true;
    }
    return false;
};


export function getNumberMapping(letter) {
    if (letter == 't') {
        return 10;
    }
    if (letter == 'j') {
        return 11;
    }
    if (letter == 'q') {
        return 12;
    }
    if (letter == 'k') {
        return 13;
    }
    if (letter == 'a') {
        return 14;
    }
    return 0;
}