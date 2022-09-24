// const arr = [1,5,1,7,5,26,2,8,2,8,7]
// 原地算法去重

// nums[0...j] is unique
function unique(nums) {
  nums.sort((a, b) => a - b);
  const len = nums.length;

  // assume nums[0...j] is unique
  let j = 0;
  for (let i = 1; i < len; ++i) {
    if (nums[i] !== nums[j]) {
      ++j;
      nums[j] = nums[i];
    }
  }

  nums.length = j + 1;
  return nums;
}
