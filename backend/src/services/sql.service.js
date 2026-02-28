const sql = require("mssql");

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  port: parseInt(process.env.SQL_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function connect() {
  try {
    return await sql.connect(sqlConfig);
  } catch (err) {
    // If already connected, just return the instance
    if (err.code === 'EALREADYCONNECTED') return sql;
    console.error("SQL Connection Error:", err);
    throw err;
  }
}

// ================== USERS ==================
async function insertUser(user) {
  await connect();
  await sql.query`
    INSERT INTO Users (nId, nName, nEmail, nPassword, dtCreatedAt, dtUpdatedAt)
    VALUES (${user._id.toString()}, ${user.name}, ${user.email}, ${user.password}, ${user.createdAt}, ${user.updatedAt})
  `;
}

async function updateUser(user) {
  await connect();
  await sql.query`
    UPDATE Users 
    SET nName = ${user.name}, nEmail = ${user.email}, dtUpdatedAt = ${new Date()}
    WHERE nId = ${user._id.toString()}
  `;
}

async function deleteUser(userId) {
  await connect();
  await sql.query`DELETE FROM Users WHERE nId = ${userId.toString()}`;
}

// ================== INCOME ==================
async function insertIncome(income) {
  await connect();
  await sql.query`
    INSERT INTO Incomes (nId, nUserId, nSource, dAmount, dtDate, iMonth, iYear, dtCreatedAt, dtUpdatedAt)
    VALUES (${income._id.toString()}, ${income.userId.toString()}, ${income.source}, ${income.amount}, ${income.date}, ${income.month}, ${income.year}, ${income.createdAt}, ${income.updatedAt})
  `;
}

async function updateIncome(income) {
  await connect();
  await sql.query`
    UPDATE Incomes 
    SET nSource = ${income.source}, dAmount = ${income.amount}, dtDate = ${income.date}, 
        iMonth = ${income.month}, iYear = ${income.year}, dtUpdatedAt = ${new Date()}
    WHERE nId = ${income._id.toString()}
  `;
}

async function deleteIncome(incomeId) {
  await connect();
  await sql.query`DELETE FROM Incomes WHERE nId = ${incomeId.toString()}`;
}

// ================== EXPENSE ==================
async function insertExpense(expense) {
  await connect();
  await sql.query`
    INSERT INTO Expenses (nId, nUserId, dAmount, nCategory, nDescription, dtDate, iMonth, iYear, dtCreatedAt, dtUpdatedAt)
    VALUES (${expense._id.toString()}, ${expense.userId.toString()}, ${expense.amount}, ${expense.category}, ${expense.description}, ${expense.date}, ${expense.month}, ${expense.year}, ${expense.createdAt}, ${expense.updatedAt})
  `;
}

async function updateExpense(expense) {
  await connect();
  await sql.query`
    UPDATE Expenses 
    SET dAmount = ${expense.amount}, nCategory = ${expense.category}, nDescription = ${expense.description}, 
        dtDate = ${expense.date}, iMonth = ${expense.month}, iYear = ${expense.year}, dtUpdatedAt = ${new Date()}
    WHERE nId = ${expense._id.toString()}
  `;
}

async function deleteExpense(expenseId) {
  await connect();
  await sql.query`DELETE FROM Expenses WHERE nId = ${expenseId.toString()}`;
}

module.exports = {
  insertUser, updateUser, deleteUser,
  insertIncome, updateIncome, deleteIncome,
  insertExpense, updateExpense, deleteExpense
};