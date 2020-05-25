// (M1: Matrix<W1, H>， M2: Matrix<H, W2>): Matrix<W1, W2>
function Product(M1, M2) {
    // handling exceptions
    if (M1 == null || M2 == null || typeof(M1[0]) != "object" || typeof(M2[0]) != "object") {
        throw new Error("One input is not matrix!");
    } else if (M1[0].length != M2.length) {
        throw new Error("These matrixes cannot be multiplied!");
    }
    let result = [], oneRow = [], temp = 0;
    for (let row = 0; row < M1.length; row++) {
        for (let col = 0; col < M2[0].length; col++) {
            for (let c = 0; c < M1[0].length; c++) {
                temp += M1[row][c] * M2[c][col];
            }
            oneRow.push(temp);
            temp = 0;
        }
        result.push(oneRow);
        oneRow = [];
        temp = 0;
    }
    return result;
}

/*====================== Testing =========================*/
let M1 = [[1, 2], [3, 4], [5, 6]];
let M2 = [[1, 2, 3], [4, 5, 6]];
console.log(Product(M1, M2));

M1 = [[5, 8, -4], [6, 9, -5], [4, 7, -2]];
M2 = [[2], [-3], [1]];
console.log(Product(M1, M2));

/*
M1 = [[4, 7]];
M2 = [];
console.log(Product(M1, M2));

M1 = [];
M2 = [[2], [-3], [1]];
console.log(Product(M1, M2));

M1 = [[4, 7]];
M2 = [[2], [-3], [1]];
console.log(Product(M1, M2));
*/