import { Box, Textarea, Button } from "@chakra-ui/react";

const DisplayKifu: React.FC<{
  kifu: string;
  handleLoadGame: () => void;
  handleNewKifu: (kifu: string) => void;
}> = ({ kifu, handleLoadGame, handleNewKifu }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newKifu = event.target.value;
    handleNewKifu(newKifu);
  };

  return (
    <Box>
      棋譜：
      <Button margin="2" size="sm" onClick={handleLoadGame}>
        読込
      </Button>
      <Textarea
        value={kifu}
        onChange={handleInputChange}
        rows={10} // テキストエリアの行数を調整
        cols={29} // テキストエリアの列数を調整
      />
    </Box>
  );
};

export default DisplayKifu;
