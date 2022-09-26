// 利用 双向链表 实现 双端循环队列

// 定义节点
class ListNode {
  constructor(val, prev, next) {
    this.val = val;
    this.prev = prev || null;
    this.next = next || null;
  }
}

// 定义双端循环队列
export default class CircularQueue {
  constructor(capacity) {
    // 目前队列内的元素数量
    this.count = 0;

    // 总容量
    this.capacity = capacity;

    // 定义虚拟头、尾节点，并相连
    this.head = new ListNode(-1);
    this.tail = new ListNode(-1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 获取双端队列第一个元素，若双端队列为空，返回 -1
  getFront() {
    if (!this.count) return -1;
    return this.head.next.val;
  }

  // 获取双端队列最后一个元素，若双端队列为空，返回 -1
  getRear() {
    if (!this.count) return -1;
    return this.tail.prev.val;
  }

  // 将一个元素添加到双端队列头部，若操作成功返回 true，否则返回 false
  insertFront() {
    const newNode = new ListNode(val);
    return this.addBack(newNode, this.head);
  }

  // 将一个元素添加到双端队列尾部，若操作成功返回 true，否则返回 false
  insertLast() {
    const newNode = new ListNode(val);
    return this.addFront(newNode, this.tail);
  }

  // 从双端队列头部删除一个元素，若操作成功返回 true，否则返回 false
  deleteFront() {
    return this.removeFromQueue(this.head.next);
  }

  // 从双端队列尾部删除一个元素，若操作成功返回 true，否则返回 false
  deleteLast() {
    return this.removeFromQueue(this.tail.prev);
  }

  // 若双端队列为空，则返回 true，否则返回 false
  isEmpty() {
    return !this.count;
  }

  // 若双端队列满了，则返回 true，否则返回 false
  isFull() {
    return this.count === this.capacity;
  }

  // 从队列中删除节点
  removeFromQueue(node) {
    if (!this.count) return false;
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
    --this.count;
    return true;
  }

  // 将 node 加入到 cur 节点的前面
  addFront(node, cur) {
    if (this.count === this.capacity) return false;
    node.next = cur;
    node.prev = cur.prev;
    cur.prev.next = node;
    cur.prev = node;
    ++this.count;
    return true;
  }

  // 将 node 加入到 cur 节点的后面
  addBack(node, cur) {
    if (this.count === this.capacity) return false;
    node.prev = cur;
    node.next = cur.next;
    cur.next.prev = node;
    cur.next = node;
    ++this.count;
    return true;
  }
}
