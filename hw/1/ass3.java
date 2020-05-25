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

public class ass3 {
    public static void main(String[] args) {
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

    }
}
