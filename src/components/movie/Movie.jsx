import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Card, CardActionArea, CardContent, Typography, FormControl,Button, Container, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Modal, TextField, Select, MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import '../../styles/table.css';
//endpoints
const apiMovie = 'http://127.0.0.1:3001/movie';
const apiActor = 'http://127.0.0.1:3001/actor';

//styles
const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 500,
        height:600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.spacing(2,4,3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    inputMaterial: {
        width: '100%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: 450,
      },
      root: {
        maxWidth: 345,
      },
      media: {
        height: 140,
      },
}));

function Movie() {
    //hooks
    const styles = useStyles();
    const [data, setData] = useState([]);
    const [actors, setActors] = useState([]);
    const [oneMovie, setOneMovie] = useState({
        name: '',
        duration: 0,
        genre: '',
        actors: [],
        sinopsis: '',
    });
    const [modalMovieView, setModalMovieView] = useState(false);
    const [modalMovieInsert, setModalMovieInsert] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [movieSelected, setMovieSelected] = useState({
        name: '',
        duration: 0,
        genre: '',
        actors: [],
        sinopsis: '',
    });

    //inputs changes
    const handleChange = e => {
        const {name, value} = e.target;
        setMovieSelected(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleActorChange = e => {
        const {name, value} = e.target;
        setMovieSelected(prevState => ({
            ...prevState,
            [name]: prevState.actors.push(value)
        }));
    }
    //get one movie by id
    const getOneMovie = async(movie) => {
        await axios.get(`http://127.0.0.1:3001/movie/${movie.id_movie}`)
        .then( response => {
            setOneMovie(response.data);
        });
    }
    //get the actors
    const getActors = async() => {
        await axios.get(apiActor)
        .then( response => {
            setActors(response.data);
        });   
    }
    //list movies
    const getMovies = async() => {
        await axios.get(apiMovie)
        .then( response => {
            setData(response.data);
        })
    }
    //create movie
    const postMovie = async() => {
        await axios.post(apiMovie, movieSelected)
        .then( response => {
            setData(data.concat(response.data));
            openCloseMovieModal()
        })
        .catch((err)=>console.log(err));
    }
    //edit movie
    const putMovie = async() => {

        await axios.put(`http://127.0.0.1:3001/movie/${movieSelected.id_movie}`, movieSelected)
        .then(response => {
            openCloseModalEdit(!modalEdit);
        })
    }
    //select the movie to edit
    const selectionMovie = (movie) => {
        setMovieSelected(movie);
        setModalEdit(true);
    }
    //open and close the modals
    const openCloseMovieModal = () => {
        setModalMovieInsert(!modalMovieInsert);
    }
    const openCloseOneMovieModal = (id) => {
        getOneMovie(id);
        setModalMovieView(!modalMovieView);
    }
    const openCloseModalEdit = () => {
        setModalEdit(!modalEdit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        await getMovies();
        await getActors();
    }, []);
    //body modals
    const bodyInsertMovie = (
        <div className={styles.modal}>
            <FormControl className={styles.formControl}>
            <h3>Nueva Película</h3>
            <TextField name = "name" className={styles.inputMaterial} label="Nombre" onChange = {handleChange}/>
            <br/>
            <TextField name = "duration" className={styles.inputMaterial} type="number" label="Duración" onChange = {handleChange}/>
            <br/>
            <Select
                labelId="GenreMovie"
                id="GenreMovie"
                value = {movieSelected.genre}
                name = "genre"
                onChange={handleChange}
                >
                <MenuItem value='Animadas'>Animadas</MenuItem>
                <MenuItem value='Románticas'>Románticas</MenuItem>
                <MenuItem value='Comedia'>Comedia</MenuItem>
                <MenuItem value='Terror'>Terror</MenuItem>
            </Select>
            <br/>
            <TextField
                id="outlined-textarea"
                name = "sinopsis"
                label="Sinopsis"
                placeholder="Placeholder"
                multiline
                variant="outlined"
                onChange = {handleChange}
            />
            <br/>
            <Select
                labelId="ActorMovie"
                id="ActorMovie"
                value = {actors}
                name = "actor"
                onChange={handleActorChange}
                >
                {actors.map(actor => (
                    <MenuItem value={actor.id_actor}>{actor.name}</MenuItem>
                ))}
            </Select>
            <br/><br/>
            <div align = 'right'>
                <Button variant="outlined" color="primary" onClick = {() => postMovie()}> Guardar </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" onClick={() => openCloseMovieModal()}> Cancelar</Button>
            </div>
            </FormControl>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <FormControl className={styles.formControl}>
            <h3>Editar Película</h3>
            <TextField name = "name" className={styles.inputMaterial} label="Nombre" onChange = {handleChange} defaultValue={movieSelected && movieSelected.name}/>
            <br/>
            <TextField name = "duration" className={styles.inputMaterial} type="number" label="Duración" onChange = {handleChange} defaultValue ={movieSelected && movieSelected.duration}/>
            <br/>
            <Select
                labelId="GenreMovie"
                id="GenreMovie"
                defaultValue = {movieSelected && movieSelected.genre}
                name = "genre"
                label = {movieSelected && movieSelected.genre}
                onChange={handleChange}
                >
                <MenuItem value='Animadas'>Animadas</MenuItem>
                <MenuItem value='Románticas'>Románticas</MenuItem>
                <MenuItem value='Comedia'>Comedia</MenuItem>
                <MenuItem value='Terror'>Terror</MenuItem>
            </Select>
            <br/>
            <TextField
                id="outlined-textarea"
                name = "sinopsis"
                label="Sinopsis"
                defaultValue={movieSelected && movieSelected.sinopsis}
                placeholder="Placeholder"
                multiline
                variant="outlined"
                onChange = {handleChange}
            />
            <br/><br/>
            <div align = 'right'>
                <Button variant="outlined" color="primary" onClick = {() => putMovie()}> Editar </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" onClick={() => openCloseModalEdit()}> Cancelar</Button>
            </div>
            </FormControl>
        </div>
    );

    const bodyView = (
        <div className={styles.modal}>
            <Container >
            <Card className={styles.root} alignItems="center">
                <CardActionArea>
                    <CardContent>
                    <Typography gutterBottom variant="h3" component="h2">
                        {oneMovie.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {oneMovie.duration} minutos
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        Sinopsis
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {oneMovie.sinopsis}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        Actores
                    </Typography>
                   
                        {oneMovie.actors.map((actor) => 
                            <Typography variant="body2" color="textSecondary" component="p">
                                {actor.name}
                            </Typography>
                        )}
                    
                    </CardContent>
                </CardActionArea>
            </Card>
            </Container>
        </div>
    );
    return (
        <Container fixed>
            <h2>Películas</h2>
            <Button className='Button_Pos' onClick={() => openCloseMovieModal()}>
                Nueva Pelicula
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Duración (minutos)</TableCell>
                            <TableCell>Género</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map ( movie => (
                            
                            <TableRow key={movie.id_movie}>
                                <TableCell>{movie.name}</TableCell>
                                <TableCell>{movie.duration}</TableCell>
                                <TableCell>{movie.genre}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick = {() => openCloseOneMovieModal(movie)}>
                                        Ver Info
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="outlined" color="primary" onClick={() => selectionMovie(movie)}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        <Modal
        open={modalMovieInsert}
        onClose={openCloseMovieModal}>
            {bodyInsertMovie}    
        </Modal>
        <Modal
        open={modalMovieView}
        onClose={openCloseOneMovieModal}>
            {bodyView}    
        </Modal>
        <Modal
        open = {modalEdit}
        onClose = {openCloseModalEdit}>
            {bodyEdit}
        </Modal>
        </Container>
        
    );
}

export default Movie;