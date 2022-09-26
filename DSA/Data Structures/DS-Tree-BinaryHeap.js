export default class Heap {
  constructor(compareFn) {
    this.compareFn = compareFn;
    this.heap = [];
  }

  // 查看堆的大小
  size() {
    return this.heap.length;
  }

  // 瞥一眼堆顶元素
  peek() {
    return this.heap[0];
  }

  // 往堆插入元素
  insert(val) {
    this.heap.push(val);
    this.siftUp(this.size() - 1);
  }

  // 从堆顶弹出元素
  extract() {
    if (!this.heap.size()) return;
    this.swap(0, this.size() - 1);
    const removed = this.heap.pop();
    this.heapify(this.heap, this.size(), 0);
    return removed;
  }

  // 当前元素往上走
  siftUp(index) {
    let parent = ((index - 1) / 2) | 0;
    while (index > 0 && this.compareFn(this.heap[i], this.heap[parent])) {
      this.swap(index, parent);
      index = parent;
      parent = ((index - 1) / 2) | 0;
    }
  }

  // 堆化
  heapify(heap, size, index) {
    if (index >= size) return;
    let i = index;
    let c1 = 2 * index + 1;
    let c2 = 2 * index + 2;
    if (c1 < size && this.compareFn(heap[c1], heap[i])) i = c1;
    if (c2 < size && this.compareFn(heap[c2], heap[i])) i = c2;
    if (i !== index) {
      this.swap(i, index);
      this.heapify(heap, size, i);
    }
  }

  // 交换
  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

// 根据传入的比较函数，决定要小顶堆还是大顶堆
// const minHeap = new Heap((a, b) => b > a);
// const maxHeap = new Heap((a, b) => a > b);
