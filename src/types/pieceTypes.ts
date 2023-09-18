export interface Piece {
  type: PieceType;
  owner: PlayerType;
  direction: DirType;
}

export interface Cell {
  row: number;
  col: number;
  piece: Piece | null;
}

export interface Move {
  srcCell: Cell | null;
  dstCell: Cell;
  dropPiece: Piece | null;
  wantPromote: boolean;
}

export interface Moved {
  idx: number;
  src: { row: number; col: number };
  dst: { row: number; col: number };
  type: PieceType;
  isDropped: boolean;
  isPromoted: boolean;
  isSameDst: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export enum PieceType {
  None = "無", // 駒なし
  King1 = "王", // 王将
  King2 = "玉", // 玉将
  Rook = "飛", // 飛車
  Bishop = "角", // 角行
  Gold = "金", // 金将
  Silver = "銀", // 銀将
  Knight = "桂", // 桂馬
  Lance = "香", // 香車
  Pawn = "歩", // 歩兵
  PromotedRook = "龍", // 龍王
  PromotedBishop = "馬", // 龍馬
  PromotedSilver = "全", // 成銀
  PromotedKnight = "圭", // 成桂
  PromotedLance = "杏", // 成香
  PromotedPawn = "と", // と金
}

export enum DirType {
  None,
  Up,
  Down,
}

export enum PlayerType {
  None,
  Black,
  White,
}

export interface HoldPiece {
  type: PieceType;
  count: number;
}

export interface GameState {
  board: (Piece | null)[][];
  prevMove: Moved | null;
  moveHistoryString: string | null;
  currentPlayer: PlayerType;
  holdPieces: {
    [PlayerType.Black]: HoldPiece[];
    [PlayerType.White]: HoldPiece[];
  };
}
