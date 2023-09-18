import {
  DirType,
  GameState,
  Piece,
  PieceType,
  PlayerType,
} from "../types/pieceTypes";

export const kifParser = (kif: string) => {
  const kifuLines = kif.split(/\r?\n/);
  const holdPieces: GameState["holdPieces"] = {
    [PlayerType.Black]: [],
    [PlayerType.White]: [],
  };
  const board: (Piece | null)[][] = [];

  for (let line of kifuLines) {
    if (/^#/.test(line)) continue; // skip comment
    line = line.replace(/[\s　]+/g, " "); // Replace all whitespace and full-width spaces with a single space
    if (line.length === 0) continue;

    if (line.startsWith("後手の持駒：")) {
      const piecesData = line.substring(6).trim().split(" ");
      console.log(piecesData);
      piecesData.forEach((pieceString) => {
        const pieceInfoObj = getPieceInfoFromString(pieceString);
        if (pieceInfoObj && pieceInfoObj.type) {
          holdPieces[PlayerType.White].push({
            type: pieceInfoObj.type,
            count: pieceInfoObj.count,
          });
        }
      });
      continue;
    }
    if (line.startsWith("先手の持駒：")) {
      const piecesData = line.substring(6).trim().split(" ");
      piecesData.forEach((pieceString) => {
        const pieceInfoObj = getPieceInfoFromString(pieceString);
        if (pieceInfoObj && pieceInfoObj.type) {
          holdPieces[PlayerType.Black].push({
            type: pieceInfoObj.type,
            count: pieceInfoObj.count,
          });
        }
      });
      continue;
    }
    if (line.startsWith("|")) {
      const piecesData = line.substring(1);
      const pieces: (Piece | null)[] = [];

      for (let i = 0; i < 18; i += 2) {
        if (piecesData[i + 1] === "・") {
          pieces.push(null); // 何も置かれていない
          continue;
        } else {
          const pieceType = getPieceTypeFromString(piecesData[i + 1]);
          if (!pieceType) {
            console.error(
              "Logic error at kifParser. Unknown PieceType",
              piecesData[i + 1]
            );
            pieces.push(null);
            continue; // anyway continue
          }
          if (piecesData[i] === " ") {
            pieces.push({
              owner: PlayerType.Black, // 先手
              type: pieceType,
              direction: DirType.Up,
            });
          } else {
            pieces.push({
              owner: PlayerType.White, // 後手
              type: pieceType,
              direction: DirType.Down,
            });
          }
        }
      }
      board.push(pieces);
    }
  }
  return { board, holdPieces };
};

const getPieceTypeFromString = (str: string) => {
  if (str[0] == "成") {
    return {
      香: PieceType.PromotedLance,
      桂: PieceType.PromotedKnight,
      銀: PieceType.PromotedSilver,
    }[str[1]];
  }
  return {
    歩: PieceType.Pawn,
    香: PieceType.Lance,
    桂: PieceType.Knight,
    銀: PieceType.Silver,
    金: PieceType.Gold,
    角: PieceType.Bishop,
    飛: PieceType.Rook,
    玉: PieceType.King2,
    王: PieceType.King1,
    と: PieceType.PromotedPawn,
    杏: PieceType.PromotedLance,
    圭: PieceType.PromotedKnight,
    全: PieceType.PromotedSilver,
    馬: PieceType.PromotedBishop,
    竜: PieceType.PromotedRook,
    龍: PieceType.PromotedRook,
  }[str];
};

const getPieceInfoFromString = (pieceString: string) => {
  const regex =
    /([成歩香桂銀金角飛玉王と杏圭全馬竜龍]+)([一二三四五六七八九十]+)?/;
  const match = pieceString.match(regex);

  if (match) {
    const pieceType = match[1];
    const kanjiNumber = match[2] || "一";

    return {
      type: getPieceTypeFromString(pieceType),
      count: kanjiStr2Numbers(kanjiNumber),
    };
  } else {
    return null;
  }
};

const kanjiStr2Numbers = (str: string) => {
  switch (str.length) {
    case 1:
      return "〇一二三四五六七八九十".indexOf(str);
    case 2:
      return "〇一二三四五六七八九十".indexOf(str[1]) + 10;
    default:
      throw "Does not support numbers larger than 2 digits";
  }
};
