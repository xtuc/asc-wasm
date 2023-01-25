# asc-wasm

> WebAssembly generation in AssemblyScript

The implementation has been carefully written to avoid any runtime support and
allocations. All functions are inlined to make linking easier.

## Usage

```bash
yarn add asc-wasm
```

```js
import * as wasm from 'asc-wasm/assembly'

let ptr: u32 = 1234;

ptr += wasm.write_magic(ptr);
ptr += wasm.write_version(ptr);
...
```

## APIs

All function return how many bytes they wrote.

- `write_section_header(ptr: u32, id: u8, size: u32): u32`

Write a section header at `ptr`.

- `write_leb128_u32(ptr: u32, value: u32): u32`

Write `value` as unsigned [LEB128] at `ptr`.

- `write_signed_leb128_u32(ptr: u32, value: u32): u32`

Write `value` as signed [LEB128] at `ptr` but `value` is unsigned.

- `leb128_u32_byte_size(value: u32): u32`

Calculate the encoded size of `value` as unsigned [LEB128].

- `write_vec5<T>(ptr: u32, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): u32`

Write a Vec of constant length at `ptr`.

- `write_magic(ptr: u32): u32`

Write WebAssembly magic number at `ptr`.

- `write_version(ptr: u32): u32`

Write WebAssembly version at `ptr`.

- `write_i32_const(ptr: u32, value: u32): u32`

Write a i32.const instruction with `value` as immediate at `ptr`.

- `write_end(ptr: u32): u32`

Write the end instruction at `ptr`.

[LEB128]: https://en.wikipedia.org/wiki/LEB128
