import { swap } from './Swap.mjs';
/**
 * 堆排序利用了堆的思想，通过对乱序数组的 heapify(堆化)，
 * 然后从堆顶取最大值或最小值，置换到堆末尾
 * 再从顶部即 index 为 0 的位置，再次 heapify，如此往复直到完成
 *
 * 这里简单解释一下堆
 * 它是一颗完全二叉树
 * 若一颗二叉树，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最底层的节点都集中在该层的最左边；
 * 若深度为k，则有1 ~ 2^(h - 1)个节点；
 * 完全二叉树只有两种情况：（1）满二叉树，（2）最后一层不满
 *
 * 通常我们用数组来表示堆（这里用笔画一下，就很容易理解了）
 * 一个元素的父节点索引为 Math.floor((index - 1) / 2)
 * 左孩子节点索引为 index * 2 + 1
 * 右孩子节点索引为 index * 2 + 2
 *
 * 我们这里说的堆为二叉堆
 * 大家应该都知道有大根堆和小根堆
 * 这里简单解释一下大根堆
 * 即，任意节点，以它为根形成的子树，它的值最大
 * 小根堆同理
 */

export function heapSort(nums) {
  let size = nums.length;
  // 从倒数第二层的最左边父节点开始 heapify，随后蛇形往上走
  // 倒数第二层最左边父节点可以由公式 Math.floor((tree.length -1) / 2) 得到
  for (let i = Math.floor((size - 1) / 2); i >= 0; --i) {
    heapify(nums, size, i);
  }

  // 相当于每次把 最 大/小 值 从堆顶 置换至 数组尾部
  // 将数组最后一个值换到堆顶，并重新从堆顶再次 heapify
  while (size > 0) {
    swap(nums, 0, --size);
    heapify(nums, size, 0);
  }

  // 返回结果数组
  return nums;
}

function heapify(heap, size, index) {
  if (index >= size) return; // 若此时 index >= size 了，就直接返回

  let i = index;
  let c1 = 2 * index + 1;
  let c2 = 2 * index + 2;

  if (c1 < size && heap[c1] > heap[i]) i = c1;
  if (c2 < size && heap[c2] > heap[i]) i = c2;

  if (i !== index) {
    swap(heap, i, index);
    heapify(heap, size, i);
  }
}
