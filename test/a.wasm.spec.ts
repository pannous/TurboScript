import * as path from "path";
import {getWasmInstance} from "./utils/utils";

test('it should add two numbers', async () => {
    const instance:WebAssembly.Instance = await getWasmInstance(path.join(__dirname, 'a.tbs'));
    expect(instance.exports.addTwo(1, 2)).toBe(3);
    expect(instance.exports.addTwo(11, 20)).toBe(31);
});
