import React, { useState, useEffect } from 'react';
import { readdir } from 'fs';
import { join } from 'path';
import { useHistory } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1>Welcome</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
