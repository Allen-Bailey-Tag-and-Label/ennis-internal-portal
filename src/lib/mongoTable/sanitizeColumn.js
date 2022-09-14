export default (column) => {
  // initialize default column
  const defaultColumn = {
    mask: 'string',
    type: 'string'
  };

  // check if column is string
  if (typeof column === 'string') {
    column = {
      innerHTML: column,
      key: column
    };
  }

  return Object.assign(defaultColumn, column);
};