@inline
function write_u32(ptr: u32, v: u32): u32 {
  store<u32>(ptr, v);
  return 4;
}

@inline
function write_u8(ptr: u32, v: u8): u32 {
  store<u8>(ptr, v);
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
  return 8 - (clz(v) + 31) / 8;
}

// Write a Vec of a given size to `ptr`. Arguments are used instead of an array
// because the array requires runtime support for allocations.
@inline
export function write_vec5<T>(ptr: u32, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): u32 {
  let wrote: u32 = write_leb128_u32(ptr, 5);

  switch (sizeof<T>()) {
    case 1: {
      wrote += write_u8(ptr + wrote, arg1);
      wrote += write_u8(ptr + wrote, arg2);
      wrote += write_u8(ptr + wrote, arg3);
      wrote += write_u8(ptr + wrote, arg4);
      wrote += write_u8(ptr + wrote, arg5);
      break;
    }
  }
  return wrote;
}

@inline
export function write_magic(ptr: u32): u32 {
  return write_u32(ptr, 0x6d736100); // \0asm
}

@inline
export function write_version(ptr: u32): u32 {
  return write_u32(ptr, 0x1);
}
