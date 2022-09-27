# JS 中的 Class 有啥不同

	### 引言

​	在上一篇文章中，我们谈到了 JavaScript 中主要利用原型链的机制来实现继承，在 Class 出现之前，主要有 6 种实现继承的方式，分别是 *原型链继承*、*盗用构造函数继承*、*组合继承(原型链 + 盗用构造函数)*、*原型式继承*、*寄生式继承*、*寄生组合式继承*，如果手头上有 JS 红宝书，可以翻阅相关章节阅读，书上对以上 6 种方式有详细介绍，或者查看本 repo 的这个[小总结](./Obj-Inheritance.js)。

​	如果不想看的话，这里简单演示一下不使用 Class 实现继承（其中一种方式）的方式：

```javascript
// 这里拿 Person 和 Student 这两个类作为例子
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.eat = function(food) {
  console.log(`${this.name} here, i'm eating ${food}, want some?`);
}

function Student(name, age, subject) {
  // 这里通过盗用构造函数的方式 "继承" 父类的属性(原型上的方法还没继承到)
  Person.call(this, name, age);
  this.subject = subject;
}

// 这里使用 ES6 的 Object.create 实现继承
// Object.create 的作用大致为，传入一个对象
// 并返回一个以该对象为 原型 的新对象

// 如 Object.create(Person.prototype) 返回一个 a 对象
// 且 a.__proto__ === Person.prototype

// 利用这个函数，我们进行如下操作
const prototype = Object.create(Person.prototype);
Student.prototype = prototype;
prototype.constructor = Student;
// 这样我们就完成了 Student 类继承 Person 类了
// P.S. 注意，以上步骤必须在下面的代码之前，否则子类的 prototype 会被覆盖

Student.prototype.intro = function(greeting) {
  console.log(`${greeting}, I major in ${this.subject}.`);
}

const s1 = new Student('John', 22, 'CS');

s1.eat('carrot'); // "John here, i'm eating carrot, want some?"
s1.intro('Wassup'); // "Wassup, I major in CS."
console.log(s1.age) // 22
console.log(s1.subject) // CS
```

​	看完上面这一大段，是不是感觉非常麻烦，而且感觉代码非常零散，没有封装性。

​	是的，的确如此，ES6 出现的 Class 就帮助我们更好地书写 JS 中的 “类”。

### Class 简述

​	首先我们要明确的是，Class 虽然看起来很不一样，但它本质依旧是通过 JS 原有的方式实现继承的，即原型和原型链那套，可以把 Class 看成语法糖。

​	*以下**部分内容**是阮一峰老师写的关于 Class 继承的文章，[有兴趣可以看看原文](https://es6.ruanyifeng.com/#docs/class-extends)*

```javascript
// 这里还是拿 Person 类作为例子，用 Class 改造后
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  eat(food) {
    console.log(`${this.name} here, i'm eating ${food}, want some?`);
  }
}
```

​	在上面的例子中我们看到了 `constructor()` 方法，这是 ES6 对类的默认方法，通过 new 命令生成对象实例自动调用的方法。

​	并且 `constructor` 方法是类中必须要有的，如果没有显式定义，则会默认添加空的 `constructor` 方法。

​	对于类的实例方法，就直接按上面那种写法写就行，形如 `method() {}`。

​	如果是想要实现类的静态方法，即不属于实例对象而是类本身的话，需要用到 `static` 关键字。

### Class 实现继承

​	Class 怎么实现继承呢？非常简单，仅需使用 extends 关键字。

```javascript
// 依旧拿 Student 类作为例子
class Student extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }
  
  intro(greeting) {
    console.log(`${greeting}, I major in ${this.subject}.`);
  }
}
```

​	同样是继承，这里和还之前我们写的非 Class 实现继承，代码量少了很多，变得容易阅读，同时封装性也更强了。

​	这里除了 extends 关键字，我们还注意到了有个 super，这个东西是什么？能省略吗？

​	在使用 Class 中，若实现了继承，子类必须在 `constructor` 中调用 `super` 方法，并传入相关参数。我们可以把 `super` **大致理解为**父类构造函数，在这个例子中，`super` 为 `Person`。

​	虽说如此，如果我们直接打印 `super` 是不可行的，在还没运行的时候，代码编辑器就会提醒我们说，`'super' must be followed by an argument list or member access.`。这句话的意思大概就是说，我们的 `super` 后面要么作为方法传入参数运行，要不就使用点语法获取上面的属性，总之就是不能直接光秃秃的 `super`。

​	假设我们想要拿到父类上的静态属性或方法，我们就可以通过 `super.xxx` 或 `super.xxx()` 的方式拿到。

### super() 需要注意的地方

​	刚刚我们介绍了 `super` 的含义与大致用法，接下来我们来稍微深入一下。

​	对于 `super` 能省略吗这个问题，答案是：不行！

​	若使用 `extends` 实现了继承，子类必须在 `constructor()` 中调用 `super()` 方法，为什么？因为 *ES6 Class* 的继承机制，与 *ES5* 完全不同。

​	**ES5 的继承机制：**先创造一个独立的子类实例对象（这里可以回忆一下我们手写 `new` 时发生的那几个步骤），然后再将父类的方法添加到这个对象上面，即可以理解为“实例在前，继承在后”。

​	**ES6 的继承机制：**先将父类的属性和方法，加一个空的对象上，然后再将该对象作为子类的实例。即可以理解为”继承在前，实例在后“，这就是为什么 *ES6* 的继承必须先调用 `super()` 方法，因为这一步会生成一个继承了父类的 `this` 对象，没有这一步就无法继承父类，后面也无法生成子类了。

​	**总结：**子类新建实例时，调用 `super()`，会先执行一次父类的构造函数，此外，只有在调用完 `super()` 后，才可以使用 `this` 关键字，否则就会报错，这是因为子类实例的构建是建立在完成父类继承的基础上的，只有 `super()` 方法才能让子类实例继承父类。

​	P.S. 若子类没有定义 `constructor()` 方法，那么它会被默认添加，并且会自动调用 `super()`，也就是说，不管有没有显式定义，任何一个子类都会有 `constructor()` 方法。

​	下面给出例子：

```javascript
class Person {
  constructor() {}
}

