
const Generate = {}

const max = 800

Generate.tile = function (tileX, tileY, tileId) {
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
  if (tileId === 3) {
    //maze long
    [windowNumber, wallNumber] = [1,8]
    point1 = [150,190,420,520,655,400,600,230,150,150,230,320,520,520,520,655,655,670,530,310,150,150,150,150,150,270,530]
    point2 = [400,145,145,250,402.5,530,655,655,400,145,145,145,145,145,360,270,530,655,655,655,655,655,430,370,145,530,530]
    thick1 =[.15,.54,1.3,.1,.1,1.8,1,1.08,.1]
    thick2 =[.4,.1,.1,1.5,1.8,.1,.1,.1,3.5]
    vault = [1]
  }
  if (tileId === 4) {
    //maze short
    [windowNumber, wallNumber] = [1,9]
    point1 = [590,190,420,520,655,480,600,230,150,150,150,230,320,520,520,520,655,655,670,530,310,150,150,150,150,150,300,560,655,620]
    point2 = [530,145,145,250,402.5,530,655,655,557.5,242.5,145,145,145,145,145,360,270,530,655,655,655,655,655,450,350,145,530,530,530,530]
    thick1 =[.4,.54,1.3,.1,.1,2.4,1,1.08,.1,.1]
    thick2 =[.15,.1,.1,1.5,1.8,.1,.1,.1,1.4,1.4]
    vault = [-1]
  }
  if (tileId === 5) {
    //blank tile
    [windowNumber, wallNumber] = [0,4]
    point1 = [250,400,400,550,250,250,400,400,400,400,550,550]
    point2 = [230,250,550,570,80,380,152.5,347.5,452.5,647.5,420,720]
    thick1 =[.1,.1,.1,.1]
    thick2 =[2,1.3,1.3,2]
    vault = []
  }

  //mutate points baised on rotation
  let rotation

  let prime = [[3,5,7],[11,17,19],[23,29,31]]
  let seedRandom = Client.room.seed * prime[tileX][tileY]


  if ((seedRandom % 100) <= 24) {
    rotation = 1
  } else if ((seedRandom % 100) <= 49) {
    rotation = 2
  } else if ((seedRandom % 100) <= 74) {
    rotation = 3
  } else {
    rotation = 4
  }

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
