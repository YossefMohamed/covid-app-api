function twoSum(nums, target) {
  index_map = new Map();
  sol = [];
  for (let i = 0; i < nums.length; i++) {
    if (index_map.has(target - nums[i])) {
      sol[0] = i;
      sol[1] = index_map.get(target - nums[i]);
      break;
    } else {
      index_map.set(nums[i], i);
    }
  }
  return sol;
}

console.log(twoSum([3, 3], 6));
