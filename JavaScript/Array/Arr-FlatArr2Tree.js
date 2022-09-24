// Test Data
const flatArr = [
  { id: 1, title: 'Title-1', parent_id: 0 },
  { id: 2, title: 'Title-2', parent_id: 0 },
  { id: 3, title: 'Title-2-1', parent_id: 2 },
  { id: 4, title: 'Title-3-1', parent_id: 3 },
  { id: 5, title: 'Title-4-1', parent_id: 4 },
  { id: 6, title: 'Title-2-2', parent_id: 2 },
];

// 非递归写法，开了个 map 来存储
// 时间：O(N) 空间：O(N)
function convert(list) {
  const res = []; // 结果数组
  const map = Object.create(null); // 创建一个纯空的对象

  // 将数组的各项以 id 为依据映射到 map 中
  for (const item of list) {
    map[item.id] = item;
  }

  for (const item of list) {
    // 如果我们遍历到的这个 item 就是根，那么直接加入到 res 中
    if (item.parent_id === 0) {
      res.push(item);
      continue;
    }

    // 不为根
    if (item.parent_id in map) {
      const parent = map[item.parent_id]; // 拿到其父
      parent.children ||= []; // ES12 写法，等同于 parent.children = parent.children || [];
      parent.children.push(item); // 加入到其父的 children 中
    }
  }

  return res;
}

// 变回去：tree2Arr
function tree2Arr(list) {
  const res = []; // 结果数组

  for (const item of list) {
    res.push({
      id: item.id,
      title: item.title,
      parent_id: item.parent_id,
    });
    // 若 item 还有 children，继续做 DFS
    if (item.children !== undefined) {
      tree2Arr(item.children, res);
    }
  }

  return res;
}
