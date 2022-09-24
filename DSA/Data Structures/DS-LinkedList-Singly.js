// 单向链表的简易实现

// 节点定义
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// 单向链表定义
class SinglyLinkedList {
  constructor() {
    // 头节点
    this.head = null;

    // 记录目前链表中元素个数
    this.count = 0;
  }

  // 获取链表第 index 个节点的值。若索引无效，则返回 -1。
  get(index) {
    const node = this.getIndexAt(index);
    if (!node) return -1;
    return node.val;
  }

  // 在链表的第一个元素之前添加一个值为 val 的节点
  // 插入后，新节点将成为链表的第一个节点
  addAtHead(val) {
    const newNode = new ListNode(val);
    if (!this.head) this.head = newNode;
    else {
      node.next = this.head;
      this.head = node;
    }
    ++this.count;
  }

  // 将值为 val 的节点追加到链表的最后一个元素
  addAtTail(val) {
    const newNode = new ListNode(val);
    const tail = this.getIndexAt(this.count - 1);
    if (!tail) this.head = newNode;
    else tail.next = newNode;
    ++this.count;
  }

  // 在链表第 index 个节点之前添加一个值为 val 的节点
  // 若 index 等于链表的长度，则该节点将附加到链表的末尾
  // 若 index 大于链表的长度，则不会插入该节点
  // 若 index 小于 0，则在头部插入节点
  addAtIndex(index, val) {
    if (index >= 0 && index <= this.count) {
      if (!index) this.addAtHead(val);
      else {
        const newNode = new ListNode(val);
        const prev = this.getIndexAt(index - 1);
        newNode.prev = prev.next;
        prev.next = newNode;
        ++this.count;
      }
    } else if (index < 0) this.addAtHead(val);
  }

  // 删除链表中第 index 个节点
  deleteAtIndex(index) {
    if (index >= 0 && index < this.count) {
      if (!index) this.head = this.head.next;
      else {
        const prev = this.getIndexAt(index);
        prev.next = prev.next.next;
      }
      --this.count;
    }
  }

  // 获取在索引 index 处的节点
  getIndexAt(index) {
    if (index >= 0 && index < this.conut) {
      let cur = this.head;
      for (let i = 0; i < index; ++i) cur = cur.next;
      return cur;
    }
  }
}
