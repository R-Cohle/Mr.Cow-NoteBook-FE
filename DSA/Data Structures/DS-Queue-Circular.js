// 利用 双向链表 实现 双端循环队列

// 定义节点
class ListNode {
  constructor(val, prev, next) {
    this.val = val;
    this.prev = prev || null;
    this.next = next || null;
  }
}

// 定义循环队列
class CircularQueue {
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

  // 从队首获取元素。如果队列为空，返回 -1 。
  Front() {
    if (!this.count) return -1;
    return this.head.next.val;
  }

  // 获取队尾元素。如果队列为空，返回 -1 。
  Rear() {
    if (!this.count) return -1;
    return this.tail.prev.val;
  }

  // 向循环队列插入一个元素。如果成功插入则返回 true。
  enQueue(val) {
    if (this.count === this.capacity) return false;
    const newNode = new ListNode(val);
    this.addFront(newNode, this.tail);
    return true;
  }

  // 从循环队列中删除一个元素。如果成功删除则返回 true。
  deQueue() {
    if (!this.count) return false;
    this.removeFromQueue(this.head.next);
    return true;
  }

  // 检查循环队列是否为空。
  isEmpty() {
    return !this.count;
  }

  // 检查循环队列是否已满。
  isFull() {
    return this.count === this.capacity;
  }

  // 从队列中删除节点
  removeFromQueue(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
    --this.count;
  }

  // 将 node 加入到 cur 节点的前面
  addFront(node, cur) {
    node.next = cur;
    node.prev = cur.prev;
    cur.prev.next = node;
    cur.prev = node;
    ++this.count;
  }
}
