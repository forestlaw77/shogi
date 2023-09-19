/*
import React, { useState } from 'react';

const Settings = ({ playbackSpeed, setPlaybackSpeed }) => {
  const [newSpeed, setNewSpeed] = useState(playbackSpeed);

  const handleSpeedChange = () => {
    // ユーザーが新しい速度を設定した場合の処理
    setPlaybackSpeed(newSpeed);
  };

  return (
    <div>
      <h3>設定</h3>
      <label>
        再生速度 (ミリ秒):
        <input
          type="number"
          value={newSpeed}
          onChange={(e) => setNewSpeed(Number(e.target.value))}
        />
      </label>
      <button onClick={handleSpeedChange}>保存</button>
    </div>
  );
};

export default Settings;
*/
