function onStart(parent) {
  //We are calling our coustom add function notice how we have to clairify
  // that it is from this class before we call the function
  parent.w = this.add(245, 100);
}

function update(parent) {}

function add(a, b) {
  return a + b;
}
