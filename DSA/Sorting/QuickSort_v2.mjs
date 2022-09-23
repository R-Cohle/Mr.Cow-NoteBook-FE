import { swap } from './Swap.mjs';

/**
 * partition在 [顺序数组] 和 [逆序数组] 上表现很差
 * 这一点是和插入排序是相反的
 *
 * partition在以上两种情况时
 * 1. 拆分的子问题的规模只比原来减少了1个元素
 * 2. 每一次划分只能确定一个元素的位置
 * 3. 导致递归树高度增加（非常不平衡、递归树倾斜）
 * 4. 时间复杂度退化为 O(N^2)
 */

// 解决方法：
// 随机选择 pivot 元素，打破顺序性

// QuickSort第二版

export function quickSort_v2(nums) {
  quick(nums, 0, nums.length - 1);
  return nums;
}

function quick(nums, left, right) {
  if (left >= right) return;
  const pivotIndex = partition(nums, left, right);
  quick(nums, left, pivotIndex - 1);
  quick(nums, pivotIndex + 1, right);
}

function partition(nums, left, right) {
  /**
   * Math.random() * (right - left)得到 [0..right - left - 1]
   * 所以我们要 Math.random() * (right - left + 1)得到 [0..right - left]
   * 最后加上 left 得到 [left..right]
   *
   */
  const randomIndex = left + ((Math.random() * (right - left + 1)) | 0);
  swap(nums, left, randomIndex);

  const pivot = nums[left];
  let j = left;
  /**
   * 对于区间有如下定义：
   * every num in [left + 1..j] <= pivot
   * every num in (j..i) > pivot
   *
   * j取left是合理的，对于第一个区间 [left + 1..left] 取不到
   * 对于第二个区间 (left..i) 也取不到
   * 故 j 取 left 是合理的
   *
   */

  // 大放过，小向前
  for (let i = left + 1; i <= right; ++i) {
    if (nums[i] <= pivot) {
      ++j;
      swap(nums, i, j);
    }
  }

  swap(nums, left, j);
  return j;
}
