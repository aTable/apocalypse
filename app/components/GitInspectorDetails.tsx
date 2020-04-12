/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { exec } from 'child_process';
import { readFile } from 'fs';
import { shell } from 'electron';
import { parseISO, format, differenceInDays } from 'date-fns';
import config from '../config';
import { executePythonCommand } from '../utils/utils';

export interface GitInspectorDetailsProps {
  path: string | undefined;
}

enum GitInspectorModes {
  text = 'text',
  html = 'html'
}

function renderStatistic(mode: GitInspectorModes, inline?: string) {
  if (!inline) return null;
  const styles = { height: '300px', width: '100%' };
  switch (mode) {
    case GitInspectorModes.text:
      return <pre style={styles}>{inline}</pre>;
    case GitInspectorModes.html:
      return (
        <iframe
          srcDoc={inline}
          title="git inspector statistics"
          style={styles}
        />
      );
    default:
      return null;
  }
}

const GitInspectorDetails = (props: GitInspectorDetailsProps) => {
  const [mode, setMode] = useState<GitInspectorModes>(GitInspectorModes.text);
  const [statistic, setStatistic] = useState<string>();

  useEffect(() => {
    if (!props.path) return;

    executePythonCommand(
      `${config.gitinspectorPath} --grading --format ${mode} ${props.path}`,
      process => {
        setStatistic(process);
      }
    );
  }, [props, mode]);

  const inspectorModeDomId = 'gitinspector-mode';
  return (
    <>
      <form>
        <div className="form-group row">
          <label
            htmlFor={inspectorModeDomId}
            className="col-sm-2 col-form-label"
          >
            Inspector Mode
          </label>
          <div className="col-sm-10">
            <select
              id={inspectorModeDomId}
              className="form-control"
              value={mode}
              onChange={e =>
                setMode(
                  GitInspectorModes[
                    e.currentTarget.value as keyof typeof GitInspectorModes
                  ]
                )
              }
            >
              <option value={GitInspectorModes.text}>
                {GitInspectorModes.text}
              </option>
              <option value={GitInspectorModes.html}>
                {GitInspectorModes.html}
              </option>
            </select>
          </div>
        </div>
      </form>

      {renderStatistic(mode, statistic)}
    </>
  );
};

export default GitInspectorDetails;
