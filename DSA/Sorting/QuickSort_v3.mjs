/**
 * 第一版本出现的问题：
 * 对于一些极端用例（顺序数组、几乎有序的数组）使得排序耗时增加
 * 原因：递归树高度增加，时间复杂度成为 O(N^2)
 * 解决方法：随机选择切分元素 pivot
 *
 * 但我们细细思考过后
 * 又出现了新问题：随机选择 pivot 对数组中有大量重复元素的用例失效
 * 即，我们即使随机了，还是随机到和原来值相同的元素，相当于白费功夫
 * 解决方法 1：把等于 pivot 的元素 [平均地] 分到数组的两侧
 * 解决方法 2：把等于 pivot 的元素 [挤到中间]，递归区间可以大大减少
 */

// 这里我们采用 解法1，俗称[双路快排]

// QuickSort第三版

export function quickSort_v3(nums) {
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
   */
  const randomIndex = left + ((Math.random() * (right - left + 1)) | 0);

  swap(nums, left, randomIndex);

  const pivot = nums[left];

  /**
   * 对于区间我们有如下定义：
   * every num in [left + 1..le) <= pivot
   * every num in (ge..right] >= pivot
   *
   * 每一个区间在初始赋值时，恰好都要为空区间
   */
  let le = left + 1; // le: less equals
  let ge = right; // ge: greater equals

  while (true) {
    while (le <= ge && nums[le] < pivot) ++le;
    while (le <= ge && nums[ge] > pivot) --ge;

    // le 来到了第一个大于等于 pivot 的位置
    // ge 来到了第一个小于等于 pivot 的位置
    if (le >= ge) break;

    swap(nums, le, ge);
    ++le, --ge;
  }

  /**
   * 这里解释一下为什么是 left 和 ge 进行交换
   * 从上述代码可以得知：退出循环以后有两种情况
   * 1. le 与 ge 重合，此时 left 与 ge 交换或者 le 交换都行
   * 2. le 与 ge 不重合，不重合的情况一定是 ge 在左边，le 在右边
   *
   * 综上：swap(nums, le, ge) 适用于以上两种情况
   *
   */

  swap(nums, left, ge);

  return ge;
}
