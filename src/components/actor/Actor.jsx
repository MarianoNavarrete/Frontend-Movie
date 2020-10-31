import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FormControl,Button, Container, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Modal, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {storage} from '../../firebase/index';
import Avatar from '@material-ui/core/Avatar';
import '../../styles/table.css';

//endpoint
const apiActor = 'http://127.0.0.1:3001/actor/';

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
      rootD: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },
      input: {
        display: 'none',
      },
}));
function Actor() {
    //hooks
    const styles = useStyles();
    const [data, setData] = useState([]);
    const [modalInsert, setModalInsert] = useState(false);
    const [image, setImage] =useState(null);
    const [actorSelected, setActorSelected] = useState({
        name: '',
        age: 0,
        image: ''
    });
    const [modalEdit, setModalEdit] = useState(false);
    //inputs changes
    const handleChange = e => {
        const {name, value} = e.target;
        setActorSelected(prevState => ({
            ...prevState,
            [name]: value
        }));
        
    }
    const handleImageChange = e => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
        
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            snapshot => {},
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setActorSelected(prevState => ({
                            ...prevState,
                            image: url
                        }));
                    });
            }
        );
    }
    //select the actor to edit
    const selectionActor = (movie) => {
        setActorSelected(movie);
        setModalEdit(true);
    }
    //api calls
    //get actors
    const getActors = async() => {
        await axios.get(apiActor)
        .then( response => {
            setData(response.data);
        });   
    }
    //create actor
    const postActor = async() => {
        await axios.post(apiActor, actorSelected)
        .then(response => {
            setData(data.concat(response.data))
            openCloseModalInsert()
        });
    }
    //edit actor
    const putActor = async() => {
        await axios.put(apiActor+actorSelected.id_actor, actorSelected)
        .then(response=>{
        var newData=data;
        // eslint-disable-next-line array-callback-return
        newData.map(actor=>{
            if(actorSelected.id_actor===actor.id_actor){
                actor.name=actorSelected.name;
                actor.age=actorSelected.age;
            }
        })
        setData(newData);
        openCloseModalEdit();
        })
    }
    //open and close the modals
    const openCloseModalInsert = () => {
        setModalInsert(!modalInsert);
    }
    const openCloseModalEdit = () => {
        setModalEdit(!modalEdit);
    }
    //body madals
    const bodyInsert = (
        <div className={styles.modal}>
            <FormControl className={styles.formControl}>
            <h3>Nuevo Actor</h3>
            <TextField name = "name" className={styles.inputMaterial} label="Nombre" onChange = {handleChange}/>
            <br/>
            <TextField name = "age" className={styles.inputMaterial} type="number" label="Edad" onChange = {handleChange}/>
            <br/>
            <input
                type="file"
                onChange = {handleImageChange}
            />
            <Button variant="contained" color="primary" component="span" onClick={()=>handleUpload()}>
                Cargar Imagen
            </Button>
            <br/><br/>
            <div align = 'right'>
                <Button variant="outlined" color="primary" onClick = {() => postActor()}> Guardar </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" onClick={() => openCloseModalInsert()}> Cancelar</Button>
            </div>
            </FormControl>
        </div>
    );

    const bodyEdit = (
        <div className={styles.modal}>
            <FormControl className={styles.formControl}>
            <h3>Nuevo Actor</h3>
            <TextField name = "name" className={styles.inputMaterial} label="Nombre" onChange = {handleChange} defaultValue={actorSelected && actorSelected.name}/>
            <br/>
            <TextField name = "age" className={styles.inputMaterial} type="number" label="Edad" onChange = {handleChange} defaultValue={actorSelected && actorSelected.age}/>
            <br/><br/>
            <div align = 'right'>
                <Button variant="outlined" color="primary" onClick = {() => putActor()}> Editar </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" onClick={() => openCloseModalEdit()}> Cancelar</Button>
            </div>
            </FormControl>
        </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        await getActors();
    }, []);
    return (
        <Container fixed>
            <h2>Actores</h2>
            <Button className='Button_Pos' onClick = {() => openCloseModalInsert()}>
                Nuevo Actor
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Foto</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Edad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map( actor => (
                            <TableRow>
                                <TableCell>
                                    <Avatar  src={actor.image} className={styles.large} />
                                </TableCell>
                                <TableCell>{actor.name}</TableCell>
                                <TableCell>{actor.age}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => selectionActor(actor)}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
            open={modalInsert}
            onClose={openCloseModalInsert}>
                {bodyInsert}
            </Modal>
            <Modal
            open={modalEdit}
            onClose={openCloseModalEdit}>
                {bodyEdit}
            </Modal>
        </Container>
    );
}

export default Actor;