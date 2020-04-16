export function isValidMove(prev, current, next) {
    if (current == 2) {
        return true;
    }
    if (current == 3) {
        if (next >= prev) {
            return true;
        }
    }
    if (current == 7) {
        if (next <= 7 && next != 10) {
            return true;
        } 
    } else {
        if (next >= current || (next == 2 || next == 3)) {
            return true;
        }
    }
    return false;
};
