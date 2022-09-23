import { swap } from './Swap.mjs';

/**
 * partition 做了两件事情
 * 1. 把一个区间按照 [切分元素] 的数值大小进行划分
 * 2. 把 [切分元素] 交换到它最终应该在的位置
 */

// QuickSort第一版

// 入口函数
export function quickSort_v1(nums) {
  quick(nums, 0, nums.length - 1);
  return nums;
}

// quick 函数
function quick(nums, left, right) {
  if (left >= right) return;
  const pivotIndex = partition(nums, left, right);
  quick(nums, left, pivotIndex - 1);
  quick(nums, pivotIndex + 1, right);
}

// partition 函数：每次至少确定一个元素的位置，并返回其位置索引
function partition(nums, left, right) {
  // 这里选择最左边的元素为 pivot
  const pivot = nums[left];
  let j = left;

  /**
   * 这里我们有如下定义
   * every num in [left + 1..j] <= pivot
   * every num in (j..i) > pivot
   *
   * j 取 left 是合理的，对于第一个区间 [left + 1..left] 取不到
   * 对于第二个区间 (left..i)也取不到
   * 故 j取left 是合理的
   *
   */

  // 大放过，小向前
  for (let i = left + 1; i <= right; ++i) {
    if (nums[i] <= pivot) {
      /**
       * 这里 j 先自增的原因为：看我们上面对区间的定义，此时 j 所处位置的元素是 <= pivot 的
       * 故我们应该先让其往后走一步，再交换
       * 因为我们的目的是让 [left + 1...j] <= pivot
       * 如果直接交换再自增 j，就达不到效果了
       */
      ++j;
      swap(nums, i, j);
    }
  }

  // 此时 j 位置的元素 <= pivot
  // 将其交换到数组最前面
  swap(nums, left, j);

  // 返回确定好位置的元素的索引
  return j;
}
