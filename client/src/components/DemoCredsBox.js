import React from 'react';
import { useAlertStyles } from '../styles/muiStyles';

const DemoCredsBox = () => {
  const classes = useAlertStyles();

  return (
    <div className={classes.root}></div>
  );
};

export default DemoCredsBox;
