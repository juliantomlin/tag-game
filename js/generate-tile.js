
const Generate = {}

const max = 800

Generate.tile = function (tileX, tileY, tileId, rotation) {
  //declare all variables
  let [direction, x, y, width, length, point1, point2, thick1, thick2, vault, windowNumber, wallNumber] = ''
  let windows = []
  let walls = []
  let vision = []

  //select points based on tile type
  if (tileId === 1) {
    //t-walls
    [windowNumber, wallNumber] = [2,4]
    point1 = [280,590,460,590,280,280,280,280,130,280,280,430,330,595,595,595]
    point2 = [470,140,100,242.5,510,360,210,440,510,510,510,510,100,100,170,390]
    thick1 = [.15, .15, 1.8, .1, 2, .1]
    thick2 = [.4, .4, .1, 2, .1, 2]
    vault = [1, 1]
  }
  if (tileId === 2) {
    //shack
    [windowNumber, wallNumber] = [1,6]
    point1 = [150,190,485,650,570,270,150,150,230,320,655,655,655,655,490,400,150,150,150,150,150]
    point2 = [400,145,145,400,655,655,400,145,145,145,145,145,655,655,655,655,655,655,430,370,145]
    thick1 =[.15,.54,2.16,.1,1.08,1.62,.1]
    thick2 =[.4,.1,.1,3.5,.1,.1,3.5]
    vault = [1]
  }

  //mutate points baised on rotation
  if (rotation === 1){
    x = point1
    y = point2
    width = thick1
    length = thick2
    direction = vault
  }
  else if (rotation === 2){
    x = point2.map(x => max - x)
    y = point1
    width = thick2
    length = thick1
    direction = vault.map(x => -x)
  }
  else if (rotation === 3){
    x = point1.map(x => max - x)
    y = point2.map(y => max - y)
    width = thick1
    length = thick2
    direction = vault
  }
  else if (rotation === 4){
    x = point2
    y = point1.map(y => max - y)
    width = thick2
    length = thick1
    direction = vault.map(x => -x)
  }

  //construct the arrays of map components
  for (let i = 0; i < windowNumber; i++){
    windows.push({x:x[i]+max*tileX, y:y[i]+max*tileY, width:width[i], length:length[i], direction: direction[i]})
  }
  for (let i = windowNumber; i < wallNumber + windowNumber; i++){
    walls.push({x:x[i]+max*tileX, y:y[i]+max*tileY, width:width[i], length:length[i]})
  }
  for (let i = windowNumber + wallNumber; i < point1.length; i += 2){
    vision.push([[x[i]+max*tileX,y[i]+max*tileY],[x[i+1]+max*tileX,y[i+1]+max*tileY]])
  }
  return { windows, walls, vision}
}
