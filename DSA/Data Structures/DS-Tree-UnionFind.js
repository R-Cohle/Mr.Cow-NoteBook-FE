/**
 * 并查集（处理连接问题）
 * 可以快速判断网络中节点间的连接状态
 * 网络是个抽象的概念
 *
 * 连接问题和路径问题：比路径问题要回答的问题少
 * 因为我们只关心是否连接，而不关心连接形成的路径
 *
 * 对于一组数组，主要支持两个动作
 * union(p, q)
 * isConnected(p, q)
 *
 * 路径压缩版本的
 * 查询和合并操作 时间复杂度：严格意义上：O(log*n)
 * log*n --> iterated logarithm
 * if (n <= 1) log*n = 0
 * if (n > 1)  log*n = 1 + log*(log n)
 * 比 log n 还快，比 O(1) 慢，可以视为近乎 O(1)
 *
 * log* 即表示迭代对数，是增长最慢的函数之一，更缓慢的有 log**, log***...
 */

// 💖 1. 普通版本
class UnionFind_v1 {
  constructor(size) {
    this.parent = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.parent[i] = i;
    }
  }

  getSize() {
    return this.parent.length;
  }

  find(p) {
    while (p !== this.parent[p]) {
      p = this.parent[p];
    }
    return p;
  }

  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }

  union(p, q) {
    const pRoot = this.find(p);
    const qRoot = this.find(q);
    if (pRoot === qRoot) return;
    this.parent[pRoot] = qRoot;
  }
}

// 💖 2. 基于 size 优化版本(用得较少)
class UnionFind_v2 {
  constructor(size) {
    this.parent = new Array(size);
    this.sz = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.parent[i] = i;
      this.sz[i] = i;
    }
  }

  getSize() {
    return this.parent.length;
  }

  find(p) {
    while (p !== this.parent[p]) {
      p = this.parent[p];
    }
    return p;
  }

  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }

  union(p, q) {
    const pRoot = this.find(p);
    const qRoot = this.find(q);
    if (pRoot === qRoot) return;
    // 根据两个元素所在树的 元素个数不同 判断合并方向
    // 将元素个数少的集合 合并到 元素个数多的集合上
    if (this.sz[pRoot] < this.sz[qRoot]) {
      this.parent[pRoot] = qRoot;
      this.sz[qRoot] += this.sz[pRoot];
    } else {
      // this.sz[pRoot] >= this.sz[qRoot]
      this.parent[qRoot] = pRoot;
      this.sz[pRoot] += this.sz[qRoot];
    }
  }
}

// 💖 3. 基于 rank 的优化（“按秩合并”）
class UnionFind_v3 {
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.parnet[i] = i;
      this.rank[i] = 1;
    }
  }

  getSize() {
    return this.parent.length;
  }

  find(p) {
    while (p !== this.parent[p]) {
      p = this.parent[p];
    }
    return p;
  }

  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }

  union(p, q) {
    const pRoot = this.find(p);
    const qRoot = this.find(q);
    if (pRoot === qRoot) return;
    // 根据两个元素所在树的 rank 不同判断合并方向
    // 将 rank 低的集合合并到 rank 高的集合上
    if (this.rank[pRoot] < this.rank[qRoot]) {
      this.parent[pRoot] = qRoot;
    } else if (this.rank[pRoot] > this.rank[qRoot]) {
      this.parent[qRoot] = pRoot;
    } else {
      // this.rank[qRoot] === this.rank[pRoot]
      this.parent[qRoot] = pRoot;
      this.rank[pRoot] += 1;
    }
  }
}

// 💖 4. 基于 路径压缩 的优化（“按秩合并” + 路径压缩）
class UnionFind_v4 {
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.parent[i] = i;
      this.rank[i] = 1;
    }
  }

  getSize() {
    return this.parent.length;
  }

  find(p) {
    // 迭代写法
    // while (p !== this.parent[p]) {
    //   this.parent[p] = this.parent[this.parent[p]];
    //   p = this.parent[p];
    // }
    // return p;

    // 递归写法，一步到位
    if (p !== this.parent[p]) {
      this.parent[p] = this.find(this.parent[p]);
    }
    return this.parent[p];
  }

  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }

  union(p, q) {
    const pRoot = this.find(p);
    const qRoot = this.find(q);
    if (pRoot === qRoot) return;
    // 根据两个元素所在树的 rank 不同判断合并方向
    // 将 rank 低的集合合并到 rank 高的集合上
    if (this.rank[pRoot] < this.rank[qRoot]) {
      this.parent[pRoot] = qRoot;
    } else if (this.rank[pRoot] > this.rank[qRoot]) {
      this.parent[qRoot] = pRoot;
    } else {
      // this.rank[qRoot] === this.rank[pRoot]
      this.parent[qRoot] = pRoot;
      this.rank[pRoot] += 1;
    }
  }
}

export { UnionFind_v1, UnionFind_v2, UnionFind_v3, UnionFind_v4 };
