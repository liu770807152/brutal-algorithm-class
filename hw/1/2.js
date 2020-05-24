function mergeShuffle(array) {
    if (array.length <= 1) {
        return array;
    }
<<<<<<< HEAD
    let [left, right] = split(array); // O(n+m)
    let sortLeft = mergeShuffle(left);
    let sortRight = mergeShuffle(right);
    let shuffled = shuffle(sortLeft, sortRight); // O(log(n+m))
=======
    let [left, right] = split(array);
    let sortLeft = mergeShuffle(left);
    let sortRight = mergeShuffle(right);
    let shuffled = shuffle(sortLeft, sortRight);
>>>>>>> assignment2 finished
    return shuffled;
}

function split(array) {
    let pivot = Math.floor(array.length / 2);
    return [array.slice(0, pivot), array.slice(pivot)];
}

function shuffle(l, r) {
<<<<<<< HEAD
    if (l.length === 0) {
        return r; // O(1)
    }
    else if (r.length === 0) {
        return l; // O(1)
=======
    if (l.length === 0 && r.length != 0) {
        return r;
    }
    else if (r.length === 0) {
        return l;
>>>>>>> assignment2 finished
    }
    let pickLeft = Math.floor(Math.random() * l.length);
    let pickRight = Math.floor(Math.random() * r.length);
    let dice = Math.floor(Math.random() * 100);
    let leftOrRight = dice >= 50 ? true : false;
    let shuffled = [];
    if (leftOrRight) {
        let rTemp = r.splice(pickRight, 1);
        let lTemp = l.splice(pickLeft, 1);
        shuffled = shuffled.concat(rTemp);
        shuffled = shuffled.concat(lTemp);
    } else {
        let rTemp = r.splice(pickRight, 1);
        let lTemp = l.splice(pickLeft, 1);
        shuffled = shuffled.concat(lTemp);
        shuffled = shuffled.concat(rTemp);
    }
<<<<<<< HEAD
    shuffled = shuffled.concat(shuffle(l, r)); // O(log(n+m))
=======
    shuffled = shuffled.concat(shuffle(l, r));
>>>>>>> assignment2 finished
    return shuffled;
}

/*============================ testing =========================== */
function test(f, M) {
    let results = [];
    for (let i = 0; i < M; i++) {
        let array = f([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        results.push(array)
    }

    let stats = [];
    for (let i = 0; i < 10; i++) {
        stats.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    for (let result of results) {
        for (let j = 0; j < result.length; j++) {
            // j // 2
            // result[j] // 3
            // console.log(stats, j, stats[j]);
            if (stats[j][result[j]] === undefined) {
                stats[j][result[j]] = 0;
            } else {
                stats[j][result[j]] += 1;
            }
        }
    }
    return stats;
}

function d(stats, M) {
    M = M / 100
    let sum = 0;
    for (let row of stats) {
        for (let num of row) {
            sum += num / M
        }
    }
    let avg = sum / 100;

    let d_sum = 0;
    for (let row of stats) {
        for (let num of row) {
            d_sum += (num / M  - avg) * (num / M - avg)
        }
    }
    return d_sum / 100;
}

for(let i = 0; i < 5; i++) {
    let M = Math.pow(10, i);
    let t = test(mergeShuffle, M)
    console.log(d(t, M))
}