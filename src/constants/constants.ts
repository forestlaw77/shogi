import { PieceType } from "../types/pieceTypes.ts";

// Constants

// The number of milliseconds for double tap delay.
export const TAP_DELAY = 250;

// Dimensions of the shogi board and pieces.
export const BOARD_SIZE = {
  padding: 30 * (375 / 600),
  width: 540 * (375 / 600),
  height: 560 * (375 / 600),
  rows: 9,
  cols: 9,
};
export const PIECE_SIZE = {
  width: 60 * (375 / 600),
  height: 62 * (375 / 600),
};

// Directions for possible piece moves.
export const PIECE_DIRECTIONS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [1, -2],
  [-1, -2],
];

// Movable ranges for different piece types.
export const MOVABLE_RANGES: { [key in PieceType]: number[] } = {
  [PieceType.None]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [PieceType.King1]: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [PieceType.King2]: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [PieceType.Rook]: [9, 0, 9, 0, 9, 0, 9, 0, 0, 0],
  [PieceType.Bishop]: [0, 9, 0, 9, 0, 9, 0, 9, 0, 0],
  [PieceType.Gold]: [1, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [PieceType.Silver]: [1, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [PieceType.Knight]: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [PieceType.Lance]: [9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [PieceType.Pawn]: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [PieceType.PromotedRook]: [9, 1, 9, 1, 9, 1, 9, 1, 0, 0],
  [PieceType.PromotedBishop]: [1, 9, 1, 9, 1, 9, 1, 9, 0, 0],
  [PieceType.PromotedSilver]: [1, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [PieceType.PromotedKnight]: [1, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [PieceType.PromotedLance]: [1, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [PieceType.PromotedPawn]: [1, 1, 1, 0, 1, 0, 1, 1, 0, 0],
};

// Mapping of pieces that can be promoted.
export const PROMOTION_PIECES: { [key in PieceType]?: PieceType } = {
  [PieceType.Pawn]: PieceType.PromotedPawn,
  [PieceType.Lance]: PieceType.PromotedLance,
  [PieceType.Knight]: PieceType.PromotedKnight,
  [PieceType.Silver]: PieceType.PromotedSilver,
  [PieceType.Rook]: PieceType.PromotedRook,
  [PieceType.Bishop]: PieceType.PromotedBishop,
};

// Mapping of promoted pieces to their original forms.
export const ORIGINAL_PIECES: { [key in PieceType]?: PieceType } = {
  [PieceType.PromotedPawn]: PieceType.Pawn,
  [PieceType.PromotedLance]: PieceType.Lance,
  [PieceType.PromotedKnight]: PieceType.Knight,
  [PieceType.PromotedSilver]: PieceType.Silver,
  [PieceType.PromotedRook]: PieceType.Rook,
  [PieceType.PromotedBishop]: PieceType.Bishop,
};

// Definition of all shogi piece types.
export const PIECES = [
  {
    type: PieceType.King1,
    UpImage: "u_king1.png",
    DownImage: "d_king1.png",
    movableRange: MOVABLE_RANGES[PieceType.King1],
  },
  {
    type: PieceType.King2,
    UpImage: "u_king2.png",
    DownImage: "d_king2.png",
    movableRange: MOVABLE_RANGES[PieceType.King2],
  },
  {
    type: PieceType.Rook,
    UpImage: "u_rook.png",
    DownImage: "d_rook.png",
    movableRange: MOVABLE_RANGES[PieceType.Rook],
  },
  {
    type: PieceType.Bishop,
    UpImage: "u_bishop.png",
    DownImage: "d_bishop.png",
    movableRange: MOVABLE_RANGES[PieceType.Bishop],
  },
  {
    type: PieceType.Gold,
    UpImage: "u_gold.png",
    DownImage: "d_gold.png",
    movableRange: MOVABLE_RANGES[PieceType.Gold],
  },
  {
    type: PieceType.Silver,
    UpImage: "u_silver.png",
    DownImage: "d_silver.png",
    movableRange: MOVABLE_RANGES[PieceType.Silver],
  },
  {
    type: PieceType.Knight,
    UpImage: "u_knight.png",
    DownImage: "d_knight.png",
    movableRange: MOVABLE_RANGES[PieceType.Knight],
  },
  {
    type: PieceType.Lance,
    UpImage: "u_lance.png",
    DownImage: "d_lance.png",
    movableRange: MOVABLE_RANGES[PieceType.King1],
  },
  {
    type: PieceType.Pawn,
    UpImage: "u_pawn.png",
    DownImage: "d_pawn.png",
    movableRange: MOVABLE_RANGES[PieceType.Lance],
  },
  {
    type: PieceType.PromotedRook,
    UpImage: "u_p_rook.png",
    DownImage: "d_p_rook.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedRook],
  },
  {
    type: PieceType.PromotedBishop,
    UpImage: "u_p_bishop.png",
    DownImage: "d_p_bishop.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedBishop],
  },
  {
    type: PieceType.PromotedSilver,
    UpImage: "u_p_silver.png",
    DownImage: "u_p_silver.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedSilver],
  },
  {
    type: PieceType.PromotedKnight,
    UpImage: "u_p_knight.png",
    DownImage: "d_p_knight.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedKnight],
  },
  {
    type: PieceType.PromotedLance,
    UpImage: "u_p_lance.png",
    DownImage: "d_p_lance.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedLance],
  },
  {
    type: PieceType.PromotedPawn,
    UpImage: "u_p_pawn.png",
    DownImage: "d_p_pawn.png",
    movableRange: MOVABLE_RANGES[PieceType.PromotedPawn],
  },
];

export const pieceLetter = {
  [PieceType.King1]: "王",
  [PieceType.King2]: "玉",
  [PieceType.Rook]: "飛",
  [PieceType.Bishop]: "角",
  [PieceType.Gold]: "金",
  [PieceType.Silver]: "銀",
  [PieceType.Knight]: "桂",
  [PieceType.Lance]: "香",
  [PieceType.Pawn]: "歩",
  [PieceType.PromotedRook]: "龍",
  [PieceType.PromotedBishop]: "馬",
  [PieceType.PromotedSilver]: "成銀",
  [PieceType.PromotedKnight]: "成桂",
  [PieceType.PromotedLance]: "成香",
  [PieceType.PromotedPawn]: "と",
};
