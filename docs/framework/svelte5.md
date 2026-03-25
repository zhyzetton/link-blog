# Svelte5

## 新特性：rune

rune 是在 .svelte和 .svelte.js/.svelte.ts 文件中用于控制Svelte编译器的符号。rune就是语法的一部分，无需导入。就像是JavaScript关键字一样。

### $state

**定义普通变量**

使用let，const

**定义响应式变量**

​`$state`定义

支持深度跟踪，例如数组和对象的变化也会引起UI的更新。像 Set和Map这样的类不会被代理，但Svelte为各种内置函数提供了响应式的实现，可以从 `svelte/reactivity `导入。

使用`$state`定义的变量不是对象或函数，可以像更新任何其他变量一样更新它。

当解构一个响应式变量时，则引用不是响应式的

```ts
let { done, text } = todos[0]
```

**Classes**

可以在类中定义响应式变量

```ts
class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```

this的值非常重要，下面button中调用reset将不起作用，因为this指向的是button

```svelte
<button onclick={todo.reset}>
	reset
</button>
```

解决：

- 使用内联函数

  ​`onclick={()=> todo.reset()}`
- 在类中使用箭头函数定义

  ```ts
  reset = () => {
  	this.text = '';
  	this.done = false;
  }
  ```

 **$state.raw**

使用 $state.raw 声明的响应式变量不能被改变，只能重新分配。如果想更新对象或数组，直接替换它。类似 React

```ts
let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
	name: 'Heraclitus',
	age: 50
};
```

 **$state.snapshot**

获取响应式变量的数据快照，即静态数据。

```svelte
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

### $derived

使用 `$derived`得到派生 state，类似于vue的 computed。是只读的

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

​`$derived(...)` 中的表达式应该是没有副作用的

 **$derived.by(function)**

创建复杂的派生状态

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

**更新传播**

其中，当large的值没有更新时，button中的large文本就不会更新，即使large依赖的count更新

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
</button>
```

### $effect

当你需要将外部系统（无论是库、`<canvas>` 元素，还是网络上的东西）与 Svelte 应用程序内的状态同步时

可以将`$effect`放置在任何位置，而不仅仅是组件的顶层，只要在组件初始化期间（或父效果处于活动状态时）调用即可

可以从 `$effect` 返回一个函数，该函数将在 effect 重新运行之前立即运行，并在 effect 被销毁之前运行

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// This will be recreated whenever `milliseconds` changes
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// if a callback is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

​`$effect`​ 会自动获取在其函数体内同步读取的任何响应式值（`$state`​、`$derived`​ `$props`​），并将它们注册为依赖项。当这些依赖项发生更改时，`$effect` 会重新运行

在组件加载时以及依赖的响应式值发生变化时重新执行。

​`$effect` 只会跟踪在函数体中同步读取的值。

​`$effect` 只会在读取的对象本身发生变化时重新运行，而不是对象的属性发生变化时。

​`$effect` 只会跟踪上一次运行时读取的值。

 **$effect.pre**

少数情况下，可能需要在DOM更新前运行代码

除了时机之外，`$effect.pre`​ 的工作方式与 `$effect` 完全相同。

 **$effect.tracking**

返回代码是在跟踪上下文（如effect）内运行、在模板内运行

```svelte
<script>
	console.log('in component setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

 **$effect.root**

​`$effect.root` 符号是一个高级特性，它创建了一个非追踪作用域，不会自动清理。这个特性适用于那些你希望手动控制的嵌套副作用。该符号还允许在组件初始化阶段之外创建副作用。

```svelte
<script>
	let count = $state(0);

	const cleanup = $effect.root(() => {
		$effect(() => {
			console.log(count);
		});

		return () => {
			console.log('effect root cleanup');
		};
	});
</script>
```

### $props

使用$props接收来自父组件的数据

```svelte
<script lang="ts">
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

**Fallback values 后备值**

```ts
let { adjective = 'happy' } = $props();
```

还可以使用解构赋值来重命名 props

```ts
let { super: trouper = 'lights are gonna find me' } = $props();
```

获取剩余props

```ts
let { a, b, c, ...others } = $props();
```

**Type safety 类型安全**

为props 添加类型注释

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

**更新 props**

