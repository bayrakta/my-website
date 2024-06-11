/*
 * Spreadsheet Block
 * Include content on a page as a spreadsheet.
 * https://www.aem.live/developer/block-collection/spreadsheet
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

/**
 * Loads a spreadsheet.
 * @param {string} path The path to the spreadsheet
 * @returns {HTMLElement} The root element of the spreadsheet
 */
export async function loadSpreadsheet(block, path) {
  if (path) {
    fetch(path)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return {};
      })
      .then((json) => {
        if (!json || !json.data || json.data.length === 0) {
          return null;
        }

        const colNames = {};
        const firstRow = json.data[0];
        Object.keys(firstRow).forEach((colName) => {
          colNames[colName] = colName;
        });

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const header = !block.classList.contains('no-header');
        if (header) {
          table.append(thead);

          const rowElement = document.createElement('tr');
          Object.keys(colNames).forEach((colName) => {
            const cell = buildCell(0);
            cell.innerHTML = colName;
            rowElement.append(cell);
          });
          thead.append(rowElement);
        }
        table.append(tbody);

        json.data
          .forEach((row, i) => {
            const rowElement = document.createElement('tr');
            Object.keys(colNames).forEach((colName) => {
              const cell = buildCell(i + 1);
              cell.innerHTML = row[colName];
              rowElement.append(cell);
            });
            tbody.append(rowElement);
          });

        return table;
      })
      .catch(() => null);
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  // const path = block.textContent.trim();
  const spreadsheet = await loadSpreadsheet(block, path);
  if (spreadsheet) {
    block.innerHTML = '';
    block.append(spreadsheet);
  }
}
