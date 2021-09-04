function Test() {
  this.a = 'this is a';

  const doa = newa => {
    console.log(newa);
    this.a = newa ?? this.a;
  };

  doa();
}

const test = new Test();
console.log(test.a);
