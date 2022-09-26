// 这里借助 JS 中的 数组 + 双向链表实现 hashTable

export default class HashTable {
  /**
   * 至于这里为什么取 31
   * 可以看一下 stack overflow 的回答，链接🔗如下
   * https://stackoverflow.com/questions/299304/why-does-javas-hashcode-in-string-use-31-as-a-multiplier
   */
  static G = 31;

  constructor(capacity) {
    if (!capacity) throw Error('Please pass in a valid number as the capacity');

    // 哈希表的坑位数量，为每个坑位初始化为一条双向链表
    this.table = new Array(capacity).fill(null).map(() => new LinkedList());

    // 缓存一下 key 对应的 keyHash
    this.keys = Object.create(null);
  }

  /**
   * 简单实现一下哈希函数
   * 这里不清楚可以 google 一下，或者看看这个老师的讲解
   * 链接🔗：https://www.youtube.com/watch?v=jtMwp0FqEcg
   *
   * 下面的计算过程大致为：
   * hash = g^0 * charCodeAt(0) + g^1 * charCodeAt(1) + ... + g^(n) * charCodeAt(n)
   * 最后再对 hash 取模操作，保证落在 0 ~ capacity 内
   */
  hash(key) {
    key += '';
    let hash = 0;
    for (let i = 0, len = key.length; i < len; ++i) {
      hash = HashTable.G * hash + key.charCodeAt(i);
    }
    return hash % this.table.length;
  }

  // 往哈希表内插入一个元素
  set(key, val) {
    const keyHash = this.hash(key); // 得到这个 key 对应的 hash
    this.keys[key] = keyHash;
    const linkedList = this.table[keyHash]; // 拿到这个 hash 对应的链表
    const node = linkedList.get(key); // 尝试从链表中寻找这个 key 对应的节点

    // 若不存在，就用头插法插入一个新的节点
    // 否则，更新节点的值
    if (!node) linkedList.addAtHead(key, val);
    else node.val.val = val;
  }

  // 从哈希表中删除某元素
  delete(key) {
    const keyHash = this.hash(key);
    delete this.keys[key];
    const linkedList = this.table[keyHash];
    return linkedList.remove(keyHash);
  }

  // 从哈希表中拿到 key 对应的元素
  get(key) {
    // 1.算出 keyHash 2.得到对应的链表 3.再去取对应的节点
    return this.table[this.hash(key)].get(key)?.val;
  }

  // 查看哈希表中是否存在这个 key 对应的元素
  has(key) {
    // 注意，这里如果兼容性不错的话，可以用 ES13 的 Object.hasOwn 取代
    return Object.prototype.hasOwnProperty.call(this.keys, key);
  }
}

// TEST
const table = new HashTable(3);
table.set('person1', { name: 'Tom', age: 20 });
table.set('person2', { name: 'Jack', age: 28 });
table.set('person3', { name: 'Mark', age: 15 });
table.set('person4', { name: 'Mike', age: 32 });
table.set('person5', { name: 'John', age: 26 });
table.set('person6', { name: 'Rob', age: 18 });
table.set('person7', { name: 'Bill', age: 9 });
table.set('person8', { name: 'Chad', age: 11 });
console.log(table.get('person1')); // { name: 'Tom', age: 20 }
console.log(table.get('person2')); // { name: 'Jack', age: 28 }
console.log(table.get('person3')); // { name: 'Mark', age: 15 }
console.log(table.get('person4')); // { name: 'Mike', age: 32 }
console.log(table.get('person5')); // { name: 'John', age: 26 }
console.log(table.get('person6')); // { name: 'Rob', age: 18 }
console.log(table.get('person7')); // { name: 'Bill', age: 9 }
console.log(table.get('person8')); // { name: 'Chad', age: 11 }
console.log(table.get('person9')); // undefined

// ——————————————————————————————分割线————————————————————————————
// 直接手写，就不 import 了
// 链表节点的实现
class ListNode {
  constructor(key, val, prev, next) {
    this.key = key;
    this.val = val;
    this.prev = prev || null;
    this.next = next || null;
  }
}

// 极简双向链表的实现
class LinkedList {
  constructor() {
    this.count = 0; // 记录当前链表实际长度

    // 设置虚拟头、尾节点，并相连
    this.head = new ListNode(void 0, void 0);
    this.tail = new ListNode(void 0, void 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 根据 val 找到相应的节点，若找不到则返回 null
  get(key) {
    if (!this.count) return null;
    let cur = this.head;
    while (cur && cur.key !== key) {
      cur = cur.next;
    }
    return cur;
  }

  // 往链表头部插入节点，返回链表的实际长度
  addAtHead(key, val) {
    const node = new ListNode(key, val);
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
    return ++this.count;
  }

  // 从链表中移除一个节点，若移除成功返回被删除的节点，否则返回 null
  remove(key) {
    if (!this.count) return null;
    const node = this.get(key);
    if (!node) return null;
    node.next.prev = node.prev;
    node.prev.next = node.next;
    node.next = null;
    node.prev = null;
    return node;
  }
}
