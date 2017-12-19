#  
function wasmx(){
  file=$1 || "a.out.wasm"
  node --expose-wasm --harmony --no-warnings -i -e "
  wasm = async (_wasm, imports = {}) => {
		if (!Object.keys(imports).length) imports = {
			console: {log: (x) => console.log(x)},
			};
		_wasm = fs.readFileSync(_wasm);
		module = await WebAssembly.compile(_wasm);
		instance = await WebAssembly.instantiate(module, imports);
		if (instance.exports.main)
			console.log(instance.exports.main());
		return '';
	};
	log = x => console.log(x);
  (function(){ async function _wrap() { return await wasm('$file')};_wrap().then(y=>{log(y);process.exit()}).catch(x=>{log(x);throw x})})()"
}
./bin/tc test.ts && wasmx out.wasm