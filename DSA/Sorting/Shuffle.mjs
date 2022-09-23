import { swap } from './Swap.mjs';

export function shuffle(nums) {
  const len = nums.length;
  for (let i = len - 1; i > 0; --i) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    swap(nums, i, randomIndex);
  }
  return nums;
}
