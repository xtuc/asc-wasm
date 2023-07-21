@inline
function write_u32(ptr: u32, v: u32): u32 {
  store<u32>(ptr, v, 0, 4)
  return 4;
}

@inline
function write_u8(ptr: u32, v: u8): u32 {
  store<u8>(ptr, v)
  return 1;
}

@inline
export function write_section_header(ptr: u32, id: u8, size: u32): u32 {
  let wrote: u32 = 0;
  wrote += write_u8(ptr, id);
  wrote += write_leb128_u32(ptr + wrote, size);

  return wrote;
}

@inline
export function write_leb128_u32(ptr: u32, v: u32): u32 {
  let wrote: u32 = 0;
  while (v >= 0x80) {
    wrote += write_u8(ptr + wrote, ((v & 0x7f) | 0x80) as u8);
    v >>= 7;
  }

  wrote += write_u8(ptr + wrote, (v & 0x7f) as u8);
  return wrote;
}

@inline
export function write_signed_leb128_u32(ptr: u32, value: u32): u32 {
  let more = true;
  let b: u32 = 0;
  let wrote: u32 = 0;

  while (more) {
    // get 7 least significant bits
    b = value & 127;
    // left shift value 7 bits
    value = value >> 7;

    // sign bit of byte is second high order bit
    if ((value == 0 && ((b & 0x40) == 0)) || ((value == -1 && ((b & 0x40) == 0x40)))) {
      // calculation is complete
      more = false;
    }
    else {
      b = b | 128;
    }

    wrote += write_u8(ptr + wrote, b as u8);
  }

  return wrote;
}

@inline
export function leb128_u32_byte_size(v: u32): u32 {
  let wrote: u32 = 0;
  while (v >= 0x80) {
    wrote += 1
    v >>= 7;
  }
  wrote += 1
  return wrote;
}

// Write a Vec of a given size to `ptr`. Arguments are used instead of an array
// because the array requires runtime support for allocations.
@inline
export function write_vec9(
    ptr: u32, arg1: u8, arg2: u8, arg3: u8, arg4: u8,
    arg5: u8, arg6: u8, arg7: u8, arg8: u8, arg9: u8): u32 {
  let wrote: u32 = 0;
  wrote += write_leb128_u32(ptr, 9);

  wrote += write_u8(ptr + wrote, arg1);
  wrote += write_u8(ptr + wrote, arg2);
  wrote += write_u8(ptr + wrote, arg3);
  wrote += write_u8(ptr + wrote, arg4);
  wrote += write_u8(ptr + wrote, arg5);
  wrote += write_u8(ptr + wrote, arg6);
  wrote += write_u8(ptr + wrote, arg7);
  wrote += write_u8(ptr + wrote, arg8);
  wrote += write_u8(ptr + wrote, arg9);
  return wrote
}

// Write a Vec of a given size to `ptr`. Arguments are used instead of an array
// because the array requires runtime support for allocations.
@inline
export function write_vec4(ptr: u32, arg1: u8, arg2: u8, arg3: u8, arg4: u8): u32 {
  let wrote: u32 = 0;
  wrote += write_leb128_u32(ptr, 4);

  wrote += write_u8(ptr + wrote, arg1);
  wrote += write_u8(ptr + wrote, arg2);
  wrote += write_u8(ptr + wrote, arg3);
  wrote += write_u8(ptr + wrote, arg4);
  return wrote
}

@inline
export function write_magic(ptr: u32): u32 {
  return write_u32(ptr, 0x6d736100); // \0asm
}

@inline
export function write_version(ptr: u32): u32 {
  return write_u32(ptr, 0x1);
}

@inline
export function write_i32_const(ptr: u32, value: u32): u32 {
  let wrote: u32 = 0;
  wrote += write_u8(ptr, 0x41);
  wrote += write_signed_leb128_u32(ptr + wrote, value)
  return wrote;
}

@inline
export function write_end(ptr: u32): u32 {
  return write_u8(ptr, 0x0b);
}

@inline
export function write_memory_with_max(ptr: u32, min: u32, max: u32): u32 {
  let wrote: u32 = 0;
  wrote += write_u8(ptr, 1);
  wrote += write_leb128_u32(ptr + wrote, min);
  wrote += write_leb128_u32(ptr + wrote, max);
  return wrote;
}

@inline
export function write_const_i32_global(ptr: u32, value: i32): u32 {
  let wrote: u32 = 0;
  wrote += write_u8(ptr + wrote, 0x7f); // i32
  wrote += write_u8(ptr + wrote, 0x0); // const
  wrote += write_i32_const(ptr + wrote, value);
  wrote += write_end(ptr + wrote);
  return wrote;
}

