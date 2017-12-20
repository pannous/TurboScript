./bin/tc test.ts  # compiles to out.wasm
file="out.wasm"
node --expose-wasm --harmony --no-warnings -i -e " // ugly inline js helper :
wasm = async (file) => {
	imports = {
			console: {log: (x) => console.log(x)} 
	};
	_wasm = fs.readFileSync(file);
	module = await WebAssembly.compile(_wasm);
	instance = await WebAssembly.instantiate(module, imports);
	if (instance.exports.main)
		console.log(instance.exports.main());
	return '';
};
log = x => console.log(x);
wasm('$file').then(y=>{log(y); process.exit() }).catch( x=>{log(x); process.exit();throw x})"
