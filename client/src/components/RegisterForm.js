import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import AlertBox from './AlertBox';
import DemoCredsBox from './DemoCredsBox';
import authService from '../services/auth';
import entryService from '../services/entries';
import { useAuthContext } from '../context/auth/authState';
import { registerUser } from '../context/auth/authReducer';
import { useEntryContext } from '../context/entry/entryState';
import { toggleIsLoading } from '../context/entry/entryReducer';
import storageService from '../utils/localStorageHelpers';
import notify from '../utils/notifyDispatcher';

import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
} from '@material-ui/core/';
import { useRegisterLoginForm } from '../styles/muiStyles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import LockIcon from '@material-ui/icons/Lock';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

const RegisterForm = () => {
  const [userDetails, setUserDetails] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [, authDispatch] = useAuthContext();
  const [{ isLoading }, entryDispatch] = useEntryContext();
  const classes = useRegisterLoginForm();
  const history = useHistory();
  const { displayName, email, password } = userDetails;

  const handleOnChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError(`Las Contrase??as deben ser iguales`);
    }
    try {
      entryDispatch(toggleIsLoading());
      const user = await authService.register(userDetails);
      entryService.setToken(user.token);
      authDispatch(registerUser(user));
      storageService.saveUser(user);
      entryDispatch(toggleIsLoading());

      setUserDetails({
        displayName: '',
        email: '',
        password: '',
      });
      setConfirmPassword('');
      setError(null);
      history.push('/');
      notify(
        entryDispatch,
        `Bienvenido, ${user.displayName}! Tu cuenta ha sido creada con ??xito.`,
        '??xito'
      );
    } catch (err) {
      entryDispatch(toggleIsLoading());

      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={handleRegister} className={classes.form}>
        <Typography variant="h4" color="primary" className={classes.formTitle}>
          Crear cuenta
        </Typography>
        <div className={classes.input}>
          <PersonIcon color="secondary" className={classes.inputIcon} />
          <TextField
            color="secondary"
            required
            label="Mostrar Nombre"
            value={displayName}
            name="displayName"
            onChange={handleOnChange}
            fullWidth
          />
        </div>
        <div className={classes.input}>
          <AlternateEmailIcon color="secondary" className={classes.inputIcon} />
          <TextField
            color="secondary"
            required
            type="email"
            label="Email"
            value={email}
            name="email"
            onChange={handleOnChange}
            fullWidth
          />
        </div>
        <div className={classes.input}>
          <LockIcon color="secondary" className={classes.inputIcon} />
          <TextField
            color="secondary"
            required
            type={showPass ? 'text' : 'password'}
            label="Contrase??a"
            value={password}
            name="password"
            onChange={handleOnChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)}>
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.input}>
          <EnhancedEncryptionIcon
            color="secondary"
            className={classes.inputIcon}
          />
          <TextField
            color="secondary"
            required
            type={showConfirmPass ? 'text' : 'password'}
            label="Confirmar Contrase??a"
            value={confirmPassword}
            name="confirmPassword"
            onChange={({ target }) => setConfirmPassword(target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          className={classes.submitButton}
          startIcon={<PersonAddIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Registrando' : 'Crear'}
        </Button>
        <Typography variant="body1" className={classes.bottomText}>
          Ya tienes una cuenta?{' '}
          <Link component={RouterLink} to="/login">
            Iniciar Sesi??n
          </Link>
        </Typography>
        {error && (
          <AlertBox
            message={error}
            severity="error"
            clearError={() => setError(null)}
          />
        )}
        <DemoCredsBox />
      </form>
    </Paper>
  );
};

export default RegisterForm;
