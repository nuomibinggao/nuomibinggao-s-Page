# Rust Learning Docs

## Main Loop

This is the entry point of the code.

```
fn main () {
	// Code here
}
```

---

## Comments

Use `//` to comment a single line, and `/* Comment blocks here */` for block comments.

---

## Running Files

### Using the compiler

1. Compile the file using `rustc fileName.rs`
2. Run the compiled file using `./fileName`

_Always remember to compile the file after making changes_

### Using cargo packages

1. Create a new project using `cargo new projectName`
	The main code will be located in `projectName/src/main.rs`
2. Use `cargo run` or `cargo run fileName.rs` to run the project

_Recompiling is not needed when using this method_

To create a project using an existing folder, navigate to the folder directory, and run `cargo init` in that directory.

---

## Mutable / Immutable

By default, every variable is immutable, that means it cannot be changed by code.
To make a variable mutable, add the keyword `mut` after the `let` keyword. 
eg. `let mut dataName = data`.

---

## Primitive Data Types

Rust is a statically typed language, which means you need to define the data type of the variable that you are declaring.
Rust uses scalar data types.

### Declaring Variables

Use `let variableName: dataType = value;` to declare a variable.
When declaring outside of a function, you should use the `const` keyword instead of `let` to create a constant.

### Integers (`int`)

Signed integer types include `i8`, `i16`, `i32`, `i64`, `i128` and unsigned integer types include `u8`, `u16`, `u32`, `u64`, and `u128`.

The signed data types can hold integer numbers both negative and positive from $-2^n$ to $2^n$, but unsigned integer types can only hold positive integer values.

### Floating Point Types (`float`)

A float value can be declared by using `f32`, and `f64`.

### Boolean Values (`bool`)

Booleans only include 2 values, they are `true`, and `false`.

### Characters (`char`)

A `char` only includes a single Unicode character.

---

## Compound Data Types

### Arrays

Each element of an array has to be the same data type.

Declare an array by using `let arrayName: [dataType; elementCount] = [// Data here];` or `let arrayName = [// Data here];`.
Get a single element of an array by using indexes, eg. `arrayName[index]`.

### Tuples

A tuple can contain multiple data types (even other compound data types).

Declare a tuple by using  `let tupleName: (dataType1, dataType2) = (data1, data2);`, each element must be its corresponding data type declared before. To avoid this problem, you can also use `let tupleName = (// Data here);`

### Strings

An owned string can be declared using `let mut stringName: String = String::from("string");`, it can be expanded using code.

### Slices

Slices are often used because of its memory efficiency. A slice is a reference to an existing part of memory, you can access the slice without actually owning the data itself.

Declare a slice using `&existingDataName[index]`

However, there is a special type of slice for strings (string slices), it can be declared using `let stringName: &str = "string";` , this type of string is not mutable.

---

## Expressions & Statements

Basically, an expression is anything that returns a value, and a statement is anything that does not return a value.

This is an expression:
```
let _value:i32 = {
		let value1:i32 = 5;
		let value2:i32 = 10;
		value1 * value2
	};
```
This is a statement:
```
let x = 10;
```

---

## Functions

Functions can be called in the main loop.
You can create a function using:
```
fn functionName (param1:dataType1, param2:dataType2) {
	// Code here
}
```
The parameter(s) are optional.
It is good practice to define your functions after the main function.

You can call a function using:
```
// Define the function
fn function(param1:dataType1, param2:dataType2) -> outputDataType {
	// Code here
}

fn main () {
	function(arg1, arg2); // or let output = function(param1: arg1, param2:arg2);
}
```

Functions can also return values, eg.
```
fn add (a:i32, b:i32) -> i32 {
	a + b;
}

fn main () {
	let result:i32 = add(4, 6);
	println!("Value is {}", result);
}
```

``` Output
Value is 10
```

---


These terms are often used in memory managing

### Ownership

There are a few rules for ownership

- Each value has one and only one owner
- There can only be one owner at a time
- When the owner goes out of scope, the value is dropped

Here are some examples

``` Error
fn main () {
	let s1 = String::from("Rust");
	let s2 = s1;
	println!("{}", s1)
}
```
This violates the 2nd rule as `let s2 = s1` transfers the ownership of the string from `s1` to `s2`. The correct way should be to print `s2` instead of `s1`: `println!("{}", s2)`.

``` Error
fn main () {
	 let s1 = String::from("Rust");
	 let len = calculate_length(&s1);
	 println!("Length of '{}' is {}.", s1, len);
}

fn print(s: &string) {
	println!("{}", &s1)
}

fn calculate_length(s: &String) -> usize {
	s.len()
}
```
This violates the 3rd rule as `println!("{}", &s1)` calls a value that is out of scope (`main`). The correct way is:
```
fn print(s: &String) {
	println!("{}", s)
}
```

### Borrowing & References

Since each value has only one owner, borrowing and references allows you to use a value without taking ownership.
References can be both mutable and immutable.

To reference a value, simple add a `&` before the value's name.
eg.
```
fn main () {
	let _x:i32 = 5;
	let _ref:i32 = &_x;
	
	println!("value of x is {}", _x)
	println!("value of ref is {}", _ref)
}
```
Both values should be the same.

To make a reference mutable, add the keyword `mut` after the `&`, the owner also has to be mutable.
eg.
```
fn main () {
	let mut _x:i32 = 5;
	let _ref:&mut i32 = &mut _x;
	
	*_ref += 1;
	
	println!("value of x is {}", _x)
}
```
This should output `value of x is 6`

You can only borrow one mutable instance of a value, but multiple immutable references.

