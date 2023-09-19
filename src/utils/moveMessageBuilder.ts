import {
  DirType,
  GameState,
  HoldPiece,
  Moved,
  Piece,
  PlayerType,
} from "../types/pieceTypes";

/**
 * Creates a moved message based on the provided `Moved` object.
 *
 * @param {Moved} moved - The moved object containing move details.
 * @returns {string} The formatted moved message.
 */
export const makeMovedMessage = (moved: Moved, player: PlayerType) => {
  const { src, dst, type, isDropped, isPromoted, isSameDst } = moved;
  const pieceName: string = type;
  let message = "";

  // <指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
  let mover = player === PlayerType.Black ? "☗" : "☖";
  if (isSameDst) {
    mover += "同　";
  } else {
    mover += `${number2Zenkaku(9 - dst.col)}${number2Kanji(dst.row + 1)}`;
  }
  mover += pieceName;
  if (isPromoted) {
    mover += "成";
  }
  if (isDropped) {
    mover += "打";
  } else {
    mover += `(${9 - src.col}${src.row + 1})`;
  }

  //message += (moved.idx + 1).toString().padStart(3, "0") + " " + mover;
  message += (moved.idx + 1).toString() + " " + mover;

  return message;
};

export const textBoardAndHoldPieces = (
  board: (Piece | null)[][],
  holdPieces: GameState["holdPieces"]
) => {
  let kifu: string = "";
  // 後手の持駒を出力
  kifu = "後手の持駒：" + formatHoldPieces(holdPieces[PlayerType.White]) + "\n";
  kifu += "  ９ ８ ７ ６ ５ ４ ３ ２ １\n";
  kifu += "+---------------------------+\n";

  // 盤面を出力
  for (let row = 0; row < 9; row++) {
    let rowStr = "|";
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      const pieceStr = cell ? formatPiece(cell) : " ・";
      rowStr += pieceStr;
    }
    rowStr += "|" + number2Kanji(row + 1);
    kifu += rowStr + "\n";
  }

  kifu += "+---------------------------+\n";
  kifu +=
    "先手の持駒：" + formatHoldPieces(holdPieces[PlayerType.Black]) + "\n";
  return kifu;
};

const formatPiece = (piece: Piece) => {
  let pieceName: string = piece.type;
  if (piece.direction == DirType.Down) {
    pieceName = "v" + pieceName;
  } else {
    pieceName = " " + pieceName;
  }
  return pieceName;
};

const formatHoldPieces = (holdPieces: HoldPiece[]) => {
  return holdPieces.map((holdPiece) => {
    const pieceName: string = holdPiece.type;
    return pieceName + holdPiece.count.toString();
  });
};

/**
 * Convert a numeric digit to its corresponding Kanji character (1-9).
 *
 * @param {number} number - The numeric digit (1-9) to convert to Kanji.
 * @returns {string} The Kanji representation of the numeric digit, or "Invalid Number" if the input is out of range.
 */
const number2Kanji = (number: number) => {
  const kanjiNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

  if (number >= 1 && number <= 9) {
    return kanjiNumbers[number - 1];
  } else {
    return "Invalid Number";
  }
};

const number2Zenkaku = (number: number) => {
  const zenkakuNumbers = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];

  if (number >= 1 && number <= 9) {
    return zenkakuNumbers[number - 1];
  } else {
    return "Invalid Number";
  }
};
