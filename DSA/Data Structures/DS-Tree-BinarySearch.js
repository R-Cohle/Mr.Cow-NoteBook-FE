// 树节点定义
class Node {
  constructor(key) {
    this.key = key; // 节点值
    this.left = null; // 左侧节点引用
    this.right = null; // 右侧节点引用
  }
}

// 二叉搜索树
export default class BinarySearchTree {
  static ZERO = 0;

  constructor(compareFn) {
    if (!compareFn || typeof compareFn !== 'function') {
      throw Error('compareFn should be a valid function');
    }
    this.compareFn = compareFn;
    this.root = null;
  }

  // 💖插入节点💖

  // 往树插入一个节点
  insert(key) {
    if (this.root === null) {
      this.root = new Node(key);
    } else {
      this.#insertNode(this.root, key);
    }
  }

  // 辅助函数，将节点添加到根节点以外的其他位置
  // 为了找到插入新节点的位置，需要传入 根节点 和 要插入的节点
  #insertNode(node, key) {
    // 往左走
    if (this.compareFn(key, node.key) < BinarySearchTree.ZERO) {
      if (!node.left) node.left = new Node(key);
      else this.#insertNode(node.left, key);
      return;
    }
    // 往右走
    if (this.compareFn(key, node.key) > BinarySearchTree.ZERO) {
      if (!node.right) node.right = new Node(key);
      else this.#insertNode(node.right, key);
    }
  }

  // 💖移除节点💖

  // 移除一个节点
  remove(key) {
    this.root = this.#removeNode(this.root, key);
  }

  // 辅助函数
  #removeNode(node, key) {
    if (!node) return null;

    // 往左走
    if (this.compareFn(key, node.key) < BinarySearchTree.ZERO) {
      node.left = this.#removeNode(node.left, key);
      return node;
    }

    // 往右走
    if (this.compareFn(key, node.key) > BinarySearchTree.ZERO) {
      node.right = this.#removeNode(node.right, key);
      return node;
    }

    // 找到了！
    /**
     * 有三种情况
     * 1. 该节点　左右孩子都为空
     * 2. 该节点　有左孩子或右孩子
     * 3. 该节点　左右孩子都有
     */

    // 情况1
    /**
     * 这种情况，需要将这个节点赋值 null 移除它
     * 并返回 null
     */
    if (!node.left && !node.right) {
      node = null;
      return node;
    }

    // 情况2
    /**
     * 这种情况，需要跳过这个节点，直接将父节点指向它的儿子节点之一
     * 1. 若没有左孩子，直接把自己变为右孩子并返回自己
     * 2. 若没有右孩子，直接把自己变为左孩子并返回自己
     */
    if (!node.left) {
      node = node.right;
      return node;
    } else if (!node.right) {
      node = node.left;
      return node;
    }

    // 情况3
    /**
     * 这种情况，需要找到右子树中最小的值
     * 把自己的值变为右子树的最小值
     * 然后将右子树最小值删除
     * 最后返回自己
     */
    const aux = this.min(node.right);
    node.key = aux.key;
    node.right = this.removeNode(node.right, aux.key);
    return node;
  }

  // 💖搜索节点💖

  // 搜索树中最小值节点，树为空返回 -1
  min() {
    if (!this.root) return -1;
    let cur = this.root;
    while (cur?.left) cur = cur.left;
    return cur;
  }

  // 搜索树中最大值节点，树为空返回 -1
  max() {
    if (!this.root) return -1;
    let cur = this.root;
    while (cur?.right) cur = cur.right;
    return cur;
  }

  // 搜索一个特定的值，找到返回 true，否则返回 false
  searchNode(key) {
    return this.#search(this.root, key);
  }

  // 辅助函数
  #search(node, key) {
    if (!node) return false;

    // 往左走
    if (this.compareFn(key, node.key) < BinarySearchTree.ZERO) {
      return this.#search(node.left, key);
    }

    // 往右走
    if (this.compareFn(key, node.key) > BinarySearchTree.ZERO) {
      return this.#search(node.right, key);
    }

    // 找到了！
    return true;
  }

  // 💖树的遍历💖

  // 前序遍历（可选择 'rec' 或 'ite'）
  preorder(choice) {
    if (choice === 'rec') return this.#preorder_rec(this.root);
    if (choice === 'ite') return this.#preorder_ite();
    throw Error("Input should be 'rec' or 'ite'");
  }

  #preorder_rec(node, res = []) {
    if (!node) return res;
    res.push(node.key);
    this.#preorder_rec(node.left, res);
    this.#preorder_rec(node.right, res);
    return res;
  }

  #preorder_ite() {
    if (!this.root) return [];
    const res = [];
    const stack = [this.root];
    while (stack.length) {
      const n = stack.pop();
      res.push(n.key);
      n.right && stack.push(n.right);
      n.left && stack.push(n.left);
    }
    return res;
  }

  // 中序遍历（可选择 'rec' 或 'ite'）
  inorder(choice) {
    if (choice === 'rec') return this.#inorder_rec(this.root);
    if (choice === 'ite') return this.#inorder_ite();
    throw Error("Input should be 'rec' or 'ite'");
  }

  #inorder_rec(node, res = []) {
    if (!node) return res;
    this.#inorder_rec(node.left, res);
    res.push(node.key);
    this.#inorder_rec(node.right, res);
    return res;
  }

  #inorder_ite() {
    if (!this.root) return [];
    const res = [];
    const stack = [];
    let cur = this.root;
    while (stack.length || cur) {
      if (cur) {
        stack.push(cur);
        cur = cur.left;
      } else {
        cur = stack.pop();
        res.push(cur.key);
        cur = cur.right;
      }
    }
    return res;
  }

  // 后序遍历（可选择 'rec' 或 'ite'）
  postorder(choice) {
    if (choice === 'rec') return this.#postorder_rec(this.root);
    if (choice === 'ite') return this.#postorder_ite();
    throw Error("Input should be 'rec' or 'ite'");
  }

  #postorder_rec(node, res = []) {
    if (!node) return res;
    this.#postorder_rec(node.left, res);
    this.#postorder_rec(node.right, res);
    res.push(node.key);
    return res;
  }

  #postorder_ite() {
    if (!this.root) return [];
    const res = [];
    const stack = [this.root];
    while (stack.length) {
      const node = stack.pop();
      res.push(node.key);
      node.left && stack.push(node.left);
      node.right && stack.push(node.right);
    }
    return res.reverse();
  }

  // 层序遍历（可选择 'rec' 或 'ite'）
  levelorder(choice) {
    if (choice === 'rec') return this.#levelorder_rec();
    if (choice === 'ite') return this.#levelorder_ite();
    throw Error("Input should be 'rec' or 'ite'");
  }

  #levelorder_rec() {
    const res = [];
    let map = {};
    // 可用　Object.hasOwn(instance, key) 替换
    const hasOwn = Object.prototype.hasOwnProperty;

    function dfs(node, curDepth) {
      if (!node) return;
      map[curDepth] ??= [];
      map[curDepth].push(node.key);
      dfs(node.left, curDepth + 1);
      dfs(node.right, curDepth + 1);
    }
    dfs(this.root, 0);

    for (let key in map) {
      if (!hasOwn.call(map, key)) continue;
      res[key] = map[key];
    }
    map = null;

    return res;
  }

  #levelorder_ite() {
    if (!this.root) return [];
    const res = [];
    const queue = [this.root];
    while (queue.length) {
      const len = queue.length;
      const curLevel = [];
      for (let i = 0; i < len; ++i) {
        const node = queue.shift();
        curLevel.push(node.key);
        node.left && queue.push(node.left);
        node.right && queue.push(node.right);
      }
      res.push(curLevel);
    }
    return res;
  }
}

// TEST
const tree = new BinarySearchTree((a, b) => a - b);
tree.insert(12);
tree.insert(5);
tree.insert(2);
tree.insert(9);
tree.insert(18);
tree.insert(15);
tree.insert(19);
tree.insert(17);
tree.insert(16);
/**
 *        12
 *    5        18
 * 2   9   15     19
 *           17
 *         16
 */
