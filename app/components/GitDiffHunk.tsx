import React, { FC, useState } from 'react';
import { FileDiffHunk } from '../types/git';

export interface GitDiffHunkProps {
  hunk: FileDiffHunk;
  discard: (hunk: FileDiffHunk) => void;
  stage: (hunk: FileDiffHunk) => void;
}

const GitDiffHunk: FC<GitDiffHunkProps> = props => {
  const [isHovered, setIsHovered] = useState(false);
  const discard = () => props?.discard(props?.hunk);
  const stage = () => props?.discard(props?.hunk);

  return (
    <div
      className={`hunk ${isHovered ? 'active' : ''}`}
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: isHovered ? 'block' : 'none'
        }}
      >
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={discard}
        >
          Discard
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={stage}
        >
          Stage
        </button>
      </p>

      <pre>{props?.hunk.metadata}</pre>
      <br />
      <pre>
        <code>{props?.hunk.hunk}</code>
      </pre>
    </div>
  );
};

export default GitDiffHunk;