class Student extends Person {}

const s1 = new Student();
// 并不会报错

// -------------分割-------------

// 若此时我们将 Student 改为
class Student1 extend Person {
  constructor() {}
}
// 报错：Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
// 这条报错信息也很好地佐证了我们上面的论点：即 “继承在前，实例在后”
// 实现继承时，子类只要调用了 constructor，就必须调用 super()
```

### React 中 Class 组件中的 super()

​	React 组件中 constructor 和 super 的小知识，[原文戳这里，作者：走看看](http://t.zoukankan.com/faith3-p-9219446.html)

	1. 如果用到了 `constructor` 就必须写 `super()`，正如我们在上面说到的，这是用来初始化 `this` 的，可以让我们绑定事件等等。
	1. 如果在 `constructor` 中用到了 this.props，就必须给 `super` 加参数。无论是有无显式声明 `constructor()`，在 `render` 或其他声明周期函数中 `this.props` 都是可以使用的，这是 **React** 自动附带的。
	1. 如果没有用到 `constructor`，可以不写，因为 ES6 规范不写 `constructor` 也会在内部自动添加上，同时调用 `super()` 方法。

​	**常见问题：**如果我不写 `super(props)`，那我在其他生命周期中可以使用 `this.props`吗？

​	**答案：**可以！*React* 底层在除了 `constructor` 之外的声明周期中已经帮助我们传入了 `this.props`了，完全不受 `super(props)` 的影响。

​	**总结：**`super` 中的 `props` 是否接收，只能影响 `constructor` 生命周期能否使用 `this.props`，而不影响其他声明周期函数如 `componentDidMount` 等。即：`super` 不传 `props`，`constructor` 中的 `this.props` 就是 `undefined`，但依旧可以直接使用 `props`。*React* 会在构造函数被调用之后，把 `props` 赋值给刚刚创建好的组件实例对象。

### Class 总览

```javascript
// 老规矩，还是拿 Person、Student 类做例子😁
class Student extends Person {
  
  // 👆: Student子类 继承了 Person父类
  
  // Public field: [公共属性]，会被挂在到实例对象上
  university = 'GDUT';
  
  // Private field: [私有属性]，不可从外部访问
  #credits = 0;
  #major = 'Computer Science';
  #courses = ['CNET', 'OS', 'DSA', 'CO', 'lot more...'];
  
  // Static public field: [静态公共属性]，挂载到 [类] 本身，而不是 [实例对象] 上
  static Planet = 'Earth';
  
  // Static private field: [静态私有属性]，挂载到 [类] 本身，而不是 [实例对象] 上
  static #numSubjects = 50; 
  
  constructor(fullName, birthYear, startYear, courses) {
    
    // 之前说的，super() 方法，“继承在先，实例在后”
    super(fullName, birthYear);
    
    // [实例对象] 上的普通属性
    this.startYear = startYear;
    
    // 对 [私有属性] 重新赋值
    this.#course = courses;
  }
  
	// [实例对象] 的 [公共方法]
  introduce() {
		console.log(`I study ${this.#course} at ${this.university}`);    
  }
  
  finishCourse(credit) {
    // 访问 [私有属性] 并更改其值
    this.#credits += credit;
  }
  
	// [实例对象] 的 [私有方法]，外部无法访问
  #run(miles) {
    console.log(`Just ran ${miles}💨, wuhu~~~`);
  }
  
	// getter
  get cet6Score() {
    this._cet6Score;
  }
  
	// setter
  set cet6Score(score) {
    this._cet6Score = score <= 425 ? score : 0;
  }
  
	// Static method: [静态方法]，挂载到 [类] 本身，而不是 [实例对象] 上
	// 								不可以访问实例的属性及方法，只能访问 类的静态属性或方法
  static printPlanet() {
    console.log(this.Planet);
  }
}
```

### Class 的一些小贴士

- `Class` 声明与 `let`、`const` 表现得一样，都有 `TDZ(Temporal Dead Zone)`
- `Class` 内部启用严格模式
- `Class` 的所有方法都是不可枚举的（静态、实例方法都是）
- `Class`，无法用 `new` 调用类的方法（静态、实例方法都是）
- 必须使用 `new` 关键字调用 `Class`
- `Class` 内部不能重写类名



# 完~🎉