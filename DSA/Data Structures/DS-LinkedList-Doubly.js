// 双向链表的简单实现

// 节点实现
class ListNode {
  constructor(val, next, prev) {
    this.val = val;
    this.next = next || null;
    this.prev = prev || null;
  }
}

// 双向链表
export default class DoublyLinkedList {
  constructor() {
    // 生成虚拟头、尾节点
    this.head = new ListNode(-1);
    this.tail = new ListNode(-1);

    // 头尾相连
    this.head.next = this.tail;
    this.tail.prev = this.head;

    // 记录目前链表中元素个数
    this.count = 0;
  }

  // 获取链表中第 index 个节点的值。若索引无效，则返回 -1。
  get(index) {
    const node = this.getIndexAt(index);
    if (!node) return -1;
    return node.val;
  }

  // 在链表的第一个元素之前添加一个值为 val 的节点
  // 插入后，新节点将成为链表的第一个节点
  addAtHead(val) {
    const newNode = new ListNode(val);
    this.addBack(newNode, this.head);
  }

  // 将值为 val 的节点追加到链表的最后一个元素
  addAtTail(val) {
    const newNode = new ListNode(val);
    this.addFront(newNode, this.tail);
  }

  // 在链表中的第 index 个节点之前添加值为 val 的节点
  // 若 index 等于链表的长度，则将该节点添加到链表的末尾
  // 若 index 大于链表长度，则不插入节点
  // 若 index 小于 0，则在头部插入节点
  addAtIndex(index, val) {
    if (index > 0 && index < this.count) {
      if (!index) this.addAtHead(val);
      else {
        const newNode = new ListNode(val);
        const curNode = this.getIndexAt(index);
        this.addFront(newNode, curNode);
      }
    } else if (index === this.count) {
      this.addAtTail(val);
    } else if (index < 0) {
      this.addAtHead(val);
    }
  }

  // 若索引 index 有效，则删除链表中第 index 个节点
  deleteAtIndex(index) {
    if (index >= 0 && index < this.count) {
      if (!index) {
        this.removeFromList(this.head.next);
      } else if (index === this.count - 1) {
        this.removeFromList(this.tail.prev);
      } else {
        const node = this.getIndexAt(index);
        this.removeFromList(node);
      }
    }
  }

  // 将新的节点 node 加入到 cur 节点的前面
  addFront(node, cur) {
    node.next = cur;
    node.prev = cur.prev;
    cur.prev.next = node;
    cur.prev = node;
    ++this.count;
  }

  // 将新的节点 node 加入到 cur 节点的后面
  addBack(node, cur) {
    node.prev = cur;
    node.next = cur.next;
    cur.next.prev = node;
    cur.next = node;
    ++this.count;
  }

  // 删除一个节点
  removeFromList(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
    --this.count;
  }

  // 获取在索引 index 处的节点。
  getIndexAt(index) {
    if (index >= 0 && index < this.count) {
      let cur = this.head.next;
      for (let i = 0; i < index; ++i) cur = cur.next;
      return cur;
    }
  }
}
