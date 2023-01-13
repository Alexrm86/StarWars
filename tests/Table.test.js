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

  it('Testa se a API foi chamada, e se os planetas estão na tela', async () => {
    render(<App />);
    const URL = 'https://swapi-trybe.herokuapp.com/api/planets/';
    await waitFor(() => {
      testData.results.forEach((planet) => {
        expect(screen.getByRole('cell', { name: planet.name })).toBeInTheDocument();
      });
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(URL);
    });
  });

  it('Checa se a tabela possui 13 colunas', async () => {
    render(<App />);
    const mapHeaders = [
      "name",
      "rotation_period",
      "orbital_period",
      "diameter",
      "climate",
      "gravity",
      "terrain",
      "surface_water",
      "population",
      "films",
      "created",
      "edited",
      "url"
    ] 
    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(13);
      mapHeaders.forEach((th) => expect(screen.getByRole('columnheader', {name: th})).toBeInTheDocument());
    });
    
  })
})

describe('Testa o filtro de texto da tabela', () => {
  beforeEach(mockFetch);
  afterEach(() => jest.clearAllMocks());

  it('Filtra os planetas que possuem O nome', async () => {
    render(<App />);
    const inputSearch = screen.getByRole('textbox', {name: 'Nome do Planeta:'});
    expect(inputSearch).toBeInTheDocument();
    userEvent.type(inputSearch, 'o');
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(7);
    })
  })

  it('Filtra os planetas que possuem OO nome', async () => {
    render(<App />);
    const inputSearch = screen.getByRole('textbox', {name: 'Nome do Planeta:'});
    expect(inputSearch).toBeInTheDocument();
    userEvent.type(inputSearch, 'oo');
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(2);
    })
  })

  it('Filtra outras coisas aleatórias', async () => {
    render(<App />);
    const inputSearch = screen.getByRole('textbox', {name: 'Nome do Planeta:'});
    expect(inputSearch).toBeInTheDocument();
    userEvent.type(inputSearch, 'Tatooine');
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(1);
    })
    userEvent.clear(inputSearch);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(10);
    })
  })

})

describe('Testa os filtros numéricos', () => {
  beforeEach(mockFetch);
  afterEach(() => jest.clearAllMocks());

  it('Renderiza os filtros de Coluna, comparação, valor, botão de filtrar, e os valores iniciais', () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });

    const elementsToBeChecked = [columnFilter, comparisonFilter, valueFilter, filterButton];

    elementsToBeChecked.forEach((element) => expect(element).toBeInTheDocument());
    expect(columnFilter).toHaveValue('population');
    expect(comparisonFilter).toHaveValue('maior que');
    expect(valueFilter).toHaveValue(0);
  })

  it('Verifica se é possível modificar a opção das colunas, comparação e valor', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    userEvent.selectOptions(columnFilter, 'diameter');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('diameter');
    })
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    userEvent.selectOptions(comparisonFilter, 'menor que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('menor que');
    })
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '10');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(10);
    })
  })

  it('Verifica se o Filtro funciona, e se o botão de deletar um filtro funciona', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    
    userEvent.selectOptions(columnFilter, 'rotation_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('rotation_period');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '25');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(25);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(2);
    })
    const deleteFilter = screen.getByRole('button', {name: /Delete Filter/i});
    userEvent.click(deleteFilter);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(10);
    })
  });

  it('Verifica se o botão de remover todas as filtragens funciona', async () => {
    render(<App />);
    const columnFilter = screen.getByRole('combobox', { name: /Coluna/i });
    const comparisonFilter = screen.getByRole('combobox', { name: /Comparação/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /Valor/i });
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    const deleteAllFilters = screen.getByTestId('button-remove-filters');
    
    userEvent.selectOptions(columnFilter, 'rotation_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('rotation_period');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '25');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(25);
    });
    userEvent.click(filterButton);

    userEvent.selectOptions(columnFilter, 'orbital_period');
    await waitFor(() => {
      expect(columnFilter).toHaveValue('orbital_period');
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    await waitFor(() => {
      expect(comparisonFilter).toHaveValue('maior que');
    });
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '400');
    await waitFor(() => {
      expect(valueFilter).toHaveValue(400);
    });
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(1);
    })
    userEvent.click(deleteAllFilters);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')).toHaveLength(10);
    })

  })

  it('Testa se os botões de ascendente e descendente funcionam', async () => {
    render(<App />);
    const columnSort = screen.getByTestId('column-sort');
    const sortAsc = screen.getByTestId('column-sort-input-asc');
    const sortDesc = screen.getByTestId('column-sort-input-desc');
    const submitSort = screen.getByRole('button', { name: /Submeter ordenação/i })
    userEvent.selectOptions(columnSort, 'diameter');
    await waitFor(() => {
      expect(columnSort).toHaveValue('diameter');
    });
    userEvent.click(sortAsc);
    userEvent.click(submitSort);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Endor');
    });
    userEvent.click(sortDesc);
    userEvent.click(submitSort);
    await waitFor(() => {
      expect(screen.getAllByTestId('planet-name')[0]).toHaveTextContent('Bespin');
    });
  });
});
