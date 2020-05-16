import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import App from './App';
import './app.global.css';
import './css/main.scss';
import './css/dracula-theme.scss';
// remember if you want to add vendor css to do so in ./app.global.css

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  )
);
