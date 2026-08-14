export type Player = ReturnType<
  typeof import('../gameobjects/player').addPlayer
>

export type Tile = ReturnType<typeof import('../gameobjects/tile').addTile>
