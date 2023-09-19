import { useState } from "react";
import { VStack, Box, Image, SimpleGrid, Button } from "@chakra-ui/react";
import ShogiGame from "./components/model/Shogi";
import KifuPlayer from "./features/kifuPlayer/components/KifuPlayer";
import { PieceType, Piece, PlayerType, GameState } from "./types/pieceTypes";
import { generateInitialBoard } from "./utils/boardInitializer";

const Shogi = () => {
  const enum GameType {
    None,
    Alone,
    Ai,
    Online,
    KifuPlay,
    TsumeShogi,
    Study,
  }
  const [gameType, setGameType] = useState<GameType>(GameType.None);
  const [initialGameState, setInitialGameState] = useState<GameState>({
    board: generateInitialBoard(),
    prevMove: null,
    moveHistoryString: null,
    currentPlayer: PlayerType.Black,
    holdPieces: {
      [PlayerType.Black]: [],
      [PlayerType.White]: [],
    },
  });

  const handleClick = (type: GameType) => {
    setGameType(type);
    switch (type) {
      case GameType.Alone:
        break;
      case GameType.Ai:
        break;
      case GameType.Online:
        break;
      case GameType.KifuPlay:
        break;
      case GameType.TsumeShogi:
        break;
      case GameType.Study:
      default:
        setInitialGameState({
          ...initialGameState,
          board: getAllEmptyBoard(),
          holdPieces: generateAllHoldPieces(),
        });
        break;
    }
  };

  const generateAllHoldPieces = (): GameState["holdPieces"] => {
    const holdPieces: GameState["holdPieces"] = {
      [PlayerType.Black]: [],
      [PlayerType.White]: [],
    };

    holdPieces[PlayerType.Black].push({
      type: PieceType.King1,
      count: 1,
    });
    holdPieces[PlayerType.White].push({
      type: PieceType.King2,
      count: 1,
    });

    [PlayerType.Black, PlayerType.White].forEach((playerType) => {
      const player =
        playerType === PlayerType.Black ? PlayerType.Black : PlayerType.White;
      holdPieces[player].push({ type: PieceType.Pawn, count: 9 });
      holdPieces[player].push({ type: PieceType.Gold, count: 2 });
      holdPieces[player].push({ type: PieceType.Silver, count: 2 });
      holdPieces[player].push({ type: PieceType.Knight, count: 2 });
      holdPieces[player].push({ type: PieceType.Lance, count: 2 });
      holdPieces[player].push({ type: PieceType.Bishop, count: 1 });
      holdPieces[player].push({ type: PieceType.Rook, count: 1 });
    });

    return holdPieces;
  };

  const getAllEmptyBoard = () => {
    const board: Piece[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    return board;
  };

  const onBack = () => {
    setGameType(GameType.None);
  };

  return (
    <VStack>
      {gameType !== GameType.None ? (
        gameType === GameType.Alone ? (
          <ShogiGame
            initialGameState={initialGameState}
            mode={false}
            initialKifu={""}
            onBack={onBack}
          />
        ) : gameType === GameType.KifuPlay ? (
          <KifuPlayer onEnd={onBack} />
        ) : (
          <ShogiGame
            initialGameState={initialGameState}
            mode={true}
            initialKifu={""}
            onBack={onBack}
          />
        )
      ) : (
        <Box position="relative">
          <Image src="/images/japanese-chess-01.jpg" alt="Shogi Board" />
          <SimpleGrid
            columns={2}
            spacing={10}
            position="absolute"
            top="25%" /* 上端を中央に配置 */
            left="50%" /* 左端を中央に配置 */
            transform="translate(-50%, -50%)" /* 中央揃え */
            bgColor="rgb(255, 255, 255, 0.5)"
            boxSize="300"
          >
            <Button size="lg" onClick={() => handleClick(GameType.Alone)}>
              一人将棋
            </Button>
            <Button size="lg" onClick={() => handleClick(GameType.None)}>
              ＡＩ対戦
            </Button>

            <Button size="lg" onClick={() => handleClick(GameType.None)}>
              通信対戦
            </Button>

            <Button size="lg" onClick={() => handleClick(GameType.KifuPlay)}>
              棋譜再生
            </Button>

            <Button size="lg" onClick={() => handleClick(GameType.None)}>
              詰め将棋
            </Button>
            <Button size="lg" onClick={() => handleClick(GameType.Study)}>
              練習将棋
            </Button>
          </SimpleGrid>
          <Box boxSize="375">
            「成り」が可能なときに、移動先のセルをダブルタップすると、成ります。シングルタップすると、不成のままとなります。
          </Box>
        </Box>
      )}
    </VStack>
  );
};

export default Shogi;
