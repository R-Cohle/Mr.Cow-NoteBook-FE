/**
 * LRU--Least Frequently Used(最不经常使用)
 *
 * 1. LFUCache(int capacity) 用数据结构的容量 capacity 初始化对象
 * 2. int get(int key) 如果键 key 存在于缓存中，则获取其值，否则返回 -1
 * 3. void put(int key, int value) 如果键 key 已存在，则变更其值
 *    若键不存在，请插入键值对
 *    当缓存达到其容量 capacity 时，则应该在插入之前，移除最不经常使用的项
 *    当存在平局（即两个或更多个键具有相同使用频率时），应去除 最近最久未使用 的键
 *
 * 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行
 */

// 使用 [双向链表] + [两个哈希表] 实现

// LFUCache 实现
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity; // 容量大小
    this.minFreq = 1; // 最小频率
    this.count = 0; // 目前的大小
    this.cacheMap = Object.create(null); // 哈希表：用来快速定位节点
    this.freqMap = Object.create(null); // 哈希表：用来存不同频率的链表
  }

  get(key) {
    const node = this.cacheMap[key]; // 拿到 key 对应的节点
    if (!node) return -1; // 若不存在，直接返回 -1
    this.#incFreq(node); // 因为我们读了它，所以给它增加一下频率
    return node.val;
  }

  put(key, val) {
    if (this.capacity === 0) return; // 若容量为零，直接返回

    let node = this.cacheMap[key]; // 拿到 key 对应的节点
    if (node) {
      node.val = val; // 已经存在，更新它的值
      this.#incFreq(node); // 顺便给它增加一下频率
    } else {
      // 若此时放不下了，需要清除那些最不频繁使用的节点
      if (this.count === this.capacity) {
        this.#removeLFUCache();
      }

      node = new ListNode(key, val); // 创建新节点
      this.cacheMap[key] = node; // 把它放到 cacheMap 中，以便后面可以快速拿到
      let linkedList = this.freqMap[1]; // 新节点默认频率为一，所以我们去 freqMap 这个哈希表中取一下频率为 1 对应的那一条链表

      // 若频率为 1 对应的双向链表不存在，我们就创建一条新的
      if (linkedList == null) {
        linkedList = new DoublyLinkedList();
        this.freqMap[1] = linkedList;
      }

      linkedList.addToHead(node); // 将这个节点加到这个链表头部
      ++this.count; // 同时 count 自增
    }
  }

  // 增加频率，将节点放到对应频率的双向链表中
  #incFreq(node) {
    const freq = node.freq; // 拿到该节点的频率
    let linkedList = this.freqMap[freq]; // 再去取它所在的链表
    linkedList.remove(node); // 从该链表中删掉

    // 如果这个此时这个 [频率] === [最小频率]
    // 同时对应的那一条链表已经空了
    // 说明 minFreq 需要和 freq+1 保持一致
    // 即 this.minFreq = freq + 1
    if (freq === this.minFreq && linkedList.head.next === linkedList.tail) {
      this.minFreq = freq + 1;
    }

    ++node.freq; // 这里别忘了给 节点的频率自增 1
    linkedList = this.freqMap[freq + 1]; // 取到加一后的那条链表
    // 若不存在，就创建一条新的
    if (linkedList == null) {
      linkedList = new DoublyLinkedList();
      this.freqMap[freq + 1] = linkedList;
    }

    linkedList.addToHead(node); // 将这个节点加到这个链表头部
  }

  // 删除最不经常使用频率最小的节点
  #removeLFUCache() {
    let minList = this.freqMap[this.minFreq]; // 拿到频率最低的那一条链表
    let tail = minList.tail.prev; // 拿到其中最低频率的节点
    minList.remove(tail); // 从链表中删除
    delete this.cacheMap[tail.key]; // 从 cacheMap 中删除
    --this.count; // 同时 count 自减
  }
}

// 链表节点定义
class ListNode {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.freq = 1;
    this.prev = null;
    this.next = null;
  }
}

// 极简版 DoublyLinkedList 实现
class DoublyLinkedList {
  constructor() {
    this.head = new ListNode();
    this.tail = new ListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
  }

  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }
}

// TEST
// ["LFUCache","put","put","get","put","get","get","put","get","get","get"]
// [[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]
const LFU = new LFUCache(2);
LFU.put(1, 1);
LFU.put(2, 2);
LFU.get(1);
LFU.put(3, 3);
LFU.get(2);
LFU.get(3);
LFU.put(4, 4);
LFU.get(1);
LFU.get(3);
LFU.get(4);
