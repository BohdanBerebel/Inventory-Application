const pool = require("./createTable");

const createTables = `
CREATE TABLE IF NOT EXISTS cars 
(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
brand VARCHAR (100),
model VARCHAR (100),
wheels INT,
release DATE);

CREATE TABLE IF NOT EXISTS phones 
(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
brand VARCHAR (100),
model VARCHAR (100),
buttons INT,
release DATE);
`;

async function initialize() {
  await pool.query(createTables);
  await pool.query(
    `INSERT INTO cars (brand, model, wheels, release) VALUES ($1, $2, $3, $4);`,
    ["BMW", "X5", 4, "2015-01-01"]
  );
  await pool.query(
    `INSERT INTO phones (brand, model, buttons, release) VALUES ($1, $2, $3, $4);`,
    ["Nokia", "3310", 15, "2005-01-01"]
  );
}

// initialize();

async function getAllEntriesOfTable(table) {
  const { rows } = await pool.query(`SELECT * FROM ${table}`);
  return rows;
}

async function getTableNames() {
  const { rows } = await pool.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
`);
  return rows.map((item) => item.table_name);
}

async function getColumns(table) {
  const { rows } = await pool.query(`SELECT column_name
  FROM information_schema.columns
  WHERE table_name = '${table}'
  AND table_schema = 'public';`);
  return rows.map((item) => item.column_name).splice(1);
}

async function addNewItem(tableName, properties) {
  try {
    const columnsArr = [];
    const values = [];
    for (let [column, value] of Object.entries(properties)) {
      columnsArr.push(column);
      values.push(value);
    }
    let valuesString = [];
    for (let i = 1; i <= values.length; i++) {
      valuesString.push(`$${i}`);
    }
    valuesString = valuesString.join(", ");
    const columnsStr = columnsArr.join(", ");
    await pool.query(
      `INSERT INTO ${tableName} (${columnsStr}) VALUES (${valuesString})`,
      values
    );
  } catch (err) {
    console.log(err);
  }
}

async function deleteSection(name) {
  await pool.query(`DROP TABLE IF EXISTS ${name}`);
}
async function deleteItem(sectionName, itemID) {
  await pool.query(`DELETE FROM ${sectionName} WHERE id = ${itemID}`);
}

async function createNewTable(name, values) {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS ${name} (${values});`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createNewTable,
  deleteSection,
  deleteItem,
  getAllEntriesOfTable,
  getTableNames,
  addNewItem,
  getColumns,
};
