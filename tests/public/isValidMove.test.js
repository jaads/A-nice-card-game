import { isValidMove } from "../../public/card-logic";

describe('7 on', () => {
    test('5', () => {
        expect(isValidMove([5], 7)).toBe(true);
    });
    test('7', () => {
        expect(isValidMove([7], 7)).toBe(true);
    });
    test('9', () => {
        expect(isValidMove([9], 7)).toBe(false);
    });
    test('3 with 12 below', () => {
        expect(isValidMove([12, 3], 7)).toBe(false);
    });
    test('3 with 6 below', () => {
        expect(isValidMove([6, 3], 7)).toBe(true);
    });
});

describe('10 on', () => {
    test('7', () => {
        expect(isValidMove([7], 10)).toBe(false);
    });
    test('4', () => {
        expect(isValidMove([4], 10)).toBe(true);
    });
    test('11', () => {
        expect(isValidMove([11], 10)).toBe(true);
    });
    test('3 with 7 below', () => {
        expect(isValidMove([7, 3], 10)).toBe(false);
    });
    test('3 with 11 below', () => {
        expect(isValidMove([11, 3], 10)).toBe(true);
    });
});

describe('3 is current', () => {
    describe('normal', () => {
        test('12 on 11', () => {
            expect(isValidMove([11, 3], 12)).toBe(true);
        });
        test('9 on 11', () => {
            expect(isValidMove([11, 3], 9)).toBe(false);
        });
        test('10 on 11', () => {
            expect(isValidMove([11, 3], 10)).toBe(true);
        });
        test('14 on 14', () => {
            expect(isValidMove([14, 3], 14)).toBe(true);
        });
    });
    describe('7 is below', () => {
        test('9', () => {
            expect(isValidMove([7, 3], 9)).toBe(false);
        });
        test('6', () => {
            expect(isValidMove([7, 3], 6)).toBe(true);
        });
        test('7', () => {
            expect(isValidMove([7, 3], 7)).toBe(true);
        });
        test('3 with 7 below', () => {
            expect(isValidMove([7, 3], 10)).toBe(false);
        });
    });
    describe('3 is below', () => {
        test('11 on 11', () => {
            expect(isValidMove([11, 3, 3], 11)).toBe(true);
        });
        test('12 on 11', () => {
            expect(isValidMove([11, 3, 3], 12)).toBe(true);
        });
        test('9 on 11', () => {
            expect(isValidMove([11, 3, 3], 9)).toBe(false);
        });
        test('10 on 11', () => {
            expect(isValidMove([11, 3], 10)).toBe(true);
        });
    });
});

describe('7 is current', () => {
    test('7', () => {
        expect(isValidMove([7], 7)).toBe(true);
    });
    test('6', () => {
        expect(isValidMove([7], 6)).toBe(true);
    });
    test('8', () => {
        expect(isValidMove([7], 8)).toBe(false);
    });
    test('3', () => {
        expect(isValidMove([7], 3)).toBe(true);
    });
    test('10', () => {
        expect(isValidMove([7], 10)).toBe(false);
    });

});

describe('2', () => {
    test('9', () => {
        expect(isValidMove([2], 9)).toBe(true);
    });
    test('13', () => {
        expect(isValidMove([13], 2)).toBe(true);
    });
    test('7', () => {
        expect(isValidMove([7], 2)).toBe(true);
    });
});

describe('basics', () => {
    test('9 on 11', () => {
        expect(isValidMove([11], 9)).toBe(false);
    });
    test('4 on 2', () => {
        expect(isValidMove([2], 4)).toBe(true);
    });
    test('8 on 5', () => {
        expect(isValidMove([8], 5)).toBe(false);
    });
});
