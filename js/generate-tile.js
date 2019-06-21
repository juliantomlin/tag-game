
const Generate = {}

Generate.tile = function (x, y, tileId) {
  if (tileId === 1) {
    return {
      windows: [
        {x:280+800*x, y:470+800*y, width:.15, length:.4},
        {x:590+800*x, y:140+800*y, width:.15, length:.4}
      ],
      walls: [
        {x:460+800*x, y:100+800*y, width:1.8, length:.1},
        {x:590+800*x, y:242.5+800*y, width:.1, length:2},
        {x:280+800*x, y:510+800*y, width:2, length:.1},
        {x:280+800*x, y:360+800*y, width:.1, length:2}
      ],
      vision: [
        [[280+800*x,210+800*y],[280+800*x,440+800*y]],
        [[130+800*x,510+800*y],[280+800*x,510+800*y]],
        [[280+800*x,510+800*y],[430+800*x,510+800*y]],
        [[330+800*x,100+800*y],[595+800*x,100+800*y]],
        [[595+800*x,170+800*y],[595+800*x,390+800*y]]
      ],
      // vault: [
      //   {direction: 'left', xmin:170, xmax:280, ymin:405, ymax:485},
      //   {direction: 'right', xmin:280, xmax:390, ymin:405, ymax:485},
      //   {direction: 'left', xmin:480, xmax:590, ymin:75, ymax:155},
      //   {direction: 'right', xmin:590, xmax:700, ymin:75, ymax:155},

      // ]
    }
  }
}
