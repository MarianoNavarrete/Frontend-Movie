import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Movie from './components/movie/Movie';
import Navbar from './components/general/Navbar';
import Actor from './components/actor/Actor';

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Route exact path = '/movies' component = {Movie} />
    <Route exact path = '/actors' component = {Actor} />
  </BrowserRouter>
)

export default App;
