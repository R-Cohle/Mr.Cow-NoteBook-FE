import { swap } from './Swap.mjs';

/**
 * 基本思想：每次遍历一遍未排好序部分的数组
 * 每次从中选取最小的一个元素
 * 放到已排好序的数组的后一个未知
 * 即每次确定好一个元素的未知
 *
 * 这应该也是最符合我们人类认知方式的一种排序方式了吧
 */

/**
 * 时间复杂度计算与 BubbleSort 类似
 * 这里我们假设数组的长度为 N
 * 第 1 轮从 N 个元素中取得最小的元素，做 N - 1 次比较，1次交换
 * 第 2 轮从 N - 1 个元素中取得最小的元素，做 N - 2 次比较，1次交换
 * ...
 * 第 N - 1 轮从 2 个元素中取得最小的元素，做 1 次比较，1次交换
 * 故有 O( (N - 1) + (N - 2) + ... + 1 + (N - 1) ) = O(N^2)
 */

export function selectionSort(nums) {
  const len = nums.length;

  let minIndex; // minIndex 代表这次循环得到的最小元素的索引

  for (let i = 0; i < len; ++i) {
    minIndex = i; // 每次循环默认由 i 开始，因为每次循环过后都能确认一个元素的未知

    for (let j = i; j < len; ++j) {
      // 若遍历到的这个元素小于 minIndex 位置的元素，就更新 minIndex
      // 这样，每一轮都能拿到未排序部分的最小元素
      if (nums[j] < nums[minIndex]) minIndex = j;
    }

    // minIndex 与 i 不相等再赋值
    if (minIndex !== i) swap(nums, minIndex, i);
  }

  return nums;
}
