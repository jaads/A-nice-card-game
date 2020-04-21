function isValidMove(prev, current, next) {
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

function testValidation(numbers, expected) {
    let actual = isValidMove(numbers[0], numbers[1], numbers[2]);
    if (actual == expected) {
        console.log('\x1b[32m%s\x1b[0m', 'PASSED', numbers);
    } else {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', numbers);
    }
}

console.log('## Testing the valdation function');
testValidation([4, 5, 7], true);
testValidation([11, 3, 12], true);
testValidation([7, 3, 8], false);
testValidation([7, 3, 5], true);
testValidation([7, 3, 10], false);
testValidation([6, 7, 10], false);
testValidation([7, 4, 10], true);
testValidation([9, 11, 10], true);
testValidation([9, 11, 9], false);
testValidation([14, 3, 14], true);
testValidation([11, 3, 6], false);
