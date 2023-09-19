import { Box, Textarea } from "@chakra-ui/react";

const DisplayMoveHistory: React.FC<{ moveHistory: string | null }> = ({
  moveHistory,
}) => {
  return (
    <Box>
      履歴：
      <Textarea
        readOnly
        value={moveHistory ? moveHistory : ""}
        rows={2} // テキストエリアの行数を調整
        cols={37} // テキストエリアの列数を調整
      />
    </Box>
  );
};

export default DisplayMoveHistory;
