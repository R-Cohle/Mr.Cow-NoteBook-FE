/**
 * 你有一个只支持单个标签页的 浏览器 ，最开始你浏览的网页是 homepage ，
 * 你可以访问其他的网站 url ，也可以在浏览历史中后退 steps 步或前进 steps 步。
 *
 * 请你实现 BrowserHistory 类：
 * 1. BrowserHistory(string homepage) ，用 homepage 初始化浏览器类。
 *
 * 2. void visit(string url) 从当前页跳转访问 url 对应的页面。
 *    执行此操作会把浏览历史前进的记录全部删除。
 *
 * 3. string back(int steps) 在浏览历史中后退 steps 步。如果你只能在浏览历史中
 *    后退至多 x 步且 steps > x ，那么你只后退 x 步。请返回后退 至多 steps 步以
 *    后的 url 。
 *
 * 4. string forward(int steps) 在浏览历史中前进 steps 步。
 *    如果你只能在浏览历史中前进至多 x 步且 steps > x ，那么你只前进 x 步。
 *    请返回前进 至多 steps步以后的 url 。
 */

// 容易想到用双向链表实现

// 链表节点实现
class ListNode {
  constructor(url) {
    this.url = url;
    this.prev = null;
    this.next = null;
  }
}

// BrowserHistory 实现
class BrowserHistory {
  constructor(homepage) {
    this.head = new ListNode(null); // 虚拟头节点
    const node = new ListNode(homepage); // 以 homepage 初始化第一个节点

    // 初始化链表
    node.prev = this.head;
    this.head.next = node;

    // this.cur 指向目前所在页面
    this.cur = this.head.next;
  }

  visit(url) {
    if (this.cur.next) {
      // 把前进的记录全部删掉
      this.cur.next.prev = null;
    }
    const newNode = new ListNode(url);
    newNode.prev = this.cur;
    this.cur.next = newNode;
    this.cur = this.cur.next;
  }

  back(steps) {
    for (let i = 0; i < steps; ++i) {
      // 无法往前走了就停下来
      if (this.cur.prev === this.head) break;
      else this.cur = this.cur.prev;
    }
    return this.cur.url;
  }

  forward(steps) {
    for (let i = 0; i < steps; ++i) {
      // 无法往后走了就停下来
      if (this.cur.next === null) break;
      else this.cur = this.cur.next;
    }
    return this.cur.url;
  }
}