当 ==非引用对象==prop 本身更新时，对组件内部 prop 的引用也会更新。子组件能够暂时覆盖prop值，当父组件变化时，子组件会再次和父组件同步。

如果prop时 引用对象时，子组件对对象的修改会改变父组件中的 state。并且控制台会有警告：`ownership_invalid_mutation`，不建议这样直接修改

prop后备值不会变成响应式变量，对它的改变不会导致更新

### $bindable

通常 props 是==单向的==，从父组件到子组件

在Sevlte中，组件props可以被绑定，父组件使用 `bind:`​ 来绑定数据，子组件使用`$bindable`，这样子组件可以修改来自父组件的数据。state可以在子组件中被修改。

```svelte
<script lang="ts">
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

```svelte
/// App.svelte
<script>
	import FancyInput from './FancyInput.svelte';

	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

也可以指定一个后备值

```ts
let { value = $bindable('fallback'), ...props } = $props();
```

### $inspect

$inspect 仅在开发期间有用。生产版本不起作用。

​`$inspect`​ 大致相当于 console.log，但它会在参数更改时重新运行。`$inspect` 深度跟踪state。

​`$inspect`​返回 with，可以通过回调调用而不是console.log。回调的第一个参数是 `init`​ 或 `update`。

```svelte
<script>
	let count = $state(0);

	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // or `console.trace`, or whatever you want
		}
	});
</script>

<button onclick={() => count++}>Increment</button>
```

```ts
$inspect(stuff).with(console.trace);
```

### $host

​`$host` 是一个高级特性，当组件被编译为自定义元素时，用来获取当前组件的引用，发送自定义事件。

## 模板语法

### 基本

- 组件名大写
- 属性值可以包含js表达式或直接是js表达式

  ```svelte
  <a href="page/{p}">page {p}</a>
  <button disabled={!clickable}>...</button>
  ```
- 属性名和变量名称一致时可省略

  ```svelte
  <button {disabled}>...</button>
  <!-- equivalent to
  <button disabled={disabled}>...</button>
  -->
  ```
- 组件属性允许将多个值解构传入

  ```svelte
  <Widget {...things} />
  ```

**Events 事件**

通过添加以on开头的属性可以监听DOM事件

从时间角度来看，事件属性总是在绑定事件之后触发，例如`oninput`​总是在更新到`bind:value`之后触发

**Event delegation**

为了减少内存占用并提高性能，Svelte 使用了一种称为事件委托的技术。这意味着对于某些事件（请参阅下面的列表），应用程序根目录中的单个事件侦听器负责在事件路径上运行任何处理程序。

## 委托事件

- ​`beforeinput`
- ​`click`
- ​`change`
- ​`dblclick`
- ​`contextmenu`
- ​`focusin`
- ​`focusout`
- ​`input`
- ​`keydown`
- ​`keyup`
- ​`mousedown`
- ​`mousemove`
- ​`mouseout`
- ​`mouseover`
- ​`mouseup`
- ​`pointerdown`
- ​`pointermove`
- ​`pointerout`
- ​`pointerover`
- ​`pointerup`
- ​`touchend`
- ​`touchmove`
- ​`touchstart`

### {#if ...}

```js
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

使用 `{:else if expression}`​添加附加条件，或者 `{:else}`结尾

```js
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

### {#each ...}

```js
{#each expression as name}...{/each}
{#each expression as name, index}...{/each}
```

可以使用each 块来迭代值。所讨论的值可以是数组、类似数组的对象（即任何具有`length`​属性的对象）或可迭代对象（如`Map`​和`Set`​ ）——换句话说，任何可以与`Array.from`一起使用的对象。使用index指定索引

```js
<h1>Shopping list</h1>
<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>
```

**为each加key**

```js
{#each expression as name (key)}...{/each}
{#each expression as name, index (key)}...{/each}
```

