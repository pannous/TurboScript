#!./test.sh
def fib(n: int): int {
    if (n <= 1) return 1
    fib(n - 1) + fib(n - 2)
}

def assert(test: bool){
	// if(!test)raise "";
	// if(!test)throw "";
}

def todo(test: bool){
	// print(caller.arguments.toString())
}

def testLogic(){
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

def main():int{
  var y="HI"
  testLogic()
  // var z:any="HI"
  // if(y)console.log(y)
  // return 
  fib(30)
}
