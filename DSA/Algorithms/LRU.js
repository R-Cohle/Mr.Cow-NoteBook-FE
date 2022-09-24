/**
 * LRU--Least Recently Used(最近最少使用)
 *
 * 1. LRUCache(int capacity) 以正整数 作为容量 capacity 初始化 LRU 缓存
 * 2. int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1
 * 3. void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value
 *    若不存在，则向缓存中插入该组 key-value
 *    若插入操作导致关键字数量超过 capacity，则应该 [逐出] 最久未使用的关键字
 *
 * 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行
 */

// 使用 [双向链表] + [哈希表] 实现

// 节点定义
class ListNode {
  constructor(key, val, prev, next) {
    this.key = key;
    this.val = val;
    this.prev = prev || null;
    this.next = next || null;
  }
}

// LRUCache 定义
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // 容量大小
    this.count = 0; // 目前的大小
    this.cache = Object.create(null); // 哈希表

    // 设置虚拟头、尾节点，并相连
    this.head = new ListNode(-1, -1);
    this.tail = new ListNode(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    const node = this.cache[key];
    if (!node) return -1; // 不存在直接返回 -1
    this.#moveToHead(node); // 因为我们读取了它，要把它放到最前面
    return node.val;
  }

  put(key, val) {
    let node = this.cache[key]; // 拿到这个节点
    if (node) {
      // 若已经存在，则更新它的 value 值
      node.val = val;
      // 然后将它移动到头部
      this.#moveToHead(node);
    } else {
      // 若此时容量满了，则需要清除最不经常使用的
      if (this.count === this.capacity) {
        this.#removeLRUCache();
      }
      node = new ListNode(key, val); // 创建新节点
      this.cache[key] = node; // 放到 cache 哈希表中
      this.#addToHead(node); // 添加到头部
      ++this.count; // 同时 count自增
    }
  }

  #removeLRUCache() {
    let tail = this.tail.prev; // 该节点是最不经常使用的那个
    this.#remove(tail);
    delete this.cache[tail.key]; // 把它从 哈希表 中删除
    --this.count; // 同时 count 自减
  }

  #moveToHead(node) {
    this.#remove(node); // 先从链表中移除
    this.#addToHead(node); // 再加回到头部
  }

  #addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // 移除链表中的节点
  #remove(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
  }
}

// TEST
// ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'];
// [([2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4])];
const LRU = new LRUCache(2);
LRU.put(1, 1);
LRU.put(2, 2);
LRU.get(2, 2);
LRU.put(2, 2);
LRU.get(2, 2);
LRU.put(2, 2);
LRU.get(2, 2);
LRU.get(2, 2);
LRU.get(2, 2);
