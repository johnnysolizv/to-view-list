import React, { useState } from 'react';

import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import { useDeleteBtnStyles } from '../styles/muiStyles';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteDialog = ({ handleDelete, title, isMobile }) => {
  const [open, setOpen] = useState(false);
  const classes = useDeleteBtnStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActionClick = () => {
    handleClose();
    handleDelete();
  };

  return (
    <div>
      {!isMobile ? (
        <Button
          className={classes.deleteButton}
          startIcon={<DeleteIcon />}
          onClick={handleClickOpen}
        >
          Eliminar
        </Button>
      ) : (
        <IconButton onClick={handleClickOpen} className={classes.deleteButton}>
          <DeleteIcon />
        </IconButton>
      )}
      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogTitle>Confirmar Eliminar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Estás seguro de Eliminar: "${title}" ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleActionClick} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
