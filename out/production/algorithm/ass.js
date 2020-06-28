/** ass1 => JS codes!! */
// (M1: Matrix<W1, H>， M2: Matrix<H, W2>): Matrix<W1, W2>
function Product(M1, M2) {
    // handling exceptions
    if (M1 == null || M2 == null || typeof(M1[0]) != "object" || typeof(M2[0]) != "object") {
        throw new Error("One input is not matrix!");
    } else if (M1[0].length != M2.length) {
        throw new Error("These matrixes cannot be multiplied!");
    }
    let result = [], oneRow = [], temp = 0;
    for (let row = 0; row < M1.length; row++) { // O(W1)
        for (let col = 0; col < M2[0].length; col++) { // O(W2)
            for (let c = 0; c < M1[0].length; c++) { // O(H)
                temp += M1[row][c] * M2[c][col];
            }
            oneRow.push(temp);
            temp = 0;
        }
        result.push(oneRow);
        oneRow = [];
        temp = 0;
    }
    return result; // O(W1*W2*H)
}

/** ass2 => JS codes!! */
function mergeShuffle(array) {
    if (array.length <= 1) {
        return array;
    }
    let [left, right] = split(array); // O(n+m)
    let sortLeft = mergeShuffle(left);
    let sortRight = mergeShuffle(right);
    let shuffled = shuffle(sortLeft, sortRight); // O(log(n+m))
    return shuffled;
}

function split(array) {
    let pivot = Math.floor(array.length / 2);
    return [array.slice(0, pivot), array.slice(pivot)];
}

function shuffle(l, r) {
    if (l.length === 0) {
        return r; // O(1)
    }
    else if (r.length === 0) {
        return l; // O(1)
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
    shuffled = shuffled.concat(shuffle(l, r)); // O(log(n+m))
    return shuffled;
}

/** ass3  => Java codes!! */
class MyLinkedList<T> {
    Node head = null;
    Node tail = null;
    private int length = 0;

    public int length() {
        return this.length;   // O(1)
    }

    public void append(T element) {
        if (this.head == null) {
            this.head = this.tail = new Node(element); // O(1)
            length++;
            return;
        }
        this.tail = this.head.append(element); // O(n)
        length++;
    }

    public void appendHead(T element) {
        Node newHead = new Node(element);
        newHead.setNext(this.head); // O(1)
        this.tail = this.head == null ? newHead : this.tail; // O(1)
        this.head = newHead; // O(1)
        length++; // O(1)
    }

    // 在链表 index-1 和 index 之间插入一个元素
    // insert(element, 0) 等于 append_head(element)
    // insert(element, length()) 等于 append(element)
    public void insert(T element, int index) {
        if (index == 0) {
            appendHead(element); // O(1)
        } else if (index == this.length) {
            this.tail.next = new Node(element);
            this.tail = this.tail.next; // O(1)
            length++;
        } else {
            this.head.insert(this.head, element, index); // O(n)
            length++;
        }
    }

    public T get(int index) {
        return (T) this.head.getElement(index);
    }

    @Override
    public String toString() {
        return this.head.toString();
    }

    class Node {
        private T element;
        private Node next;

        Node(T element) {
            this.element = element;
            this.next = null;
        }

        public Node getNext() {
            return this.next; // O(1)
        }

        public void setNext(Node next) {
            this.next = next; // O(1)
        }

        public Node append(T element) {
            if (this.next != null) {
                return this.next.append(element); // O(n)
            }
            this.next = new Node(element);
            return this.next;
        }

        public T getElement(int index) {
            if (this.next == null && index != 0) {
                throw new IndexOutOfBoundsException("index to get node is out of bound");
            }
            if (index == 0) {
                return this.element; // O(1)
            }
            return this.next.getElement(index - 1); // O(n)
        }

        public void insert(Node last, T element, int index) {
            if (this.next == null && index != 0) {
                throw new IndexOutOfBoundsException("position to insert is out of bound");
            }
            if (index != 0) {
                this.next.insert(this, element, index - 1); // O(n)
            } else {
                last.next = new Node(element);
                last.next.next = this; // O(1)
            }
        }

        public int getLength() {
            int length = 1;
            Node cur = this;
            while (cur.next != null) { // O(n)
                length++;
                cur = cur.next;
            }
            return length;
        }

        @Override
        public String toString() {
            if (this.next == null) {
                return "" + this.element;
            }
            return "" + this.element + ", " + this.next.toString();
        }
    }
}

/*====================== Testing =========================*/
/** ass1 */
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
console.log("==========================================");
/** ass2 */
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
console.log("==========================================");
/** ass3 => Java codes!! */
MyLinkedList<Integer> test = new MyLinkedList<>();

test.append(1);
test.append(2);
test.append(3);
test.append(5);
test.append(6);
System.out.println(test);
System.out.println(test.head);
System.out.println(test.tail);
System.out.println("length is " + test.length());

test.appendHead(0);
System.out.println(test);
System.out.println(test.head);
System.out.println(test.tail);
System.out.println("length is " + test.length());

test.insert(4, 4);
System.out.println(test);
System.out.println(test.head);
System.out.println(test.tail);
System.out.println("length is " + test.length());

test.insert(-1, 0);
System.out.println(test);
System.out.println(test.head);
System.out.println(test.tail);
System.out.println("length is " + test.length());

test.insert(100, 8);
System.out.println(test);
System.out.println(test.head);
System.out.println(test.tail);
System.out.println("length is " + test.length());

System.out.println("node at 0 is " + test.get(0));
System.out.println("node at last position is " + test.get(test.length() - 1));
System.out.println("node at 4 is " + test.get(4));