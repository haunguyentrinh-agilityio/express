import './css/index.scss';
import 'bootstrap-webpack';
import React from 'react';
import ReactDOM from 'react-dom';
import router from './js/routers/router';

main();

function main() {
  const app = document.createElement('div');

  document.body.appendChild(app);

  router.run((Handler, state) => {
	  ReactDOM.render(<Handler {...state} />, app);
	});
}