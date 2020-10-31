import React from 'react';
import {Link} from 'react-router-dom';
import '../../styles/menu.css';

const Navbar = (props) => (
    <nav id = 'menu'>
        <Link to='/movies'>Películas</Link>
        <Link to='/actors'>Actores</Link>
    </nav>
);

export default Navbar;