import { swap } from './Swap.mjs';

/**
 * 基本思想：插入排序，可以类比为我们生活中的整理手牌的过程
 * 每次我们从为排好序的牌中抽出一张，放到前面对应的位置
 * 反复该过程，直到全部手牌被整理好
 * 时间复杂度计算：
 * 第 1 轮需要看 1 个元素
 * 第 2 轮 [最多] 需要看 2 个元素
 * ...
 * 第 N - 1 轮 [最多] 需要看 N - 1 个元素
 * 时间复杂度：O( 1 + 2 + ... + (N - 1) ) = O(N^2)
 */

export function insertionSort_v1(nums) {
  const len = nums.length;

  for (let i = 0; i < len; ++i) {
    const temp = nums[i]; // 这里 temp 代表的是 [待插入元素]
    let j = i; // j 代表我们目前看到的位置

    // 如果没越界且 j - 1 为的元素大于 [待插入元素]
    while (j > 0 && nums[j - 1] > temp) {
      // 让这些值往后移
      nums[j] = nums[j - 1];
      --j;
    }

    // 最后插入到正确的位置
    nums[j] = temp;
  }

  return nums;
}
/**
 * 这里我们可能有疑问了，BubbleSort、SelectionSort 以及 这里的 InsertionSort
 * 时间复杂度都为 O(N^2)
 * 那 InsertionSort 有什么特别之处呢？
 * 假设有一近乎有序的数组
 * 采用 InsertionSort，结合代码不难发现
 * 对于每一轮循环，只会比较一次，且不会有移动操作
 * 时间复杂度最优的情况下为 O(N)
 *
 * 一般认为对于 size 较小的数组适合使用 InsertionSort
 * 因为，对于每一个元素来说，它们距离它们应该待的位置很近
 * 所以在进行排序时，平均下来的交换次数以及比较次数就少了很多
 * 故插入排序作用在 [规模较小] 的数组上时效果较好
 *
 * 算法(第4版)提到：在绝大多数情况下
 * 插入排序应用长度为 6 到 16 之间的任意值的排序任务上都能令人满意
 */

// 忽略这里，这里是为了给 MergeSort 用的，作用和上面的 InsertionSort 一样
export function insertionSort_v2(nums, left, right) {
  for (let i = left; i <= right; ++i) {
    const temp = nums[i];
    let j = i;

    while (j > left && nums[j - 1] > temp) {
      nums[j] = nums[j - 1];
      --j;
    }

    nums[j] = temp;
  }

  return nums;
}
