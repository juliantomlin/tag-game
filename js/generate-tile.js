
const Generate = {}

const max = 800

Generate.tile = function (tileX, tileY, tileId, rotation) {
  if (tileId === 1) {
    const point1 = [280,590,460,590,280,280,280,280,130,280,280,430,330,595,595,595]
    const point2 = [470,140,100,242.5,510,360,210,440,510,510,510,510,100,100,170,390]
    const thick1 = [.15, .15, 1.8, .1, 2, .1]
    const thick2 = [.4, .4, .1, 2, .1, 2]
    let x
    let y
    let width
    let length
    if (rotation === 1){
      x = point1
      y = point2
      width = thick1
      length = thick2
    }
    else if (rotation === 2){
      x = point2.map(x => max - x)
      y = point1
      width = thick2
      length = thick1
    }
    else if (rotation === 3){
      x = point1.map(x => max - x)
      y = point2.map(y => max - y)
      width = thick1
      length = thick2
    }
    else if (rotation === 4){
      x = point2
      y = point1.map(y => max - y)
      width = thick2
      length = thick1
    }
    return {
      windows: [
        {x:x[0]+max*tileX, y:y[0]+max*tileY, width:width[0], length:length[0]},
        {x:x[1]+max*tileX, y:y[1]+max*tileY, width:width[1], length:length[1]}
      ],
      walls: [
        {x:x[2]+max*tileX, y:y[2]+max*tileY, width:width[2], length:length[2]},
        {x:x[3]+max*tileX, y:y[3]+max*tileY, width:width[3], length:length[3]},
        {x:x[4]+max*tileX, y:y[4]+max*tileY, width:width[4], length:length[4]},
        {x:x[5]+max*tileX, y:y[5]+max*tileY, width:width[5], length:length[5]}
      ],
      vision: [
        [[x[6]+max*tileX,y[6]+max*tileY],[x[7]+max*tileX,y[7]+max*tileY]],
        [[x[8]+max*tileX,y[8]+max*tileY],[x[9]+max*tileX,y[9]+max*tileY]],
        [[x[10]+max*tileX,y[10]+max*tileY],[x[11]+max*tileX,y[11]+max*tileY]],
        [[x[12]+max*tileX,y[12]+max*tileY],[x[13]+max*tileX,y[13]+max*tileY]],
        [[x[14]+max*tileX,y[14]+max*tileY],[x[15]+max*tileX,y[15]+max*tileY]]
      ]
    }
  }
}
