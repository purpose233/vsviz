let a = Buffer.alloc(10);
b = Buffer.from('abc', 'utf8');
b.copy(a);

let str = a.toString('utf8', 0, 2);

console.log(str);
