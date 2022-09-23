/**
 * 三路快排和双路快排一样，其实就是在划分这件事情上，
 * 将与切分元素相等的值，进行了特殊的处理
 * 将它挤到了数组的中间
 * 把数值相等的元素 [挤到中间]，每一次确定位置的元素变多了，以后递归处理的区间长度减少了
 *
 */

export function quickSort_v4(nums) {
  quick1(nums, 0, nums.length - 1);
  // quick2(nums, 0, nums.length - 1);
  return nums;
}

// 下面的 quick1 和 quick2 只是区间闭合有差别而已（区间的开闭），并不影响结果
function quick1(nums, left, right) {
  if (left >= right) return;

  const randomIndex = left + ((Math.random() * (right - left + 1)) | 0);

  swap(nums, left, randomIndex);

  const pivot = nums[left];

  /**
   * 对于区间我们有如下定义：
   * every num in [left + 1..lt) < pivot
   * every num in [lt..i) === pivot
   * every num in (gt..right] > pivot
   *
   * 每一个区间在初始赋值时，恰好都要为空区间
   */
  let lt = left + 1; // lt: less than
  let gt = right; // ge: greater than
  let i = left + 1;

  while (i <= gt) {
    if (nums[i] < pivot) {
      swap(nums, i, lt);
      ++lt;
      ++i;
    } else if (nums[i] === pivot) {
      ++i;
    } else {
      // nums[i] > pivot
      swap(nums, i, gt);
      --gt;
    }
  }

  swap(nums, left, lt - 1);
  quick1(nums, left, lt - 2);
  quick1(nums, gt + 1, right);
}

function quick2(nums, left, right) {
  if (left >= right) return;

  const randomIndex = (left + Math.random() * (right - left + 1)) | 0;

  swap(nums, left, randomIndex);

  const pivot = nums[left];

  /**
   * 对于区间我们有如下定义：
   * every num in [left + 1..lt] < pivot
   * every num in (lt..i) === pivot
   * every num in [gt..right] > pivot
   *
   * 每一个区间在初始赋值时，恰好都要为空区间
   */
  let lt = left; // lt: less than
  let gt = right + 1; // ge: greater than
  let i = left + 1;

  while (i < gt) {
    if (nums[i] < pivot) {
      ++lt;
      swap(nums, i, lt);
      ++i;
    } else if (nums[i] === pivot) {
      ++i;
    } else {
      // nums[i] > pivot
      --gt;
      swap(nums, i, gt);
    }
  }

  swap(nums, left, lt);

  quick2(nums, left, lt - 1);
  quick2(nums, gt, right);
}