eg.
```
fn main () {
	let mut account = BankAccount {
		owner: "Alice".to_string(),
		balance:150.55,
	};
	// Immutable borrow to check balance
	account.check_balance();
	
	// Mutable borrow to withdraw money
	account.withdraw(45.5);
	
	// Check again after withdrawal
	account.check_balance();
}

struct BankAccount {
	owner: String,
	balance: f64,
}

impl BankAccount {
	fn withdraw(&mut self, amount: f64) {
		println!("Withdrawing {} from account owned by {}", amount, self.owner);
		self.balance -= amount;
	}
	
	fn check_balance(&self) {
		println!("Account owned by {} has a balance of {}", self.owner, self.balance)
	}
}
```

---

## Variable Mutability

All variables are immutable by default.

eg.
``` Error
fn main () {
	println!("Hello, world!");
	let a:i32 = 5;
	println!("The value of a is {}", a);
	a = 10;
	println!("The new value of a is {}", a);
}
```
Since `a` is a immutable variable by default when declared, so assigning a new value to the `a` variable like  `a = 10;` does not work. To avoid this, add the keyword `mut`, like `let mut a:i32 = 5;`.

---

## Constants

Constants are basically values that are bound to its name and not changeable, thus you cannot use the keyword `mut` on constants.

Declare a constant by using the keyword `const`.

It is common practice to name constants in all caps, eg. `const CONSTNAME:dataType = value;`.

---

## Shadowing

You can declare a variable with the same name as a previous variable, this way the first variable is "shadowed" by the second. The compiler will take the second variable's value when the name is called. It is not the same as marking a variable as mutable.

eg.
```
fn main () {
	let x = 5; // Result is 5
	
	let x = x + 1; // Result is 6
	
	{
		let x = x * 2; // Result is 12
		println!("The value of x in the inner scope is: {x}");
	}
	
	println!("The value of x is: {x}")
}
```

---

## Control Flow

### If - Else Conditions

This is the structure of if - else conditions:
```
fn main () {
	if condition2 = true {
		// Do something when true
	} else if condition2 = true {
		// Do something when true
	} else {
		// Do something
	}
}
```

You can use if statements in `let` statements, eg.
```
fn main () {
	let condition = true;
	let number = if condition {5} else {6};
	println!("Number: {}", number);
}
```
This should output `Number: 5`, the output of the conditions should be the same data type.

### Loop Conditions

#### Unconditional Loop (`loop`)

This type of loop will run forever until broken out.

```
fn main () {
	loop {
		// Code here
	}
}
```

Use the expression `break` to break out of a loop.
eg.
```
fn main () {
	 let mut counter = 0;
	 
	 let result = loop {
		 counter += 1;
		 
		 if counter == 10 {
			 break counter * 2;
		 }
	 };
	 
	 println!("The result is {result}");
}
```

``` Output
The result is 20
```

You can also use loop labels, this is useful when using loops within loops. The `break` expression breaks out of the most inner loop by default, with labels, you can break out of other loops.
eg.
```
fn main () {
	let mut count = 0;
	'counting_up: loop {
		println!("count = {count}");
		let mut remaining = 10;
		
		loop {
			println!("remaining = {remaining}");
			if remaining == 9 {
				break;
			}
			if count == 2 {
				break 'counting_up;
			}
			remaining -= 1;
		}
		count += 1;
	}
}
```

``` Output
count = 0
remaining = 10
remaining = 9
count = 1
remaining = 10
remaining = 9
count = 2
remaining = 10
```
#### While Loop (`while`)

This code will continue to run as long the statement after the `while` keyword is `true`.

eg.
```
fn main () {
	let mut number = 3;
	while number != 0 {
		println!("{number}");
		number -= 1;
	}
	println!("Hi!")
}
```

``` Output
3
2
1
Hi!
```

#### For Loop (`for`)

This is usually for looping through a collection.

eg.
```
fn main () {
	let a = [1,2,3,4,5,6];
	for element in a {
		println!("{element}")
	}
}
```

``` Output
1
2
3
4
5
6
```

---

### Structs

A struct is a data structure similar to tuples that allows you to group multiple fields together under one name. Every element is named separately, allowing for precise control.

eg.
```
fn main () {
	struct Book {
		title: String,
		author: String,
		pages: u32,
		available: bool,
	}
	
	struct User {
		active: bool,
		username: String,
		email: String,
		sign_in_count: u64,
	}
	
	let mut user1 = User {
		active: true,
		username: String::from("username"),
		email: String::from("username@email.com"),
		sign_in_count: 1,
	};
	
	// user1.email = String::from("anotheremail@example.com");
	println!("User email is {}", user1.email);
	
	// You can also return a struct from a function
	fn build_user(email:String, username:String) -> User {
		User {
			active: true,
			email,
			username,
			sign_in_count:1,
		}
	}
	
	// You can also create instances
	let user2 = User {
		email: String::from("another@example.com"),
		..user1 // Other data stays the same
	}
}
```

A special type of struct is a tuple struct, they do not contain names.
eg.
```
struct Color(i32, i32, i32);

let black = Color(0, 0, 0);
let white = Color(255, 255, 255);
```

There are also unit-like structs, they do not have any fields.
eg.
```
struct AlwaysEqual;
let subject = AlwaysEqual;
```

---

## Enums

An `enum` is a versatile tool used to represent a type that can take on one of several possible variants.

eg.
```
fn main () {
	enum IpAddrKind {
		V4,
		V6
	}
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;

// You can use enums in functions
fn route(ip_kind: IpAddrKind) {}

route(IpAddrKind::V4);
route(IpAddrKind::V6);

}
```

---



Last Updated: 2025.10.15

This document is not complete, it will update as I learn more [Rust](https://rust-lang.org).

Edited using the [Obsidian](https://obsidian.md) software.