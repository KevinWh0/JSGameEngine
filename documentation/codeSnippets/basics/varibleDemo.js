let seed = 0;
function onStart(parent) {
  //This will generate a random number at the start and store it as the seed
  seed = new Math.random(100);
}

function update(parent) {
  //Just like with JS classes you must clairify that the varible is a member of this script.
  // This applies to function calls as well
  console.log(this.seed);
}
