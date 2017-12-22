#!./test.sh
import {Math} from "javascript";
import {console} from "javascript";
// import {log} from "util";
// import {XXX} from "javascript";


function fib(n: int): int {
    if n <= 1 return 1
    else fib(n - 1) + fib(n - 2)
}
// class Data extends int{}
class Data{
	private i: int;
	constructor(i:int){
		this.i=i;
	}
}

function testArray(num: int32): Array<Data> {
	// log.printI32(num);
	let a = new Array<Data>(num);
	// let a = new Array<int>(num);
	// log.printI32(sizeof(Data));
	// log.printI32(a as int32);
	// console.log(a as int32);
	let i: int32 = 0;
	while (i < num) {
		let d:Data = new Data(i);// as Data
		// log.printI32(d as int32);
		// d.set(0.5, 0.5, 0.5);
		a[i] = d
		i = i + 1;
		// log.printI32(i);
	}
	return a;
}

function main():int{
  var s="HI"
  let d=0x3543
// let numbers = [1, 2, 3];
  var x:string="ho"
  // var c:char='h';
  // var k:string=`ok ${super} good`

	let ok=testArray(10);

	let count = 0;
	for let i = 0,k=10; i < 10; i++, k=k+10 do
		count++;
	end

	// for(d in numbers)
     //    testLogic()

	// for x in [1..3] do
  // end
  // var z:any="HI"
  // if(y)console.log(y)
  // return
  fib(21)+test()+count
}

/*

OK
*/

function test():int{
	// if(1)42
	// else 0
	if(1)return 42
}

function assert(test: bool){
	// if(!test)raise "";
	// if(!test)throw "";
}

function todo(test: bool){
	// print(caller.arguments.toString())
}
function testLogic(){
	// assert not false is true
		assert(not false == true)
		assert(not false is true)
		assert(true and true == true)
		assert(true and true is true)
		assert(true and true is 1)
		assert(true and true and 1 is 1)
		assert(true and true and 1 is 1)
		todo(true and true and 12)// BUG BINARY!
		todo(true and true and 15)// 1 not 15
}


