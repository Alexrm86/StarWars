import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

function Provider({ children }) {
  const URL = 'https://swapi-trybe.herokuapp.com/api/planets/';
  const [planets, setPlanets] = useState([]);
  const [planetsToBeFiltered, setPlanetsToBeFiltered] = useState([]);
  const [filteredPlanetsState, setFilteredPlanetsState] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [filterByName, setFilterByName] = useState({
    name: '',
  });
  const [filterByNumericValues, setFilterByNumericValues] = useState([
    { column: 'population', comparison: 'maior que', value: 0 },
  ]);
  const [wasPreviouslyFiltered, setWasPreviouslyFiltered] = useState(false);
  const [selectOptions, setSelectOptions] = useState(['population',
    'orbital_period', 'diameter', 'rotation_period', 'surface_water']);
  const [appliedColumns, setAppliedColumns] = useState([]);
  const [order, setOrder] = useState({ column: 'population', sort: 'ASC' });

  const ascSort = (column) => {
    const dontChange = -1;
    const sortedPlanets = planets.sort((a, b) => {
      if (a[column] === 'unknown') return 1;
      if (b[column] === 'unknown') return dontChange;
      if ((a[column] - b[column]) <= 0) return dontChange;
      return 1;
    });
    setPlanets(sortedPlanets);
    setPlanetsToBeFiltered(sortedPlanets);
    setFilteredPlanetsState(sortedPlanets);
  };

  const descSort = (column) => {
    const dontChange = -1;
    const sortedPlanets = planets.sort((a, b) => {
      if (a[column] === 'unknown') return 1;
      if (b[column] === 'unknown') return dontChange;
      if ((a[column] - b[column]) <= 0) return 1;
      return dontChange;
    });
    setPlanets(sortedPlanets);
    setPlanetsToBeFiltered(sortedPlanets);
    setFilteredPlanetsState(sortedPlanets);
  };

  const sortPlanets = () => {
    const { column, sort } = order;
    if (sort === 'ASC') {
      ascSort(column);
    }
    if (sort === 'DESC') {
      descSort(column);
    }
  };

  const deleteAllFilters = () => {
    setPlanets(planetsToBeFiltered);
    setSelectOptions(['population',
      'orbital_period', 'diameter', 'rotation_period', 'surface_water']);
    setAppliedColumns([]);
    setWasPreviouslyFiltered(false);
  };

  const deleteFilter = (currentColumn) => {
    const remainingColumns = appliedColumns
      .filter((filter) => filter.column !== currentColumn);

    if (remainingColumns.length > 0) {
      const newFilters = remainingColumns.map(({ column, comparison, value }) => {
        const newNumericFilter = planetsToBeFiltered.filter((planet) => {
          switch (comparison) {
          case 'maior que':
            return (planet[column]) > Number(value);
          case 'menor que':
            return (planet[column]) < Number(value);
          default: return Number(planet[column]) === Number(value);
          }
        });
        return newNumericFilter;
      });
      const spreadFilters = [...newFilters];
      spreadFilters[0].forEach((filters) => JSON.stringify(filters));
      const planetSet = new Set(spreadFilters[0]);
      const setSpread = [...planetSet];
      setSelectOptions([...selectOptions, currentColumn]);
      setAppliedColumns(remainingColumns);
      setPlanets(setSpread);
    } else {
      setPlanets(planetsToBeFiltered);
      setSelectOptions([...selectOptions, currentColumn]);
      setAppliedColumns(remainingColumns);
    }
  };

  const runNumericFilter = () => {
    const { column, comparison, value } = filterByNumericValues[0];
    const numericFilter = planets.filter((planet) => {
      switch (comparison) {
      case 'maior que':
        return Number(planet[column]) > Number(value);
      case 'menor que':
        return Number(planet[column]) < Number(value);
      default: return Number(planet[column]) === Number(value);
      }
    });
    const optionsLeft = selectOptions.filter((option) => option !== column);
    setSelectOptions(optionsLeft);
    setFilterByNumericValues([{ ...filterByNumericValues[0], column: optionsLeft[0] }]);
    setAppliedColumns([...appliedColumns, { column, comparison, value }]);
    setPlanets(numericFilter);
    setFilteredPlanetsState(numericFilter);
    setWasPreviouslyFiltered(true);
  };

  useEffect(() => {
    if (wasPreviouslyFiltered) {
      const filteredPlanets = filteredPlanetsState
        .filter((planet) => planet.name.includes(filterByName.name));
      setPlanets(filteredPlanets);
    } else {
      const filteredPlanets = planetsToBeFiltered
        .filter((planet) => planet.name.includes(filterByName.name));
      setPlanets(filteredPlanets);
    }
  }, [filterByName, planetsToBeFiltered, filteredPlanetsState, wasPreviouslyFiltered]);

  useEffect(() => {
    async function getPlanetsFromAPI() {
      const response = await fetch(URL);
      const JSONresponse = await response.json();
      const filteredResults = JSONresponse.results;
      const magicNumber = -1;

      filteredResults.forEach((planet) => delete planet.residents);
      const headers = Object.keys(filteredResults[0]);
      filteredResults.sort((a, b) => {
        if (a.name > b.name) return 1;
        return magicNumber;
      });
      setPlanets(filteredResults);
      setPlanetsToBeFiltered(filteredResults);
      setTableHeaders(headers);
    }
    getPlanetsFromAPI();
  }, []);

  const initialState = {
    planets,
    tableHeaders,
    setFilterByName,
    filterByName,
    filterByNumericValues,
    setFilterByNumericValues,
    runNumericFilter,
    selectOptions,
    appliedColumns,
    deleteFilter,
    deleteAllFilters,
    setOrder,
    order,
    sortPlanets,
  };
  return (
    <Context.Provider value={ initialState }>
      {children}
    </Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Provider;
