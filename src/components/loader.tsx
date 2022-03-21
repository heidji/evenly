import React from 'react';
import {
  LinearProgress,
  Box
} from "@mui/material";

export default function Loader () {
  return (
    <Box sx={{mt: 7, width: '100%'}}>
      <LinearProgress/>
    </Box>
  )
}
