import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import testData from './mocks/testData';
import userEvent from '@testing-library/user-event';

const mockFetch = () => {
  jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(testData),
    }));
}
describe('Testa a requisição e o consumo da API', () => {

  beforeEach(mockFetch);
  afterEach(() => jest.clearAllMocks());

  it('Testa quando se utiliza menor que ', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    userEvent.selectOptions(columnFilter, 'surface_water');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('surface_water');
    });
    userEvent.selectOptions(comparisonFilter, 'menor que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('menor que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '25');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(25);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(6);
    })
  })
  it('Testa quando se utiliza igual a ', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    userEvent.selectOptions(columnFilter, 'surface_water');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('surface_water');
    });
    userEvent.selectOptions(comparisonFilter, 'igual a');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('igual a');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '100');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(100);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(2);
    })
  })

  it('Testa apagar apenas 1 de vários filtros ', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    userEvent.selectOptions(columnFilter, 'population');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('population');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '10000');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(10000);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(7);
    })
    userEvent.selectOptions(columnFilter, 'orbital_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('orbital_period');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '500');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(500);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(1);
    })
    const deleteSingleFilter = screen.getAllByRole('button', { name: /Delete Filter/i });
    userEvent.click(deleteSingleFilter[0]);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(3);
    })
  })
  it('Testa mais filtros sobrepostos de forma diferente', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    userEvent.selectOptions(columnFilter, 'population');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('population');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '10000');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(10000);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(7);
    })

    userEvent.selectOptions(columnFilter, 'orbital_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('orbital_period');
    });
    userEvent.selectOptions(comparisonFilter, 'menor que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('menor que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '500');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(500);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(6);
    })
    const deleteSingleFilter = screen.getAllByRole('button', { name: /Delete Filter/i });
    userEvent.click(deleteSingleFilter[0]);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(7);
    })
  })
  it('Testa mais filtros sobrepostos de mais formas diferente', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    userEvent.selectOptions(columnFilter, 'population');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('population');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '10000');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(10000);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(7);
    })

    userEvent.selectOptions(columnFilter, 'orbital_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('orbital_period');
    });
    userEvent.selectOptions(comparisonFilter, 'igual a');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('igual a');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '364');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(364);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(1);
    })
    const deleteSingleFilter = screen.getAllByRole('button', { name: /Delete Filter/i });
    userEvent.click(deleteSingleFilter[0]);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(1);
    })
  })
  it('Checa os planetas que possuem "unknown"', async () => {
    render(<App />);
    const columnSort = screen.getByTestId('column-sort');
    const sortAsc = screen.getByTestId('column-sort-input-asc');
    const sortDesc = screen.getByTestId('column-sort-input-desc');
    const submitSort = screen.getByRole('button', { name: /Submeter ordenação/i })
    userEvent.selectOptions(columnSort, 'population');
    await waitFor(() => {
      expect(columnSort).toHaveValue('population');
    });
    userEvent.click(sortAsc);
    userEvent.click(submitSort);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')[9]).toHaveTextContent('Hoth');
    });
    userEvent.click(sortDesc);
    userEvent.click(submitSort);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')[9]).toHaveTextContent('Hoth');
    });
  })
});