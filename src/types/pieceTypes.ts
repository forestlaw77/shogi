export enum PieceType {
  None = "", // 駒なし
  King1 = "王将", // 王将
  King2 = "玉将", // 玉将
  Rook = "飛車", // 飛車
  Bishop = "角行", // 角行
  Gold = "金将", // 金将
  Silver = "銀将", // 銀将
  Knight = "桂馬", // 桂馬
  Lance = "香車", // 香車
  Pawn = "歩兵", // 歩兵
  PromotedRook = "龍王", // 龍王
  PromotedBishop = "龍馬", // 龍馬
  PromotedSilver = "成銀", // 成銀
  PromotedKnight = "成桂", // 成桂
  PromotedLance = "成香", // 成香
  PromotedPawn = "と金", // と金
}

export enum DirType {
  None,
  Up,
  Down,
}

export interface Cell {
  row: number;
  col: number;
  piece: Piece;
}

export interface Piece {
  type: PieceType;
  direction: DirType;
}

export enum Player {
  black = DirType.Up,
  white = DirType.Down,
}
