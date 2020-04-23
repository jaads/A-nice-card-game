export function isValidMove(stack, card) {
    let topCard = stack[stack.length - 1];
    if (topCard == 2) {
        return true;
    }
    if (topCard == 3) {
        if (stack.length > 0) {
            return isValidMove(stack.slice(0, stack.length - 1), card);
        }
    }
    if (topCard == 7) {
        return card <= 7 ? true : false;
    }
    if (card == 10) {
        if (topCard != 7) {
            return true;
        }
    }
    if (topCard <= card || card == 3 || card == 2) {
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