```js
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- or with additional index value -->
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

如果只是想渲染某些内容n次，可以省略as部分。

```js
<div class="chess-board">
	{#each { length: 8 }, rank}
		{#each { length: 8 }, file}
			<div class:black={(rank + file) % 2 === 1}></div>
		{/each}
	{/each}
</div>
```

​`each`​块可以有一个 `{:else}`。如果列表是空的，则显示其中的内容

```js
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```

### {#key ...}

```js
{#key expression}...{/key}
```

当表达式发生变化时，重新渲染其内容

### {#await ...}

```js
{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled or not a Promise -->
	<p>The value is {value}</p>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
```

如果您在 Promise 拒绝时不需要渲染任何内容（或者不可能出现错误），则可以省略`catch`块。

如果你不关心挂起状态，你也可以省略初始块。

### {#snippet ...}

Svelte 5 引入了 `snippet`​ 语法，这是一种强大的工具，用于创建可复用的模板片段，替代了 Svelte 4 中的 `slot` 机制

​`snippet`​ 可以通过 `{#snippet ...}...{/snippet}`​ 声明，并通过 `@render` 来调用。

snippet可以作为组件的 props 传递

```svelte
<!-- Parent.svelte -->
{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
	<td>{d.price}</td>
{/snippet}

<Table {header} {row} />
```

**隐式属性**

直接在组件内部声明的Snippet会隐式称为propos

```svelte
<!-- this is semantically the same as the above -->
<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th>
		<th>qty</th>
		<th>price</th>
		<th>total</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
		<td>{d.price}</td>
		<td>{d.qty * d.price}</td>
	{/snippet}
</Table>
```

snippet 可以在组件中声明，并通过 `<script module>` 导出，供其他组件使用

```svelte
<!-- Math.svelte -->
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}
```

在其他组件中导入并使用：

```svelte
<script>
	import { add } from './Math.svelte';
</script>

{@render add(3, 4)}
```

类型支持：

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: number[];
		row: Snippet<[number]>;
	}

	let { data, row }: Props = $props();
</script>
```

### {@html ...}

要将原始的HTML注入组件中，使用 @html

```svelte
<article>
	{@html content}
</article>
```

### {@const ...}

@const 定义局部常数

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

### {@debug ...}

​`{@debug ...}`​标签提供了`console.log(...)`的替代方案。当特定变量的值发生变化时，它会记录它们，并在打开开发工具时暂停代码执行。

​`{@debug ...}`接受以逗号分隔的变量名称列表（不是任意表达式）。

```js
<!-- Compiles -->
{@debug user}
{@debug user1, user2, user3}

<!-- WON'T compile -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

### bind:

数据通常从父级向下流动到子级。 `bind:`指令允许数据以另一种方式流动，从子级流向父级。

常规语法是`bind:property={expression}`

当表达式是具有与属性相同名称的标识符时，我们可以省略表达式。

```svelte
<input bind:value={value} />
<input bind:value />
```

**Function bindings**

还可以使用`bind:property={get, set}`​ ， `get`​和`set`位置是函数，使您可以执行验证和转换：

```svelte
<input bind:value={
	() => value,
	(v) => value = v.toLowerCase()}
/>
```

 **&lt;input bind:checked&gt;**

复选框和单选框通过 bind:checked 绑定

 **&lt;input bind:group&gt;**

将多个input绑定到一起

```svelte
<script>
	let tortilla = $state('Plain');

	/** @type {Array<string>} */
	let fillings = $state([]);
</script>

<!-- grouped radio inputs are mutually exclusive -->
<input type="radio" bind:group={tortilla} value="Plain" />
<input type="radio" bind:group={tortilla} value="Whole wheat" />
<input type="radio" bind:group={tortilla} value="Spinach" />

<!-- grouped checkbox inputs populate an array -->
<input type="checkbox" bind:group={fillings} value="Rice" />
<input type="checkbox" bind:group={fillings} value="Beans" />
<input type="checkbox" bind:group={fillings} value="Cheese" />
<input type="checkbox" bind:group={fillings} value="Guac (extra)" />
```

 **&lt;input bind:files&gt;**

在`<input>`​元素的`type="file"`​中，您可以使用`bind:files`​获取所选文件的`FileList`​ 。当您想以编程方式更新文件时，您始终需要使用`FileList`对象

当前无法直接构建`FileList`​对象，因此您需要创建一个新的`DataTransfer`​对象并从那里获取`files`

```svelte
<script>
	let files = $state();

	function clear() {
		files = new DataTransfer().files; // null or undefined does not work
	}
</script>

<label for="avatar">Upload a picture:</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
<button onclick={clear}>clear</button>
```

不能修改`FileList`​对象，因此，如果要从列表中删除一个文件，则需要创建一个新的`DataTransfer`对象并添加要保留的文件

 **&lt;select bind:value&gt;**

​`<select>`​ value 绑定对应于所选`<option>`上的value属性，这可以是任何值

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
	<option value={c}>c</option>
</select>
```

​`<select multiple>`元素的行为与复选框组相似，绑定的值是一个数组

```svelte
<select multiple bind:value={fillings}>
	<option value="Rice">Rice</option>
	<option value="Beans">Beans</option>
	<option value="Cheese">Cheese</option>
	<option value="Guac (extra)">Guac (extra)</option>
</select>
```

当一个`<option>`的值与其文本内容匹配时，可以省略该属性。

```svelte
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
	<option>Guac (extra)</option>
</select>
```

...

**bind:this**

要获取对 DOM 节点的引用，请使用`bind:this`

在安装组件之前，该值将是`undefined` - 换句话说，应该在effect或事件处理程序中读取它，而不是在组件初始化期间读取它

```svelte
<script>
	/** @type {HTMLCanvasElement} */
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>

<canvas bind:this={canvas} />
```

组件也支持`bind:this` ，允许您以编程方式与组件实例交互

```svelte
<ShoppingCart bind:this={cart} />

<button onclick={() => cart.empty()}> Empty shopping cart </button>
```

ShoppingCart.svelte

```svelte
<script lang="ts">
	// All instance exports are available on the instance object
	export function empty() {
		// ...
	}
</script>
```

### use:

当一个组件挂载（mouted）时调用的函数。通常会使用 $effect，以便在卸载元素时可以重置状态。

```svelte
<script lang="ts">
	import type { Action } from 'svelte/action';

	const myaction: Action = (node) => {
		// the node has been mounted in the DOM

		$effect(() => {
			// setup goes here

			return () => {
				// teardown goes here
			};
		});
	};
</script>

<div use:myaction>...</div>
```

可以加参数

```svelte
<script lang="ts">
	import type { Action } from 'svelte/action';

	const myaction: Action = (node, data) => {
		// ...
	};
</script>

<div use:myaction={data}>...</div>
```

该操作仅调用一次，如果参数更改，则==不会==再次运行

### transition:

​`transition:`指令表示双向过度，这意味着在转换过程中可以平滑地反转。

```svelte
<script>
	import { fade } from 'svelte/transition';

	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>toggle</button>

{#if visible}
	<div transition:fade>fades in and out</div>
{/if}
```

可以从`svelte/transition`模块导入一系列内置过渡。

**Local vs global**

默认情况下，过渡是本地的。局部过渡仅在创建或销毁它们所属的块时播放，*而不是*在创建或销毁父块时播放。

```svelte
{#if x}
	{#if y}
		<p transition:fade>fades in and out only when y changes</p>

		<p transition:fade|global>fades in and out when x or y change</p>
	{/if}
{/if}
```

**Transition paramerters**

transition可以有参数。

```svelte
{#if visible}
	<div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
{/if}
```

**Custom transition functions**

```ts
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

转换可以使用自定义函数。如果返回的对象具有`css`函数，Svelte 将为网页动画生成关键帧

使用 easing 函数后，传递给css 的参数`t`​是从0到1之间的值。`in`​transitions 在 0到1之间运行时，`out`​ transitions 在1到0之间运行。换句话说，1是元素的正常状态，和没有应用任何transitions 一样。`u`​ 参数等于 `1-t`

```svelte
<script lang="ts">
	import { elasticOut } from 'svelte/easing';

	export let visible: boolean;

	function whoosh(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number }) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}
```

自定义转换函数还可以返回一个`tick`​函数，该函数在`t`​和`u`相同时运行。

尽量使用css 而不是tick

```svelte
<script lang="ts">
	let visible = $state(false);

	function typewriter(node: HTMLElement, { speed = 1 }: { speed?: number }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>
<button onclick={()=> visible = !visible}>visible</button>
{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

如果转换返回一个函数而不是转换对象，则该函数将在下一个微任务中调用。这允许多个过渡协调，从而使交叉淡入淡出效果成为可能。

转换函数还接收第三个参数`options` ，其中包含有关转换的信息。

​`options`对象中的可用值为：

- direction、in、out之一或both

### animate:

当每个块的关键帧内容被重新排序时，就会触发动画。添加或删除元素时动画不会运行，仅当每个块中现有数据项的索引发生更改时才会运行。 Animate 指令必须位于作为键控每个块的==直接==子元素的元素上。

Animations可以与Svelte的内置动画功能或自定义动画功能一起使用

```svelte
<!-- When `list` is reordered the animation will run -->
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

**animation parameters**

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

**custom animation functions**

```ts
animation = (node: HTMLElement, { from: DOMRect, to: DOMRect } , params: any) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

animations 可以使用提供`node`​ 、 `animation`​对象和任何`parameters`作为参数的自定义函数

​`animation`​参数是一个包含`from`​和`to`​属性的对象，每个属性都包含一个描述元素在其`start`​和`end`​位置的几何形状的DOMRect。`from`​属性是元素在其起始位置的 DOMRect， `to`属性是在列表重新排序和 DOM 更新后元素在其最终位置的 DOMRect。

如果返回的对象具有`css`方法，Svelte 将创建在元素上播放的Web animation。

应用`easing`​函数后，传递给`css`​的`t`​参数是一个从`0`​到`1`​值。 `u`​参数等于`1 - t` 。

在动画开始*之前*，使用不同的`t`​和`u`参数重复调用该函数。

```svelte
<script lang="ts">
	import { cubicOut } from 'svelte/easing';

	function whizz(node: HTMLElement, { from, to }: { from: DOMRect; to: DOMRect }, params: any) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

### style:

​`style:`指令提供了用于在元素上设置多种样式的速记。

```svelte
<!-- These are equivalent -->
<div style:color="red">...</div>
<div style="color: red;">...</div>
```

该值可以包含任意表达式：

```svelte
<div style:color={myColor}>...</div>
```

允许使用简写形式：

```svelte
<div style:color>...</div>
```

可以在单个元素上设置多种样式：

```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

使用`|important`修饰符：

```svelte
<div style:color|important="red">...</div>
```

当`style:`​指令与`style`属性组合时，指令将优先：

```svelte
<div style="color: blue;" style:color="red">This will be red</div>
```

### class

有两种方法可以在元素上设置类： `class`​属性和`class:`指令。

原始值像其他任何属性一样对待:

```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

**Objects and arrays**

从Svelte 5.16 class 可以是对象或数组

如果值是一个对象

```svelte
<script>
	let { cool } = $props();
</script>

<!-- results in `class="cool"` if `cool` is truthy,
	 `class="lame"` otherwise -->
<div class={{ cool, lame: !cool }}>...</div>
```

如果值是数组，则将真相值组合在一起

```svelte
<!-- if `faded` and `large` are both truthy, results in
	 `class="saturate-0 opacity-50 scale-200"` -->
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

数组可以包含数组和对象，clsx 会将它们展平。这对于将本地类与 props 结合起来非常有用

```svelte
<script lang="ts">
	let props = $props();
</script>

<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>
```

可以灵活地混合使用对象、数组和字符串

```svelte
<script lang="ts">
	import Button from './Button.svelte';
	let useTailwind = $state(false);
</script>

<Button
	onclick={() => useTailwind = true}
	class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}
>
	Accept the inevitability of Tailwind
</Button>
```

Svelte暴露了 ClassValue类型

```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	const props: { class: ClassValue } = $props();
</script>

<div class={['original', props.class]}>...</div>
```

## Styling

### 动态类

```svelte
<div class:类名={条件}>
</div>
```

### Scoped styles

Svelte组件可以包括一个属于该组件的CSS的`<style>`元素。默认情况下，该CSS范围是scoped，这意味着样式不会适用于相关组件之外的页面上的任何元素

### Global styles

 **:global(...)**

将样式应用于全局单个选择器，使用 `:global(...)`

```svelte
<style>
	:global(body) {
		/* applies to <body> */
		margin: 0;
	}

	div :global(strong) {
		/* applies to all <strong> elements, in any component,
		   that are inside <div> elements belonging
		   to this component */
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to all <p> elements belonging to this component
		   with `class="big red"`, even if it is applied
		   programmatically (for example by a library) */
	}
</style>
```

 **:global**

将样式应用于一组选择器，使用 `A :global {...}`

```svelte
<style>
	:global {
		/* applies to every <div> in your application */
		div { ... }

		/* applies to every <p> in your application */
		p { ... }
	}

	.a :global {
		/* applies to every `.b .c .d` element, in any component,
		   that is inside an `.a` element in this component */
		.b .c .d {...}
	}
</style>
```

**Custom properties**

可以将CSS自定义属性（无论是静态还是动态）传递给组件

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

```svelte
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</svelte-css-wrapper>
```

对于SVG元素，使用`<g>`

```svelte
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</g>
```

在组件中，我们可以使用`var(...)`读取这些自定义属性（并提供后备值）

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

## Special elements

### svelte:boundary

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

5.3.0添加

boundary使您可以防止应用程序的一部分错误，以免整体破坏应用程序，并从这些错误中恢复。

如果在渲染或更新`[svelte:boundary](svelte:boundary)`​或运行其中包含的任何`$effect`功能的子组件时发生错误，则内容将被删除。

在渲染过程之外发生的错误（例如，在事件处理程序中）不会被错误boundary捕获。

**Properties**

为了 boundary 起作用，必须提供 `failed`​ 或`onerror`

**failed**

如果提供了 `failed`​ snippet，在错误被抛出时，它将会被渲染。以及一个用于重建的`reset`函数

```svelte
<script>
	import FlakyComponent from './FlakyComponent.svelte';
</script>

<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

**onerror**

如果提供了`onerror`​函数，则将以相同的两个`error`​和`reset`参数调用。这对于通过错误报告服务跟踪错误很有用...

```svelte
<svelte:boundary onerror={(e) => report(e)}>
	...
</svelte:boundary>
```

...或使用`error`​并在边界本身之外`reset` ：

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>
		oops! try again
	</button>
{/if}
```

### svelte:window

```svelte
<svelte:window onevent={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

​`<svelte:window>`​元素允许您将事件侦听器添加到`window`​对象中，而不必担心在销毁组件时会删除它们，或者在服务器端渲染时检查`window`的存在。

该元素只能出现在组件的顶层 - 它不能位于块或元素内。

```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

还可以绑定到以下属性：

- ​`innerWidth`
- ​`innerHeight`
- ​`outerWidth`
- ​`outerHeight`
- ​`scrollX`
- ​`scrollY`
- ​`online`​ — `window.navigator.onLine`的别名
- ​`devicePixelRatio`

除`scrollX`​和`scrollY`之外的所有内容都是只读的。

### svelte:document

```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

与`<svelte:window>`​类似，此元素允许您向`document`​上的事件添加侦听器，例如`visibilitychange`​ ，该事件不会在`window`​上触发。它还允许您对`document`使用操作。

与`<svelte:window>`一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内。

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

还可以绑定到以下属性：

- ​`activeElement`
- ​`fullscreenElement`
- ​`pointerLockElement`
- ​`visibilityState`

全部都是只读的。

### svelte:body

```svelte
<svelte:body onevent={handler} />
```

类似于 <sup>​`<svelte:window>`​</sup>​，这个元素允许将监听器添加到document.body上。还使您可以在`<body>`元素上使用操作

就像`svelte:window`​和`svelte:document`一样，此元素可能仅显示组件的最高级别，绝不必须在块或元素内。

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

### svelte:head

```svelte
<svelte:head>...</svelte:head>
```

此元素使得将元素插入`document.head`​ 。在服务器端渲染期间， `head`​内容分别暴露于`body`内容。

与`svelte:window`​ ， `svelte:document`​和`svelte:body` ，此元素可能仅出现在组件的最高级别，并且绝对不能在块或元素内。

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

### svelte:element

```svelte
<svelte:element this={expression} />
```

​`svelte:element`元素使您可以渲染一个在锚定时间未知的元素，因为它来自CMS。存在的任何属性和事件监听器都将应用于元素。

唯一支持的绑定是`bind:this` ，因为 Svelte 的内置绑定不适用于通用元素。

如果`this`值为 null，则该元素及其子元素将不会被渲染。

如果`this`​是void 元素的名称（例如`br`​ ）并且`svelte:element`有子元素，则在开发模式下将引发运行时错误：

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

Svelte 尽力从元素周围推断正确的命名空间，但这并不总是可能的。您可以使用`xmlns`属性使其显式化：

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

​`this`​需要是一个有效的 DOM 元素标签， `#text`​或`svelte:head`之类的东西将不起作用。

### svelte:options

​`svelte:options`元素提供了指定每个组件编译器选项的位置，这些选项在编译器部分中有详细介绍。可能的选项有：

- ​`runes={true}`​ — 强制组件进入*runes 模式*（请参阅旧版 API部分）
- ​`runes={false}` — 强制组件进入legacy 模式
- ​`namespace="..."` — 将使用该组件的命名空间，可以是“html”（默认）、“svg”或“mathml”
- ​`customElement={...}`​ — 将此组件编译为自定义元素时使用的选项。如果传递字符串，则将其用作`tag`选项

- ​`customElement={...}`​ — 将此组件编译为自定义元素时使用的[选项](https://svelte.dev/docs/svelte/custom-elements#Component-options)。如果传递字符串，则将其用作`tag`选项
- ​`css="injected"`​ — 组件将内联注入其样式：在服务器端渲染期间，它作为`<style>`​标签注入到`head`中，在客户端渲染期间，它通过 JavaScript 加载

## Runtime

### Stores

store是一个对象，它允许通过的简单的 store contract 访问响应式值。`svelte/store`模块包含此功能最小的实现。

当引用store中的值时，通过在组件添加$开头的变量来访问store中的值。

对$前缀变量进行修改要求该变量必须是可写store，调用`.set`方法进行修改。

store必须在组件的顶层声明，不能在if 块之类中声明。

```svelte
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);
	console.log($count); // logs 0

	count.set(1);
	console.log($count); // logs 1

	$count = 2;
	console.log($count); // logs 2
</script>
```

在Svelte5之前，store 是创建跨组件响应式state或提取逻辑的首选方案。有了 runes，这些情况会大大减少。

在创建共享state时，可以创建.svelte.js 或 .svelte.ts 文件，其中包含所需值的`$state`对象，然后使用

```js
export const userState = $state({
	name: 'name',
	/* ... */
});
```

#### writable

创建可以从外部修改的值的函数。具有 `set`​ 和 `update` 方法。

```js
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
	console.log(value);
}); // logs '0'

count.set(1); // logs '1'

count.update((n) => n + 1); // logs '2'
```

如果将函数传递为第二个参数，则当订阅者数量从0变为1时，这个函数将会被调用。

```js
import { writable } from 'svelte/store';

const count = writable(0, () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});

count.set(1); // does nothing

const unsubscribe = count.subscribe((value) => {
	console.log(value);
}); // logs 'got a subscriber', then '1'

unsubscribe(); // logs 'no more subscribers'
```

注意：writable 的值会在被销毁时丢失，例如刷新页面。可以通过编写逻辑同步到 localStorage

#### readable

创建一个值，不能被外部修改，第一个参数时存储的初始值，第二个参数与writable的第二个参数相同。

```js
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);

	return () => clearInterval(interval);
});
```

#### derived

从一个或多个其他store中派生值。回调函数会在第一个订阅者订阅时允许，然后在store依赖项发生改变时运行。

在简单情况下，derived 采用单个store，并且回调返回派生值

```js
import { derived } from 'svelte/store';

const doubled = derived(a, ($a) => $a * 2);
```

回调可以通过接受第二个参数`set`​和可选的第三个参数`update`来异步设置值，并在适当时调用其中一个或两个参数。

在这种情况下，您还可以将第三个参数传递到`derived`​中 - 首先调用`set`​或`update`​之前派生商店的初始值。如果未指定初始值，则store的初始值将`undefined` 。

```js
import { derived } from 'svelte/store';

const delayed = derived(
	a,
	($a, set) => {
		setTimeout(() => set($a), 1000);
	},
	2000
);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update((x) => x + 1), 1000);
	// every time $a produces a value, this produces two
	// values, $a immediately and then $a + 1 a second later
});
```

如果您从回调返回一个函数，则当 a) 回调再次运行，或 b) 最后一个订阅者取消订阅时，将会调用该函数。

```js
import { derived } from 'svelte/store';

const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => {
			set(Date.now());
		}, 1000 / $frequency);

		return () => {
			clearInterval(interval);
		};
	},
	2000
);
```

在这两种情况下，参数数组都可以作为第一个参数传递，而不是单个存储。

```js
import { derived } from 'svelte/store';

const summed = derived([a, b], ([$a, $b]) => $a + $b);

const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

这个简单的辅助功能使商店可读。您仍然可以使用此新可读商店订阅原始的更改。

#### readonly

这个简单的辅助功能使商店可读。您仍然可以使用此新可读store订阅原始的更改。

```js
import { readonly, writable } from 'svelte/store';

const writableStore = writable(1);
const readableStore = readonly(writableStore);

readableStore.subscribe(console.log);

writableStore.set(2); // console: 2
readableStore.set(2); // ERROR
```

#### get

一般来说，应该通过订阅store并使用该值随时间的变化来读取该store的值。有时，可能需要检索您未订阅的store的值。 `get`允许您这样做。

```js
import { get } from 'svelte/store';

const value = get(store);
```

### Context

Context 允许组件访问父组件拥有的值，而无需将它们作为 props 传递下去

```js
// Parent.svelte
<script lang="ts">
	import { setContext } from 'svelte';

	setContext('my-context', 'hello from Parent.svelte');
</script>
```

```js
// Child.svelte
<script lang="ts">
	import { getContext } from 'svelte';

	const message = getContext('my-context');
</script>

<h1>{message}, inside Child.svelte</h1>
```

当子组件作为父组件children snippet时，context特别有用

除了 `setContext`​ 和 `getContext`​，svelte还提供了 `hasContext`​ 和 `getAllContexts` 函数

要检查是否已在父组件的context中设置了给定key，使用 `hasContext`

```js
<script>
	import { hasContext } from 'svelte';

	if (hasContext('key')) {
		// do something
	}
</script>
```

可以通过`getAllContext `检索属于最接近的父组件的整个Context。这很有用，例如，创建一个组件，并希望将现有context传递给他

```js
<script>
	import { getAllContexts } from 'svelte';

	const contexts = getAllContexts();
</script>
```

可以将state存储在context上

**注意**：更新这个state必须修改，而不是重新分配，这会“断开连接”

将setContext和getContext的调用封装在辅助函数中，保证类型安全

### Lifecycle hooks

在Svelte中，组件的生命周期仅由两部分构成，创建和销毁。当某些状态更新时，中间的一切都与整个组件无关。仅通知需要对状态变化做出反应的部分。这是因为在底层，最小的变化单位实际上不是组件，而是组件在组件初始化时设置的（渲染）效果。

#### onMount

onMount函数中的回调在组件挂载到DOM后立即运行。它必须在组件初始化期间调用（但不需要位于组件内部；可以从外部模块调用它）

```js
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('the component has mounted');
	});
</script>
```

如果从`onMount`返回一个函数，它将在组件卸载时被调用。

```js
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => {
			console.log('beep');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

#### onDestory

回调在组件卸载前立即运行。

```js
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
```

#### tick

使用tick确保在状态更新后等待 DOM 更新完成，它返回一个 `Promise`​，当 DOM 更新完成后，这个 `Promise`​ 会 resolve。`tick` 的主要用途是确保在状态更新后执行某些依赖于 DOM 的操作。

```js
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('the component is about to update');
		tick().then(() => {
				console.log('the component just updated');
		});
	});
</script>
```

## Misc

### Custom elements

Svelte 组件还可以使用`customElement: true`​编译器选项编译为自定义元素（也称为 Web 组件）。使用`svelte:options`元素指定组件的标记名称。

```svelte
<svelte:options customElement="my-element" />

<script>
	let { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>
<slot />
```

```js
import MyElement from './MyElement.svelte';

customElements.define('my-element', MyElement.element);
```

## 引入Vditor

```svelte
<!-- src/lib/Vditor.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  let vditor: any;

  onMount(() => {
    vditor = new Vditor('vditor', {
      minHeight: 600,
      cdn: '/vditor', // 指向static 的 vditor dist 目录
      theme: 'classic',
      upload: {
        url: 'api/upload'
      }
    });
  });

  onDestroy(() => vditor?.destroy());
</script>

<div id="vditor"></div>
```

‍
