import { insertionSort_v2 } from './InsertionSort.mjs';
/**
 * 归并排序性能不错，时间复杂度为 O(nlog(n))
 *
 * 采用了分而治之的思想，将原始数组切分成较小的数组，直到每个小数组只有一个位置
 * 接着把小数组归并成较大的数组，直到最后一个排序完毕的大数组
 *
 * 1. 时间复杂度：
 * 以数组的长度为 8 为例，在每一层都执行了数组长度这么多次的 赋值 比较 再赋值回去的操作
 * 而每一层参与比较的元素个数之和与数组的长度相等
 * 有多少层呢？倒数第一层每个结点有1个元素、第二层有2个元素、第三层有4个元素...
 * 第一层只有一个节点，8个元素
 * 问题就可以转化为2的多少次幂等于 N，这恰好是对数的定义
 *
 * 因此，当输入数组的长度是2的次幂时，递归树的高度是以2为底N的对数，
 * 当输入数组的长度不是2的次幂时，递归树的高度是以2为底的对数向上取整，最多只差1，可忽略
 * 对数的底我们也不在乎，因为根据对数的换底公式，
 * 以2为底b的对数 和 以10为底b的对数 相差常数的倍数，可忽略
 * 每一层的复杂度为 O(n)，有logN这么多层，因此时间复杂度为 O(NlogN)，这里N是输入数组的大小
 *
 * 2. 空间复杂度：
 * 辅助数组的大小为 O(n)，递归使用到的栈的大小为 logN，总空间复杂度为 O(n)
 *
 */

export function mergeSort(nums) {
  const len = nums.length; // 获取数组长度

  const temp = new Array(len); // 创建一个与原数组等大小的 temp 数组

  merge(nums, 0, len - 1, temp); // 开始排序

  return nums;
}

function merge(nums, left, right, temp) {
  // 优化1：如果数组长度小于 16，直接插入排序后返回
  if (right - left < 16) {
    insertionSort_v2(nums, left, right);
    return;
  }

  // 这里也可以写成 left + ((right - left) / 2 | 0);
  // 或者 left + Math.floor((right - left) / 2);
  const mid = (left + right) >> 1;

  // 以 mid 为中心劈成两半
  // 各自递归调用 merge 函数
  merge(nums, left, mid, temp);
  merge(nums, mid + 1, right, temp);

  // 若此时 nums[mid] <= nums[mid + 1] 成立
  // 说明数组已经有序，直接返回即可
  if (nums[mid] <= nums[mid + 1]) return;

  // 给 temp 数组赋值
  for (let i = left; i <= right; ++i) {
    temp[i] = nums[i];
  }

  let i = left;
  let j = mid + 1;

  for (let k = left; k <= right; ++k) {
    // 情况1：此时 i 越界了，就将剩下的 j 赋值回去
    if (i === mid + 1) {
      nums[k] = temp[j];
      ++j;
    }
    // 情况2：此时 j 越界了，就将剩下的 i 赋值回去
    else if (j === right + 1) {
      nums[k] = temp[i];
      ++i;
    }
    // 情况3：temp[i] <= temp[j]
    // 注意这里为 小于等于
    // 确保了我们算法的稳定性，若没有这个等号就会造成不稳定了
    else if (temp[i] <= temp[j]) {
      nums[k] = temp[i];
      ++i;
    }
    // 情况4：temp[i] > temp[j]
    else {
      nums[k] = temp[j];
      ++j;
    }
  }
}
