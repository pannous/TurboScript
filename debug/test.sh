#!/bin/bash
in=${1:-"/opt/TurboScript/test.nai"}
echo GOT $in
cd test
/opt/TurboScript/bin/tc $in --run
#../bin/tc # compiles to out.wasm
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
# rm out*
