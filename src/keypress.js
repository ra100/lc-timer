const registered = {}

let stdin


function onKeyPressed(chunk, key){
  const fn = registered[key.name]
  if(fn) fn()
  if (key && key.ctrl && key.name == 'c') return process.exit();
}


function keypress(char, callback){
  registered[char] = callback
  if(stdin) stdin.removeListener('keypress', onKeyPressed)

  stdin = process.openStdin();
  stdin.setRawMode(true);
  stdin.on('keypress', onKeyPressed);
}

module.exports = keypress
