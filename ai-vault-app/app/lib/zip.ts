// app/lib/zip.ts
// Minimal ZIP builder — no external dependencies

export function buildZip(files: { name: string; content: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralDirs: Uint8Array[] = [];
  let offset = 0;

  function u16(n: number) {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n, true);
    return b;
  }

  function u32(n: number) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, true);
    return b;
  }

  function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function cat(arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((s, a) => s + a.length, 0);
    const r = new Uint8Array(total);
    let pos = 0;
    for (const a of arrays) { r.set(a, pos); pos += a.length; }
    return r;
  }

  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const data = enc.encode(file.content);
    const crc = crc32(data);
    const lh = cat([
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
      u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0),
      nameBytes, data,
    ]);
    localHeaders.push(lh);
    centralDirs.push(cat([
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]),
      u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
      u32(0), u32(offset), nameBytes,
    ]));
    offset += lh.length;
  }

  const cdOffset = offset;
  const cdSize = centralDirs.reduce((s, c) => s + c.length, 0);
  const eocd = cat([
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]),
    u16(0), u16(0),
    u16(files.length), u16(files.length),
    u32(cdSize), u32(cdOffset), u16(0),
  ]);

  return cat([...localHeaders, ...centralDirs, eocd]);
}