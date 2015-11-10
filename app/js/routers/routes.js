import React from 'react';
import { Route, DefaultRoute } from 'react-router'
import App from '../components/App';


const routes = (
    <Route name="home" path='/' handler={App}>
    </Route>
);

export default routes;