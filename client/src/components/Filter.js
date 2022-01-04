import React, { useState } from 'react';
import { useEntryContext } from '../context/entry/entryState';
import { setFilterValues, resetFilter } from '../context/entry/entryReducer';

import {
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { useFilterStyles } from '../styles/muiStyles';
import FilterListIcon from '@material-ui/icons/FilterList';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const Filter = () => {
  const [, dispatch] = useEntryContext();
  const [filter, setFilter] = useState({
    videos: false,
    articles: false,
    others: false,
    viewed: false,
    starred: false,
  });
  const classes = useFilterStyles();
  const { videos, articles, others, viewed, starred } = filter;

  const handleCheckboxChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.checked });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    if (Object.values(filter).every((v) => v === false)) {
      return dispatch(resetFilter());
    }

    dispatch(setFilterValues(filter));
  };

  const handleUncheck = () => {
    setFilter({
      videos: false,
      articles: false,
      others: false,
      viewed: false,
      starred: false,
    });
    dispatch(resetFilter());
  };

  return (
    <form className={classes.root} onSubmit={handleApplyFilter}>
      <FormGroup row className={classes.checkboxGroup}>
        <FormControlLabel
          control={
            <Checkbox
              checked={videos}
              onChange={handleCheckboxChange}
              name="videos"
            />
          }
          label="Videos"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={articles}
              onChange={handleCheckboxChange}
              name="articles"
            />
          }
          label="Artículos"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={others}
              onChange={handleCheckboxChange}
              name="others"
            />
          }
          label="Otros"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={viewed}
              onChange={handleCheckboxChange}
              name="viewed"
            />
          }
          label="Visto"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={starred}
              onChange={handleCheckboxChange}
              name="starred"
            />
          }
          label="Destacado"
        />
        <Button
          onClick={handleUncheck}
          startIcon={<RotateLeftIcon />}
          variant="outlined"
          size="small"
          className={classes.resetBtn}
        >
          Resetear
        </Button>
      </FormGroup>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<FilterListIcon />}
        className={classes.filterButton}
      >
        Filtrar
      </Button>
    </form>
  );
};

export default Filter;
