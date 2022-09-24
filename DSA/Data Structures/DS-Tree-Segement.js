class SegmentTree {
  constructor(arr, merger) {
    this.len = arr.length;
    this.data = new Array(len);
    this.merger = merger;

    for (let i = 0; i < this.len; ++i) {
      this.data[i] = arr[i];
    }

    this.tree = new Array(4 * this.len);
    this.buildSegmentTree(0, 0, this.len - 1);
  }

  // 在 treeIndex 的位置创建区间 [l...r] 的线段树
  buildSegmentTree(treeIndex, l, r) {
    if (l === r) {
      this.tree[treeIndex] = this.data[l];
      return;
    }

    const lTreeIdx = this.leftChild(treeIndex);
    const rTreeIdx = this.rightChild(treeIndex);
    const mid = ((l - r) / 2) | 0;
    this.buildSegmentTree(lTreeIdx, l, mid);
    this.buildSegmentTree(rTreeIdx, mid + 1, r);
    this.tree[treeIndex] = this.merger(
      this.tree[lTreeIdx],
      this.tree[rTreeIdx]
    );
  }

  // 返回区间 [queryL...queryR] 的值
  query(queryL, queryR) {
    return this.queryTree(0, 0, this.len - 1, queryL, queryR);
  }

  // 在以 treeID 为根的线段树中 [l...r] 的范围中
  // 搜索区间 [queryL...queryR] 的值
  queryTree(treeIndex, l, r, queryL, queryR) {
    if (l === queryL && r === queryR) {
      return this.tree[treeIndex];
    }

    const mid = ((l + r) / 2) | 0;
    const lTreeIdx = this.leftChild(treeIndex);
    const rTreeIdx = this.rightChild(treeIndex);

    if (queryL >= mid + 1) {
      return this.query(rTreeIdx, mid, queryL, queryR);
    } else if (queryR <= mid) {
      return this.query(lTreeIdx, mid, queryL, queryR);
    }

    const lRes = this.query(lTreeIdx, mid, queryL, queryR);
    const rRes = this.query(rTreeIdx, mid + 1, mid + 1, queryR);

    return this.merger(lRes, rRes);
  }

  getSize() {
    return this.data.length;
  }

  get(index) {
    return this.data[index];
  }

  leftChild(index) {
    return 2 * index + 1;
  }

  rightChild(index) {
    return 2 * index + 2;
  }
}
