function isValidMove(stack, card) {
    if (stack.length == 0) {
        return true;
    }
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

function testValidation(teststack, card, expected) {
    let actual = isValidMove(teststack, card);
    if (actual == expected) {
        console.log('\x1b[32m%s\x1b[0m', 'PASSED', teststack, card);
    } else {
        console.log('\x1b[31m%s\x1b[0m', 'FAILED', teststack, card);
    }
};

console.log('## Testing the validation function');
testValidation([4, 5], 7, true);
testValidation([11, 3], 12, true);
testValidation([7, 3], 8, false);
testValidation([7, 3], 5, true);
testValidation([7, 3], 10, false);
testValidation([6, 7], 10, false);
testValidation([7, 4], 10, true);
testValidation([9, 11], 10, true);
testValidation([9, 11], 9, false);
testValidation([14, 3], 14, true);
testValidation([11, 3], 6, false);
testValidation([4, 6, 7, 3], 6, true);
testValidation([11, 12, 3], 7, false);
testValidation([11, 3, 3], 3, true);
testValidation([11, 3, 3], 10, true);
testValidation([4, 7, 3, 2], 4, true);
testValidation([4, 7, 3, 3], 4, true);
testValidation([4, 7, 3, 3, 4], 9, true);
testValidation([3], 5, true);

