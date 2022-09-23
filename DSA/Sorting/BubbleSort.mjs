import { swap } from './Swap.mjs';

export function bubbleSort_v1(nums) {
  const len = nums.length;
  for (let i = 0; i < len; ++i) {
    for (let j = 0; j < len - i - 1; ++j) {
      if (nums[j] > nums[j + 1]) swap(nums, j, j + 1);
    }
  }
  return nums;
}

/**
 * 假设数组的长度为 N，则
 * 第 1 轮需要看 N 个元素
 * 第 2 轮需要看 N - 1 个元素
 * ...
 * 第 N - 1 轮需要看 2 个元素
 * 有 O(N + (N - 1) + ... + 2) 等差数列相加 O(N^2)
 * 故总的时间复杂度为 O(n^2)
 */

/**
 * 但上面 v1 版本的冒泡排序有一个问题
 * 就是如果给定的数组本来就是排好序的
 * 以上代码依旧会每个元素都看，只是不做交换而已
 * 所以我们可以思考，能不能用一个变量来表示是否需要继续遍历比较下去
 */

export function bubbleSort_v2(nums) {
  let i = nums.length - 1;
  let pos = null; // 这里 pos 作为一个标志变量，记录最远需要看到哪里

  while (i) {
    // 若 i 为 0，就会退出循环
    pos = 0;

    for (let j = 0; j < i; ++j) {
      if (nums[j] > nums[j + 1]) {
        swap(nums, j, j + 1);
        pos = j;
      }
    }

    i = pos;
  }

  return nums;
}
