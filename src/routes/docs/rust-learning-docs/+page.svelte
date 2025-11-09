<script lang="ts">
	import { onMount } from 'svelte';

	let splashText = 'Loading...';
	let splashTexts: string[] = [];

	onMount(async () => {
		try {
			const response = await fetch('/splash.json');
			splashTexts = await response.json();
			updateSplashText();
		} catch (error) {
			console.error('Error loading splash texts:', error);
			splashText = 'Crafted with care';
		}
	});

	function updateSplashText() {
		const randomIndex = Math.floor(Math.random() * splashTexts.length);
		splashText = splashTexts[randomIndex];
	}

	function handleSplashClick() {
		updateSplashText();
	}

	let isHeaderScrolled = false;

	function handleScroll() {
		isHeaderScrolled = window.scrollY > 100;
	}
</script>

<svelte:window on:scroll={handleScroll} />

<div class="container" class:with-fixed-header={isHeaderScrolled}>
	<header class:scrolled={isHeaderScrolled}>
		<div class="header-content">
			<h1>Melty Pages</h1>
			<p class="subtitle">Rust Learning Docs</p>
			<nav class="nav">
				<a href="/md-docs/rust-learning-docs/rust-learning-docs.md" download>
					<img src="/icons/download.svg" alt="Download" class="icon icon-inline">Download Document
				</a>
				<a href="/docshub">
					<img src="/icons/article_person.svg" alt="Article" class="icon icon-inline">Read Other Docs
				</a>
				<a href="/projecthub">
					<img src="/icons/arrow_back_ios_new.svg" alt="Arrow back" class="icon icon-inline">Back to Hub
				</a>
				<a href="/">
					<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
				</a>
			</nav>
		</div>
	</header>

	<div class="intro">
		<h2><img src="/icons/article_person.svg" alt="Article" class="icon icon-large">Rust Learning Docs</h2>
		<p>This is the notes I took for learning Rust. This article will update as I learn more.</p>
		<p>This is a Markdown file formatted to use HTML to display, you can download the original Markdown file.</p>
		<div style="margin-top: 1rem;">
			<a href="/md-docs/rust-learning-docs/rust-learning-docs.md" download class="link-button">
				<img src="/icons/download.svg" alt="Download" class="icon icon-inline">Download Document
			</a>
			<a href="/docshub" class="link-button">
				<img src="/icons/article_person.svg" alt="Article" class="icon icon-inline">Read Other Docs
			</a>
			<a href="/projecthub" class="link-button">
				<img src="/icons/arrow_back_ios_new.svg" alt="Arrow back" class="icon icon-inline">Back to Hub
			</a>
			<a href="/" class="link-button">
				<img src="/icons/home.svg" alt="Home" class="icon icon-inline">Back to Main Page
			</a>
		</div>
	</div>

	<section class="doc-section">
		<h2>Main Loop</h2>
		<p>This is the entry point of the code.</p>
    <pre><code>fn main() &#123;
	// Code here
