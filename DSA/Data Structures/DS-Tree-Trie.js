/**
 * 字典树 Trie Tree 是一种树形结构，是一种哈希树的变种
 * 排序和保存 [大量的字符串] （但不仅限于字符串）
 *
 * 优点：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较
 * 其他名字：前缀树、单词查找树
 *
 * 若为中文，可以考虑将中文转换为二进制形式再形成前缀树
 */

// Trie 节点
class TrieNode {
  constructor() {
    this.isWord = false;
    // 这里也可以用 26 长度的数组来存
    // this.children = new Array(26)
    this.children = {};
  }
}

// Trie 树
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let cur = this.root;
    for (const char of word) {
      cur.children[char] ??= new TrieNode();
      cur = cur.children[char];
    }
    cur.isWord = true;
  }

  search(word) {
    let cur = this.root;
    for (const char of word) {
      if (!cur.children[char]) return false;
      cur = cur.children[char];
    }
    return cur.isWord;
  }

  startsWith(word) {
    let cur = this.root;
    for (const char of word) {
      if (!cur.children[char]) return false;
      cur = cur.children[char];
    }
    return true;
  }
}

const trie = new Trie();
trie.insert('HotDog');
trie.insert('HotDig');
console.log(trie.startsWith('Hot')); // true
console.log(trie.startsWith('Ho')); // true
console.log(trie.search('HotDig')); // true
console.log(trie.startsWith('HotDoa')); // false
