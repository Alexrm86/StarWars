import React, { useContext } from 'react';
import Context from '../context/Context';

function Table() {
  const { planets, tableHeaders, setFilterByName, filterByName,
    filterByNumericValues, setFilterByNumericValues,
    runNumericFilter, selectOptions,
    appliedColumns, deleteFilter, deleteAllFilters,
    setOrder, order, sortPlanets } = useContext(Context);
  const selectOrder = ['population',
    'orbital_period', 'diameter', 'rotation_period', 'surface_water'];
  return (
    <main>
      <label htmlFor="planetName">
        Nome do Planeta:
        <input
          id="planetName"
          type="text"
          data-testid="name-filter"
          value={ filterByName.name }
          onChange={ (event) => {
            setFilterByName({ name: event.target.value });
          } }
        />
      </label>
      Filtros:
      <div>
        <label htmlFor="selectColumn">
          Coluna
          <select
            id="selectColumn"
            data-testid="column-filter"
            onChange={ (e) => setFilterByNumericValues(
              [{ ...filterByNumericValues[0], column: e.target.value }],
            ) }
            value={ filterByNumericValues.column }
          >
            {selectOptions.map((option) => (
              <option
                value={ option }
                key={ option }
              >
                {option}
              </option>))}
          </select>
        </label>
        <label htmlFor="comparison">
          Comparação
          <select
            id="comparison"
            data-testid="comparison-filter"
            onChange={ (e) => setFilterByNumericValues(
              (prev) => [{ ...prev[0], comparison: e.target.value }],
            ) }
            value={ filterByNumericValues.comparison }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <label htmlFor="value">
          Valor
          <input
            id="value"
            type="number"
            data-testid="value-filter"
            defaultValue="0"
            onChange={ (e) => setFilterByNumericValues(
              (prev) => [{ ...prev[0], value: e.target.value }],
            ) }
            value={ filterByNumericValues.value }
          />
        </label>
      </div>
      <button
        type="button"
        data-testid="button-filter"
        onClick={ () => runNumericFilter() }
      >
        Filtrar

      </button>
      {appliedColumns.map(({ column, comparison, value }) => (
        <p
          key={ column }
          data-testid="filter"
        >
          {`${column} ${comparison} ${value}`}
          <button
            type="button"
            onClick={ () => deleteFilter(column) }
          >
            Delete Filter

          </button>
        </p>
      ))}
      <button
        data-testid="button-remove-filters"
        type="button"
        onClick={ () => deleteAllFilters() }
      >
        Remover todas filtragens

      </button>
      <select
        data-testid="column-sort"
        onChange={ (e) => setOrder({ ...order, column: e.target.value }) }
      >
        {selectOrder.map((option) => (
          <option
            key={ option }
            value={ option }
          >
            {option}
          </option>))}
      </select>
      <label htmlFor="asc">
        Ascendente:
        <input
          id="asc"
          data-testid="column-sort-input-asc"
          type="radio"
          value="ASC"
          name="sort"
          onClick={ (e) => setOrder({ ...order, sort: e.target.value }) }
        />
      </label>
      <label htmlFor="desc">
        Descendente:
        <input
          id="desc"
          data-testid="column-sort-input-desc"
          type="radio"
          value="DESC"
          name="sort"
          onClick={ (e) => setOrder({ ...order, sort: e.target.value }) }
        />
      </label>
      <button
        data-testid="column-sort-button"
        type="button"
        onClick={ () => sortPlanets() }
      >
        Submeter ordenação

      </button>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={ header }>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr key={ planet.name }>
              <td data-testid="planet-name">{planet.name}</td>
              <td>{planet.rotation_period}</td>
              <td>{planet.orbital_period}</td>
              <td>{planet.diameter}</td>
              <td>{planet.climate}</td>
              <td>{planet.gravity}</td>
              <td>{planet.terrain}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
              <td>{planet.films}</td>
              <td>{planet.created}</td>
              <td>{planet.edited}</td>
              <td>{planet.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Table;