&#125;</code></pre>
	</section>

	<section class="doc-section">
		<h2>Comments</h2>
		<p>Use <code>//</code> to comment a single line, and <code>/* Comment blocks here */</code> for block comments.</p>
	</section>

	<section class="doc-section">
		<h2>Running Files</h2>
		
		<h3>Using the compiler</h3>
		<ol>
			<li>Compile the file using <code>rustc fileName.rs</code></li>
			<li>Run the compiled file using <code>./fileName</code></li>
		</ol>
		<p class="note-text"><em>Always remember to compile the file after making changes</em></p>

		<h3>Using cargo packages</h3>
		<ol>
			<li>Create a new project using <code>cargo new projectName</code><br>
			The main code will be located in <code>projectName/src/main.rs</code></li>
			<li>Use <code>cargo run</code> or <code>cargo run fileName.rs</code> to run the project</li>
		</ol>
		<p class="note-text"><em>Recompiling is not needed when using this method</em></p>
		<p>To create a project using an existing folder, navigate to the folder directory, and run <code>cargo init</code> in that directory.</p>
	</section>

	<section class="doc-section">
		<h2>Mutable / Immutable</h2>
		<p>By default, every variable is immutable, that means it cannot be changed by code. To make a variable mutable, add the keyword <code>mut</code> after the <code>let</code> keyword.</p>
		<p>e.g. <code>let mut dataName = data</code>.</p>
	</section>

	<section class="doc-section">
		<h2>Primitive Data Types</h2>
		<p>Rust is a statically typed language, which means you need to define the data type of the variable that you are declaring. Rust uses scalar data types.</p>

		<h3>Declaring Variables</h3>
		<p>Use <code>let variableName: dataType = value;</code> to declare a variable. When declaring outside of a function, you should use the <code>const</code> keyword instead of <code>let</code> to create a constant.</p>

		<h3>Integers (<code>int</code>)</h3>
		<p>Signed integer types include <code>i8</code>, <code>i16</code>, <code>i32</code>, <code>i64</code>, <code>i128</code> and unsigned integer types include <code>u8</code>, <code>u16</code>, <code>u32</code>, <code>u64</code>, and <code>u128</code>.</p>
		<p>The signed data types can hold integer numbers both negative and positive from -2ⁿ to 2ⁿ, but unsigned integer types can only hold positive integer values.</p>

		<h3>Floating Point Types (<code>float</code>)</h3>
		<p>A float value can be declared by using <code>f32</code>, and <code>f64</code>.</p>

		<h3>Boolean Values (<code>bool</code>)</h3>
		<p>Booleans only include 2 values, they are <code>true</code>, and <code>false</code>.</p>

		<h3>Characters (<code>char</code>)</h3>
		<p>A <code>char</code> only includes a single Unicode character.</p>
	</section>

	<section class="doc-section">
		<h2>Compound Data Types</h2>

		<h3>Arrays</h3>
		<p>Each element of an array has to be the same data type.</p>
		<p>Declare an array by using <code>let arrayName: [dataType; elementCount] = [// Data here];</code> or <code>let arrayName = [// Data here];</code>. Get a single element of an array by using indexes, e.g. <code>arrayName[index]</code>.</p>

		<h3>Tuples</h3>
		<p>A tuple can contain multiple data types (even other compound data types).</p>
		<p>Declare a tuple by using <code>let tupleName: (dataType1, dataType2) = (data1, data2);</code>, each element must be its corresponding data type declared before. To avoid this problem, you can also use <code>let tupleName = (// Data here);</code></p>

		<h3>Strings</h3>
		<p>An owned string can be declared using <code>let mut stringName: String = String::from("string");</code>, it can be expanded using code.</p>

		<h3>Slices</h3>
		<p>Slices are often used because of its memory efficiency. A slice is a reference to an existing part of memory, you can access the slice without actually owning the data itself.</p>
		<p>Declare a slice using <code>&existingDataName[index]</code></p>
		<p>However, there is a special type of slice for strings (string slices), it can be declared using <code>let stringName: &str = "string";</code>, this type of string is not mutable.</p>
	</section>

	<section class="doc-section">
		<h2>Expressions & Statements</h2>
		<p>Basically, an expression is anything that returns a value, and a statement is anything that does not return a value.</p>
		
		<p><strong>This is an expression:</strong></p>
		<pre><code>let _value:i32 = &#123;
	let value1:i32 = 5;
	let value2:i32 = 10;
	value1 * value2
&#125;;</code></pre>

		<p><strong>This is a statement:</strong></p>
		<pre><code>let x = 10;</code></pre>
	</section>

	<section class="doc-section">
		<h2>Functions</h2>
		<p>Functions can be called in the main loop. You can create a function using:</p>
    <pre><code>fn functionName (param1:dataType1, param2:dataType2) &#123;
	// Code here
&#125;</code></pre>
		<p>The parameter(s) are optional. It is good practice to define your functions after the main function.</p>
		
		<p>You can call a function using:</p>
		<pre><code>// Define the function
fn function(param1:dataType1, param2:dataType2) -> outputDataType &#123;
    // Code here
&#125;

fn main () &#123;
    function(arg1, arg2); // or let output = function(param1: arg1, param2:arg2);
&#125;</code></pre>

		<p>Functions can also return values, e.g.</p>
		<pre><code>fn add (a:i32, b:i32) -> i32 &#123;
	a + b; // Add the semicolon
&#125;

fn main () &#123;
	let result:i32 = add(4, 6);
	println!("Value is &#123;&#125;", result);
&#125;</code></pre>
		<div class="output-box">
			<strong>Output</strong>
			<pre>Value is 10</pre>
		</div>
	</section>

	<section class="doc-section">
		<h2>Memory Management</h2>
		<p>These terms are often used in memory managing</p>

		<h3>Ownership</h3>
		<p>There are a few rules for ownership:</p>
		<ul>
			<li>Each value has one and only one owner</li>
			<li>There can only be one owner at a time</li>
			<li>When the owner goes out of scope, the value is dropped</li>
		</ul>

		<p><strong>Here are some examples</strong></p>
		<div class="error-box">
			<strong>Error</strong>
			<pre><code>fn main () &#123;
    let s1 = String::from("Rust");
    let s2 = s1;
    println!("&#123;&#125;", s1)
&#125;</code></pre>
		</div>
		<p>This violates the 2nd rule as <code>let s2 = s1</code> transfers the ownership of the string from <code>s1</code> to <code>s2</code>. The correct way should be to print <code>s2</code> instead of <code>s1</code>: <code>println!("&#123;&#125;", s2)</code>.</p>

		<div class="error-box">
			<strong>Error</strong>
			<pre><code>fn main () &#123;
    let s1 = String::from("Rust");
    let len = calculate_length(&s1);
    println!("Length of '&#123;&#125;' is &#123;&#125;.", s1, len);
&#125;

fn print(s: &string) &#123;
    println!("&#123;&#125;", &s1)
&#125;

fn calculate_length(s: &String) -> usize &#123;
    s.len()
&#125;</code></pre>
		</div>
		<p>This violates the 3rd rule as <code>println!("&#123;&#125;", &s1)</code> calls a value that is out of scope (<code>main</code>). The correct way is:</p>
		<pre><code>fn print(s: &String) &#123;
    println!("&#123;&#125;", s)
&#125;</code></pre>

		<h3>Borrowing & References</h3>
		<p>Since each value has only one owner, borrowing and references allows you to use a value without taking ownership. References can be both mutable and immutable.</p>
		<p>To reference a value, simple add a <code>&</code> before the value's name. e.g.</p>
		<pre><code>fn main () &#123;
    let _x:i32 = 5;
    let _ref:i32 = &_x;
    
    println!("value of x is &#123;&#125;", _x)
    println!("value of ref is &#123;&#125;", _ref)
&#125;</code></pre>
		<p>Both values should be the same.</p>

		<p>To make a reference mutable, add the keyword <code>mut</code> after the <code>&</code>, the owner also has to be mutable. e.g.</p>
		<pre><code>fn main () &#123;
    let mut _x:i32 = 5;
    let _ref:&mut i32 = &mut _x;
    
    *_ref += 1;
    
    println!("value of x is &#123;&#125;", _x)
&#125;</code></pre>
		<p>This should output <code>value of x is 6</code></p>

		<p>You can only borrow one mutable instance of a value, but multiple immutable references. e.g.</p>
		<pre><code>fn main () &#123;
    let mut account = BankAccount &#123;
        owner: "Alice".to_string(),
        balance:150.55,
    &#125;;
    // Immutable borrow to check balance
    account.check_balance();
    
    // Mutable borrow to withdraw money
    account.withdraw(45.5);
    
    // Check again after withdrawal
    account.check_balance();
&#125;

struct BankAccount &#123;
    owner: String,
    balance: f64,
&#125;

impl BankAccount &#123;
    fn withdraw(&mut self, amount: f64) &#123;
        println!("Withdrawing &#123;&#125; from account owned by &#123;&#125;", amount, self.owner);
        self.balance -= amount;
    &#125;
    
    fn check_balance(&self) &#123;
        println!("Account owned by &#123;&#125; has a balance of &#123;&#125;", self.owner, self.balance)
    &#125;
&#125;</code></pre>
	</section>

	<section class="doc-section">
		<h2>Variable Mutability</h2>
		<p>All variables are immutable by default. e.g.</p>
		<div class="error-box">
			<strong>Error</strong>
			<pre><code>fn main () &#123;
    println!("Hello, world!");
    let a:i32 = 5;
    println!("The value of a is &#123;&#125;", a);
    a = 10;
    println!("The new value of a is &#123;&#125;", a);
&#125;</code></pre>
		</div>
		<p>Since <code>a</code> is a immutable variable by default when declared, so assigning a new value to the <code>a</code> variable like <code>a = 10;</code> does not work. To avoid this, add the keyword <code>mut</code>, like <code>let mut a:i32 = 5;</code>.</p>
	</section>

	<section class="doc-section">
		<h2>Constants</h2>
		<p>Constants are basically values that are bound to its name and not changeable, thus you cannot use the keyword <code>mut</code> on constants.</p>
		<p>Declare a constant by using the keyword <code>const</code>.</p>
		<p>It is common practice to name constants in all caps, e.g. <code>const CONSTNAME:dataType = value;</code>.</p>
	</section>

	<section class="doc-section">
		<h2>Shadowing</h2>
		<p>You can declare a variable with the same name as a previous variable, this way the first variable is "shadowed" by the second. The compiler will take the second variable's value when the name is called. It is not the same as marking a variable as mutable. e.g.</p>
		<pre><code>fn main () &#123;
    let x = 5; // Result is 5
    
    let x = x + 1; // Result is 6
    
    &#123;
        let x = x * 2; // Result is 12
        println!("The value of x in the inner scope is: &#123;x&#125;");
    &#125;
    
    println!("The value of x is: &#123;x&#125;")
&#125;</code></pre>
	</section>

	<section class="doc-section">
		<h2>Control Flow</h2>

		<h3>If - Else Conditions</h3>
		<p>This is the structure of if - else conditions:</p>
		<pre><code>fn main () &#123;
    if condition2 = true &#123;
        // Do something when true
    &#125; else if condition2 = true &#123;
        // Do something when true
    &#125; else &#123;
        // Do something
    &#125;
&#125;</code></pre>

		<p>You can use if statements in <code>let</code> statements, e.g.</p>
		<pre><code>fn main () &#123;
    let condition = true;
    let number = if condition &#123;5&#125; else &#123;6&#125;;
    println!("Number: &#123;&#125;", number);
&#125;</code></pre>
		<p>This should output <code>Number: 5</code>, the output of the conditions should be the same data type.</p>

		<h3>Loop Conditions</h3>

		<h4>Unconditional Loop (<code>loop</code>)</h4>
		<p>This type of loop will run forever until broken out.</p>
		<pre><code>fn main () &#123;
    loop &#123;
        // Code here
    &#125;
&#125;</code></pre>

		<p>Use the expression <code>break</code> to break out of a loop. e.g.</p>
		<pre><code>fn main () &#123;
    let mut counter = 0;
    
    let result = loop &#123;
        counter += 1;
        
        if counter == 10 &#123;
            break counter * 2;
        &#125;
    &#125;;
    
    println!("The result is &#123;result&#125;");
&#125;</code></pre>
		<div class="output-box">
			<strong>Output</strong>
			<pre>The result is 20</pre>
		</div>

		<p>You can also use loop labels, this is useful when using loops within loops. The <code>break</code> expression breaks out of the most inner loop by default, with labels, you can break out of other loops. e.g.</p>
		<pre><code>fn main () &#123;
    let mut count = 0;
    'counting_up: loop &#123;
        println!("count = &#123;count&#125;");
        let mut remaining = 10;
        
        loop &#123;
            println!("remaining = &#123;remaining&#125;");
            if remaining == 9 &#123;
                break;
            &#125;
            if count == 2 &#123;
                break 'counting_up;
            &#125;
            remaining -= 1;
        &#125;
        count += 1;
    &#125;
&#125;</code></pre>
		<div class="output-box">
			<strong>Output</strong>
			<pre>count = 0
remaining = 10
remaining = 9
count = 1
remaining = 10
remaining = 9
count = 2
remaining = 10</pre>
		</div>

		<h4>While Loop (<code>while</code>)</h4>
		<p>This code will continue to run as long the statement after the <code>while</code> keyword is <code>true</code>. e.g.</p>
		<pre><code>fn main () &#123;
    let mut number = 3;
    while number != 0 &#123;
        println!("&#123;number&#125;");
        number -= 1;
    &#125;
    println!("Hi!")
&#125;</code></pre>
		<div class="output-box">
			<strong>Output</strong>
			<pre>3
2
1
Hi!</pre>
		</div>

		<h4>For Loop (<code>for</code>)</h4>
		<p>This is usually for looping through a collection. e.g.</p>
		<pre><code>fn main () &#123;
    let a = [1,2,3,4,5,6];
    for element in a &#123;
        println!("&#123;element&#125;")
    &#125;
&#125;</code></pre>
		<div class="output-box">
			<strong>Output</strong>
			<pre>1
2
3
4
5
6</pre>
		</div>
	</section>

	<section class="doc-section">
		<h2>Structs</h2>
		<p>A struct is a data structure similar to tuples that allows you to group multiple fields together under one name. Every element is named separately, allowing for precise control. e.g.</p>
		<pre><code>fn main () &#123;
    struct Book &#123;
        title: String,
        author: String,
        pages: u32,
        available: bool,
    &#125;
    
    struct User &#123;
        active: bool,
        username: String,
        email: String,
        sign_in_count: u64,
    &#125;
    
    let mut user1 = User &#123;
        active: true,
        username: String::from("username"),
        email: String::from("username@email.com"),
        sign_in_count: 1,
    &#125;;
    
    // user1.email = String::from("anotheremail@example.com");
    println!("User email is &#123;&#125;", user1.email);
    
    // You can also return a struct from a function
    fn build_user(email:String, username:String) -> User &#123;
        User &#123;
            active: true,
            email,
            username,
            sign_in_count:1,
        &#125;
    &#125;
    
    // You can also create instances
    let user2 = User &#123;
        email: String::from("another@example.com"),
        ..user1 // Other data stays the same
    &#125;
&#125;</code></pre>

		<p>A special type of struct is a tuple struct, they do not contain names. e.g.</p>
		<pre><code>struct Color(i32, i32, i32);

let black = Color(0, 0, 0);
let white = Color(255, 255, 255);</code></pre>

		<p>There are also unit-like structs, they do not have any fields. e.g.</p>
		<pre><code>struct AlwaysEqual;
let subject = AlwaysEqual;</code></pre>
	</section>

	<section class="doc-section">
		<h2>Enums</h2>
		<p>An <code>enum</code> is a versatile tool used to represent a type that can take on one of several possible variants. e.g.</p>
		<pre><code>fn main () &#123;
    enum IpAddrKind &#123;
        V4,
        V6
    &#125;
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    // You can use enums in functions
    fn route(ip_kind: IpAddrKind) &#123;&#125;

    route(IpAddrKind::V4);
    route(IpAddrKind::V6);
&#125;</code></pre>
	</section>

	<section class="doc-footer">
		<p><strong>Last Updated:</strong> 2025.10.15</p>
		<p>This document is not complete, it will update as I learn more <a href="https://rust-lang.org" target="_blank" rel="noopener">Rust</a>.</p>
		<p>Edited using the <a href="https://obsidian.md" target="_blank" rel="noopener">Obsidian</a> software.</p>
	</section>

	<footer>
		© 2025 nuomibinggao • MIT License
		<div
			class="footer-note"
			role="button"
			tabindex="0"
			on:click={handleSplashClick}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleSplashClick();
					e.preventDefault();
				}
			}}
		>{splashText}</div>
	</footer>
</div>

<style>
	/* The CSS is already loaded in style-v2.css */
</style>