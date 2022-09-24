// 求两个数组的交集

// ❤方法 1：利用 Set
function intersection_v1(nums1, nums2) {
  // 做这一步的原因是，我们可以遍历长度更短的那一个（因为取的是交集）
  if (nums1.length < nums2.length) {
    const _ = nums1;
    nums1 = nums2;
    nums2 = _;
  }

  const set1 = new Set(nums1);
  const set2 = new Set();

  for (let len2 = nums2.length, i = 0; i < len2; ++i) {
    // 若 set1 中包含当前遍历到的元素，则加入到结果 set2 中
    set1.has(nums2[i]) && set2.add(nums2[i]);
  }

  return Array.from(set2); // 也可以 [...set2]
}

// ❤方法 2：利用 Sort + 双指针
function intersection_v2(nums1, nums2) {
  // 初始化工作
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  let ptr1 = 0;
  let ptr2 = 0;
  const res = [];
  const len1 = nums1.length;
  const len2 = nums2.length;

  // 开始
  while (ptr1 < len1 && ptr2 < len2) {
    if (nums1[ptr1] < nums2[ptr2]) {
      ++ptr1;
    } else if (nums1[ptr1] > nums2[ptr2]) {
      ++ptr2;
    } else {
      // 只有两个指针指向的元素相等时，才加入结果数组
      res.push(nums1[ptr1]);
      ++ptr1, ++ptr2;
    }
  }

  return res;
}
