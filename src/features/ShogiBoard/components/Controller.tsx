import { HStack, IconButton, Button } from "@chakra-ui/react";
import {
  BsPencilSquare,
  //BsFillRecordBtnFill,
  BsSkipStartFill,
  BsRewindFill,
  BsPlayBtnFill,
  BsPauseFill,
  BsFastForwardFill,
  BsSkipEndFill,
} from "react-icons/bs";

const Controller: React.FC<{
  isEditMode: boolean;
  canButton: { rewind: boolean; foward: boolean; play: boolean };
  handleControllerButton: (btn: string) => void;
}> = ({ isEditMode, canButton, handleControllerButton }) => {
  return (
    <HStack>
      {isEditMode ? (
        <>
          <IconButton
            color="red"
            aria-label="編集"
            onClick={() => handleControllerButton("Edit")}
            icon={<BsPencilSquare />}
          />
        </>
      ) : (
        <>
          <IconButton
            aria-label="編集"
            onClick={() => handleControllerButton("Edit")}
            icon={<BsPencilSquare />}
          />
        </>
      )}
      <IconButton
        isDisabled={!canButton.rewind}
        aria-label="最初"
        onClick={() => handleControllerButton("SkipStart")}
        icon={<BsSkipStartFill />}
      />
      <IconButton
        isDisabled={!canButton.rewind}
        aria-label="前へ"
        onClick={() => handleControllerButton("Rewind")}
        icon={<BsRewindFill />}
      />
      {canButton.play ? (
        <IconButton
          isDisabled={true}
          aria-label="再生"
          onClick={() => handleControllerButton("Play")}
          icon={<BsPlayBtnFill />}
        />
      ) : (
        <IconButton
          isDisabled={true}
          aria-label="停止"
          onClick={() => handleControllerButton("Pause")}
          icon={<BsPauseFill />}
        />
      )}
      <IconButton
        isDisabled={!canButton.foward}
        aria-label="後へ"
        onClick={() => handleControllerButton("Forward")}
        icon={<BsFastForwardFill />}
      />
      <IconButton
        isDisabled={!canButton.foward}
        aria-label="最後"
        onClick={() => handleControllerButton("SkipEnd")}
        icon={<BsSkipEndFill />}
      />
      <Button onClick={() => handleControllerButton("Back")}>戻る</Button>
    </HStack>
  );
};
export default Controller;
