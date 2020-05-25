interface LinkedList<T> {
    Node head = null;
    Node tail = null;
    public int length();        // 得到链表长度
    public void append(Node element);         // 在链表末尾追加元素
    public void append_head(Node element)    // 在链表头部追加元素
    public void insert(Node element, int index)  // 在链表 index-1 和 index 之间插入一个元素
                            // insert(element, 0) 等于 append_head(element)
                            // insert(element, length()) 等于 append(element)
    public T get(int index);              // 得到 index 位的元素
}

interface Node<T> {
    public T element;
    private Node next = null;
}