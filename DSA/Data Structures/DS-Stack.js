/**
 * 利用单向链表实现栈
 *
 * P.S. 这里就不 import 之前实现的 SinglyLinkedList 了
 * 这里就实现一个非常简易的单向链表
 */

class Stack {
  constructor() {
    this.stack = new LinkedList();
  }

  size() {
    return this.stack.count;
  }

  // 瞥一眼栈顶元素，若栈没有元素，返回 null
  peek() {
    if (!this.stack.count) return null;
    return this.stack.head.next.key;
  }

  // 入栈
  push(val) {
    return this.stack.addAtHead(val);
  }

  // 弹出栈顶元素，弹出失败则返回 null
  pop() {
    return this.stack.removeFromHead()?.key || null;
  }
}

// 链表节点的实现
class ListNode {
  constructor(key, next = null) {
    this.key = key;
    this.next = next;
  }
}

// 极简单向链表的实现
class LinkedList {
  constructor() {
    this.count = 0; // 记录当前链表实际长度
    this.head = new ListNode(-1); // 虚拟头节点
  }

  // 往链表头部插入节点，返回链表的实际长度
  addAtHead(key) {
    const node = new ListNode(key);
    node.next = this.head.next;
    this.head.next = node;
    ++this.count;
    return this.count;
  }

  // 从链表头部移除一个节点，若移除成功返回被删除的节点，否则返回 null
  removeFromHead() {
    if (!this.count) return null;
    const fNode = this.head.next;
    this.head.next = fNode.next;
    fNode.next = null;
    --this.count;
    return fNode;
  }
}

// TEST
const stack = new Stack();
console.log(stack.push(9)); // 1
console.log(stack.push(7)); // 2
console.log(stack.peek(1)); // 7
console.log(stack.pop()); // 7
console.log(stack.pop()); // 9
console.log(stack.push(11)); // 1
console.log(stack.push(14)); // 2
console.log(stack.pop()); // 14
console.log(stack.pop()); // 11
console.log(stack.pop()); // null
