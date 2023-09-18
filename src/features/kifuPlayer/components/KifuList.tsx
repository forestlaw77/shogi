import { Box, Button } from "@chakra-ui/react";

const KifuList: React.FC<{
  setKifu: (file: string) => void;
  onEnd: () => void;
}> = ({ setKifu, onEnd }) => {
  const kifuList = [
    "everyday_20230901",
    "everyday_20230902",
    "everyday_20230903",
    "everyday_20230904",
    "everyday_20230905",
    "everyday_20230906",
    "everyday_20230907",
    "everyday_20230908",
    "everyday_20230909",
  ];
  const handleOnClick = async (file: string) => {
    const fullpath = "/kifu/" + file + ".kif";
    try {
      // ファイルをダウンロード
      const response = await fetch(fullpath);

      // レスポンスからテキストデータを取得
      const kifuText = await response.text();

      // kifuText を setKifu で渡す
      setKifu(kifuText);
    } catch (error) {
      console.error("ファイル読み込みエラー:", error);
    }
  };

  const renderKifuList = kifuList.map((file, index) => {
    return (
      <Box key={index}>
        まいにち詰め将棋
        <Button margin="2" onClick={() => handleOnClick(file)}>
          {file}
        </Button>
      </Box>
    );
  });

  return (
    <Box>
      {renderKifuList}
      <Button onClick={onEnd}>戻る</Button>
    </Box>
  );
};

export default KifuList;
