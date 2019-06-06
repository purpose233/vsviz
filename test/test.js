let a = Buffer.alloc(10);
b = Buffer.from('abc', 'utf8');
b.copy(a);

let str = a.toString('utf8', 0, 2);

console.log(str);

let c = a.slice(1, 100);

console.log(c);
