#!/usr/bin/env node
/**
 * Zero-dependency PWA release builder: rasterizes the approved vector mark,
 * fingerprints exact Vite entrypoints, and makes a build-specific worker.
 *
 * Run AFTER vite build (dist exists). Never generate a worker that references
 * assets from another release; service-worker install must fail atomically if
 * the server has a partial upload.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const root = path.resolve('dist');
const outputIcons = path.join(root, 'icons');
fs.mkdirSync(outputIcons, { recursive: true });

const NAVY = [22,67,90,255];
const GOLD = [215,164,52,255];
const LIGHT_GOLD = [224,178,62,255];
const MUTED = [190,201,204,255];
const BACKGROUND = [253,252,248,255];

const crcTable = Array.from({length:256},(_,i)=>{
  let c=i;
  for(let k=0;k<8;k++) c = (c & 1) ? (0xedb88320 ^ (c>>>1)) : (c>>>1);
  return c>>>0;
});
function chunk(type, data) {
  const name=Buffer.from(type,'ascii');
  const bytes=Buffer.concat([name,data]);
  let crc=0xffffffff;
  for(const byte of bytes) crc=crcTable[(crc^byte)&255]^(crc>>>8);
  const out=Buffer.alloc(12+data.length);
  out.writeUInt32BE(data.length,0);
  name.copy(out,4);data.copy(out,8);
  out.writeUInt32BE((crc^0xffffffff)>>>0,8+data.length);
  return out;
}
function png(size, rgba) {
  const scan=Buffer.alloc((size*4+1)*size);
  for(let y=0;y<size;y++) {
    const row=y*(size*4+1);
    scan[row]=0;
    rgba.copy(scan,row+1,y*size*4,(y+1)*size*4);
  }
  const header=Buffer.alloc(13);
  header.writeUInt32BE(size,0);
  header.writeUInt32BE(size,4);
  header[8]=8; // 8 bits per channel
  header[9]=6; // RGBA
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',header),
    chunk('IDAT',zlib.deflateSync(scan,{level:9})),
    chunk('IEND',Buffer.alloc(0))
  ]);
}
function bezier(p0,p1,p2,p3,steps=32) {
  const result=[];
  for(let i=0;i<=steps;i++){
    const t=i/steps,u=1-t;
    result.push([
      u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],
      u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]
    ]);
  }
  return result;
}
function join(...segments) {
  return segments.flatMap((points,i)=>i===0?points:points.slice(1));
}
function drawIcon(size) {
  const pixels=Buffer.alloc(size*size*4);
  const scale=size/512;
  for(let i=0;i<pixels.length;i+=4) {
    pixels[i]=BACKGROUND[0]; pixels[i+1]=BACKGROUND[1];
    pixels[i+2]=BACKGROUND[2]; pixels[i+3]=255;
  }
  const paintDisc=(x,y,r,color)=>{
    const x0=Math.max(0,Math.floor(x-r-1)), x1=Math.min(size-1,Math.ceil(x+r+1));
    const y0=Math.max(0,Math.floor(y-r-1)), y1=Math.min(size-1,Math.ceil(y+r+1));
    for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){
      const delta=Math.hypot(px+0.5-x,py+0.5-y);
      const alpha=Math.max(0,Math.min(1,r+0.65-delta));
      if(alpha<=0)continue;
      const i=(py*size+px)*4;
      for(let k=0;k<3;k++)pixels[i+k]=Math.round(pixels[i+k]*(1-alpha)+color[k]*alpha);
      pixels[i+3]=255;
    }
  };
  const stroke=(points,width,color)=>{
    const r=width*scale/2;
    for(let j=1;j<points.length;j++){
      const a=points[j-1],b=points[j],distance=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const n=Math.max(1,Math.ceil(distance*scale/1.1));
      for(let s=0;s<=n;s++){
        const t=s/n;
        paintDisc((a[0]+(b[0]-a[0])*t)*scale,(a[1]+(b[1]-a[1])*t)*scale,r,color);
      }
    }
  };
  const circle=Array.from({length:145},(_,i)=>{
    const a=2*Math.PI*i/144;
    return [256+155*Math.cos(a),235+155*Math.sin(a)];
  });
  stroke(circle,15,NAVY);
  stroke(join(
    bezier([92,310],[150,269],[203,277],[256,324]),
    bezier([256,324],[309,277],[362,269],[420,310])
  ),16,NAVY);
  stroke(join(
    bezier([95,319],[160,295],[208,310],[256,342]),
    bezier([256,342],[304,310],[352,295],[417,319])
  ),13,GOLD);
  stroke(join(
    bezier([256,322],[256,260],[256,164],[256,104],6),
    bezier([256,104],[205,155],[206,201],[255,224]),
    bezier([255,224],[298,248],[293,299],[256,302]),
    bezier([256,302],[204,305],[198,255],[224,238])
  ),23,NAVY);
  stroke(join(
    bezier([270,124],[237,167],[236,210],[267,234]),
    bezier([267,234],[304,264],[294,312],[251,309])
  ),13,LIGHT_GOLD);
  stroke([[250,303],[250,303.001]],34,NAVY);
  stroke([[250,303],[250,303.001]],22,LIGHT_GOLD);
  stroke([[139,371],[373,371]],7,MUTED);
  return png(size,pixels);
}
for(const size of [192,512,180]){
  const name=size===180?'apple-touch-icon.png':'pwa-'+size+'.png';
  const file=path.join(outputIcons,name);
  fs.writeFileSync(file,drawIcon(size));
  console.log('PWA icon',name,fs.statSync(file).size+' bytes');
}

const indexFile=path.join(root,'index.html');
const html=fs.readFileSync(indexFile,'utf8');
const viteAssets=[...html.matchAll(/(?:src|href)=["']\/(assets\/[a-zA-Z0-9._/-]+\.(?:js|css))["']/g)]
  .map(match=>'/'+match[1]);
if(!viteAssets.some(s=>s.endsWith('.js')) || !viteAssets.some(s=>s.endsWith('.css'))) {
  throw new Error('Cannot generate PWA worker: missing built Vite JS/CSS');
}
for(const asset of viteAssets) {
  if(!fs.existsSync(path.join(root,asset.slice(1))))
    throw new Error('Cannot precache absent built asset: '+asset);
}
const shell=[
  '/','/index.html','/offline.html','/manifest.webmanifest',
  '/icons/pwa-icon.svg','/icons/pwa-192.png','/icons/pwa-512.png',
  '/icons/apple-touch-icon.png',...new Set(viteAssets)
];
for(const item of shell.filter(x=>x!=='/')) {
  if(!fs.existsSync(path.join(root,item.slice(1))))
    throw new Error('PWA shell missing: '+item);
}
const hash=crypto.createHash('sha256');
hash.update(html);
for(const item of viteAssets) hash.update(fs.readFileSync(path.join(root,item.slice(1))));
const version=hash.digest('hex').slice(0,16);
const template=fs.readFileSync('scripts/pwa-sw.template.js','utf8');
if(!template.includes('__PWA_CACHE_VERSION__') || !template.includes('__PWA_SHELL_JSON__')) {
  throw new Error('PWA worker template missing expected placeholders');
}
const worker=template.replace('__PWA_CACHE_VERSION__',JSON.stringify(version))
  .replace('__PWA_SHELL_JSON__',JSON.stringify(shell));
fs.writeFileSync(path.join(root,'sw.js'),worker);
console.log('PWA offline shell generated',version,'assets:',shell.length);
