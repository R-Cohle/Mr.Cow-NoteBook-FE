import BST from './DS-Tree-BinarySearch';
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

/**
 * AVL树 是一种自平衡树
 * 添加或移除节点时，AVL树 会尝试保持自平衡
 * 任意一个节点的左子树和右子树高度最多相差 1
 * 添加或移除节点时，AVL树 会尽可能尝试转换为完全树
 */
// class BST {
//   removeNode(node, key);
// }

// 继承一下我们之前实现的 BinarySearchTree
export default class AVLTree extends BST {
  static UN_R = 1;
  static S_UN_R = 2;
  static B = 3;
  static S_UN_L = 4;
  static UN_L = 5;
  static ZERO = 0;

  constructor(compareFn) {
    super(compareFn);
    this.compareFn = compareFn;
    this.root = null;
  }

  // 往树插入一个节点
  insert(key) {
    this.root = this.insertNode(this.root, key);
  }

  // 辅助函数
  insertNode(node, key) {
    // 找到插入位置
    if (!node) return new Node(key);
    // 往左走
    else if (this.compareFn(key, node.key) < AVLTree.ZERO) {
      node.left = this.insertNode(node.left, key);
    }
    // 往右走
    else if (this.compareFn(key, node.key) > AVLTree.ZERO) {
      node.right = this.insertNode(node.right, key);
    }
    // 键已存在
    else {
      return node;
    }

    // 这里检查一下是否需要做旋转操作
    const bFactor = this.getBalanceFactor(node);

    if (bFactor === AVLTree.UN_L) {
      if (this.compareFn(key, node.left.key) < AVLTree.ZERO) {
        node = this.rotationLL(node);
      } else {
        return this.rotationLR(node);
      }
    }

    if (bFactor === AVLTree.UN_R) {
      if (this.compareFn(key, node.right.key) > AVLTree.ZERO) {
        node = this.rotationRR(node);
      } else {
        return this.rotationRL(node);
      }
    }

    return node;
  }

  // 从树中删除一个节点
  removeNode(node, key) {
    node = super.removeNode(node, key);
    if (!node) return node;

    // 检查是否平衡
    const bFactor = this.getBalanceFactor(node);

    // 情况 1：若删除节点后导致左侧不平衡了，进入该分支
    if (bFactor === AVLTree.UN_L) {
      // 算出该节点 [左侧子树] 的平衡因子
      const bFactorL = this.getBalanceFactor(node.left);

      // 情况 1.1：左侧子树向左不平衡了
      if (bFactorL === AVLTree.B || bFactorL === AVLTree.S_UN_L) {
        return this.rotationLL(node);
      }

      // 情况 1.2：左侧子树向右不平衡了
      if (bFactorL === AVLTree.S_UN_R) {
        return this.rotationLR(node.left);
      }
    }

    // 情况 2：若删除节点后导致右侧不平衡了，进入该分支
    if (bFactor === AVLTree.UN_R) {
      // 算出该节点 [右侧子树] 的平衡因子
      const bFactorR = this.getBalanceFactor(node.right);

      // 情况 2.1：右侧子树向右不平衡了
      if (bFactorR === AVL.B || bFactorR === AVLTree.S_UN_R) {
        return this.rotationRR(node);
      }

      // 情况 2.2：右侧子树向左不平衡了
      if (bFactorR === AVL.S_UN_L) {
        return this.rotationRL(node.right);
      }
    }

    return node;
  }

  /**
   * 💖单旋转或双旋转，又对应四种场景💖
   *
   * 情况1️⃣：左左 LL：向右的单旋转
   *
   * 出现于 [节点] 的 [左侧子节点] 的高度，大于 [右侧子节点] 的高度，
   * 并且 [左侧子节点] 也是 [平衡] 或 [左侧较重] 的。
   *
   * 情况2️⃣：右右 RR：向左的单旋转
   *
   * 出现于 [节点] 的 [右侧子节点] 的高度，大于 [左侧子节点] 的高度，
   * 并且 [右侧子节点] 也是 [平衡] 或 [右侧较重] 的。
   *
   * 情况3️⃣：左右 LR：向右的双旋转（先 RR，再 LL）
   *
   * 出现于 [左侧子节点] 的高度，大于 [右侧子节点] 的高度，
   * 并且 [左侧子节点][右侧] 较重。
   *
   * 情况4️⃣：右左 RL：向左的双旋转（先 LL，再 RR）
   *
   * 出现于 [右侧子节点] 的高度，大于 [左侧子节点] 的高度，
   * 并且 [右侧子节点][左侧] 较重。
   */
  rotationLL(node) {
    const temp = node.left;
    node.left = temp.right;
    temp.right = node;
    return temp;
  }

  rotationRR(node) {
    const temp = node.right;
    node.right = temp.left;
    temp.left = node;
    return temp;
  }

  rotationLR(node) {
    node.left = this.rotationRR(node.left);
    return this.rotationLL(node);
  }

  rotationRL(node) {
    node.right = this.rotationLL(node.right);
    return this.rotationRR(node);
  }

  // 得到平衡因子
  getBalanceFactor(node) {
    const hDiff = this.getHeight(node.left) - this.getHeight(node.right);
    // 感觉 siwtch 不美观，就换成 if 了😁
    if (hDiff === -2) return AVLTree.UN_R;
    if (hDiff === -1) return AVLTree.S_UN_R;
    if (hDiff === 1) return AVLTree.S_UN_L;
    if (hDiff === 2) return AVLTree.UN_L;
    return AVLTree.B;
  }

  // 得到该节点的高度
  getHeight(node) {
    if (!node) return -1;
    const lH = this.getHeight(node.left);
    const rH = this.getHeight(node.right);
    return Math.max(lH, rH) + 1;
  }
}
