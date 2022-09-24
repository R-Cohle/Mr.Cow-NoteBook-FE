/**
 * 设计一个用于存储字符串计数的数据结构，并能够返回计数最小和最大的字符串
 * 实现 AllOne 类
 *
 * 1. AllOne() 初始化数据结构的对象
 * 2. inc(String key) 字符串 key 的计数增加 1，若数据结构中不存在 key，那么插入计数 1 的key
 * 3. dec(String key) 字符串 key 的计数减少 1，若 key 的计数在减少后为 0，那么需要将这个 key 从数据结构中删除
 * 4. getMaxKey() 返回任意一个计数最大的字符串。若没有元素存在，返回空字符串 ""
 * 5. getMinKey() 返回任意一个计数最小的字符串。若没有元素存在，返回空字符串 ""
 *
 * 注意：每个函数都应当满足 O(1) 平均时间复杂度
 */

// 使用 [双向链表] + [哈希表] + [若干个 Set] 实现

class AllOne {
  constructor() {
    this.dll = new DoublyLinkedList(); // 用到一条双向链表
    this.map = Object.create(null); // 和一个哈希表：用来快速定位节点
  }

  inc(key) {
    // 情况1：key 不存在
    if (!this.map[key]) {
      // 情况1.1：链表中第一个节点对应频率刚好为 1
      if (this.dll.head.next.val === 1) {
        this.dll.head.next.set.add(key); // 将这个 key(即字符串) 加入到这个节点上的 set 中
        this.map[key] = this.dll.head.next; // 将这个 key 存在哪一个节点做个隐射
      }
      // 情况1.2：链表中第一个节点对应频率不为 1
      else {
        const newNode = new ListNode(1); // 创建一个对应频率为 1 的节点
        const next = this.dll.head.next; // 拿到头节点(虚拟头节点下一个)
        this.dll.addFront(next, newNode); // newNode 成为头节点
        newNode.set.add(key); // 将这个 key(即字符串) 加入到这个节点上的 set 中
        this.map[key] = newNode; // key 和 节点 做个映射
      }
    }
    // 情况2：key 存在
    else {
      let node = this.map[key]; // 拿到该 key 对应的节点
      let next = node.next; // 拿到它的下一个节点

      // 若下一个节点的频率 !== 该 key 对应节点的频率 + 1
      if (node.val + 1 !== next.val) {
        next = new ListNode(node.val + 1); // 创建新的频率节点
        this.dll.addBack(node, next); // 加到双向链表中
      }

      node.set.delete(key); // 从原来的 set 中删除
      next.set.add(key); // 加到这个新的 set 中

      if (node.set.size === 0) this.dll.remove(node); // 若 set 大小为 0，就从双向链表中删除
      this.map[key] = next; // 做个 key 和 next 节点的映射
    }
  }

  dec(key) {
    let node = this.map[key]; // 拿到该 key 对应的节点

    // 这里需要特判一下
    // 若此时节点对应的频率为 1
    // 没得减了
    if (node.val === 1) {
      node.set.delete(key);
      if (node.set.size === 0) this.dll.remove(node);
      delete this.map[key];
      return;
    }

    // 这里和 inc 中对应部分的逻辑相似，就不赘述了
    let prev = node.prev;

    if (prev.val + 1 !== node.val) {
      prev = new ListNode(node.val - 1);
      this.dll.addFront(node, prev);
    }

    node.set.delete(key);
    prev.set.add(key);

    if (node.set.size === 0) this.dll.remove(node);
    this.map[key] = prev;
  }

  getMaxKey() {
    // 从我们的代码可以，双向链表中越往后的节点对应的频率越高
    // 这里看着感觉不太熟悉的话，可以去复习一下 ES6 的迭代器
    return this.dll.tail.prev?.set[Symbol.iterator]().next().value || '';
  }

  getMinKey() {
    // 这里同理，可得
    return this.dll.head.next?.set[Symbol.iterator]().next().value || '';
  }
}

// 链表节点实现
class ListNode {
  constructor(val) {
    this.val = val; // 这里的 val 就是频率
    this.set = new Set(); // 每个节点上挂着一个 Set
    this.next = null;
    this.prev = null;
  }
}

// 极简双向链表实现
class DoublyLinkedList {
  constructor() {
    // 虚拟头、尾节点，并相连
    this.head = new ListNode(-1);
    this.tail = new ListNode(-1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 将 node 加入到 cur 节点前面
  addFront(cur, node) {
    node.next = cur;
    node.prev = cur.prev;
    cur.prev.next = node;
    cur.prev = node;
  }

  // 将 node 加入到 cur 节点后面
  addBack(cur, node) {
    node.prev = cur;
    node.next = cur.next;
    cur.next.prev = node;
    cur.next = node;
  }

  // 移除节点
  remove(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
  }
}
