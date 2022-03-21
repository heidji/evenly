import React, {useState} from 'react';
import {
  Box,
  FormGroup,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import * as apis from '../providers/apis';
import Main from "./Main";
import Cookies from "js-cookie";

function Auth() {

  const [val, setVal] = useState('');
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const changeVal = (e: any) => {
    setVal(e.target.value);
  }

  const setAuth = () => {
    apis.testAuth(val)
      .then(() => {
        Cookies.set('auth', val);
        window.auth = val;
        setDone(true);
      })
      .catch(() => {
        setError(true);
      });
  }

  if (!done)
    return (
      <>
        <Dialog
          open={error}
          onClose={() => setError(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Authorization Token ungültig!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setError(false)} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{mt: 7, width: '100%', display: 'flex', justifyContent: 'center'}}>
          <FormGroup row>
            <TextField sx={{width: {sm: '300px', lg: '400px'}}} InputLabelProps={{shrink: true}}
                       label={'Authorization token'} variant="outlined" placeholder="username" onChange={changeVal}
                       value={val}/>
            <Button variant="contained" disableElevation onClick={setAuth}>
              Go!
            </Button>
          </FormGroup>
        </Box>
      </>
    );
  else return <Main/>
}

export default Auth;
