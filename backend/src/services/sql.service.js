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

// Helper to execute SQL safely without crashing the main app
async function safeSql(operation) {
  try {
    // Skip if no SQL server configured
    if (!process.env.SQL_SERVER) return;
    
    await connect();
    await operation();
  } catch (err) {
    // Log error but do not throw, ensuring MongoDB operations succeed
    console.warn("⚠️ SQL Analytics Sync Failed:", err.message);
  }
}

async function connect() {
  try {
    return await sql.connect(sqlConfig);
  } catch (err) {
    // If already connected, just return the instance
    if (err.code === 'EALREADYCONNECTED') return sql;
    throw err; // safeSql will catch this
  }
}

// ================== USERS ==================
async function insertUser(user) {
  await safeSql(async () => {
    await sql.query`
      INSERT INTO Users (nId, nName, nEmail, nPassword, dtCreatedAt, dtUpdatedAt)
      VALUES (${user._id.toString()}, ${user.name}, ${user.email}, ${user.password}, ${user.createdAt}, ${user.updatedAt})
    `;
  });
}

async function updateUser(user) {
  await safeSql(async () => {
    await sql.query`
      UPDATE Users 
      SET nName = ${user.name}, nEmail = ${user.email}, dtUpdatedAt = ${new Date()}
      WHERE nId = ${user._id.toString()}
    `;
  });
}

async function deleteUser(userId) {
  await safeSql(async () => {
    await sql.query`DELETE FROM Users WHERE nId = ${userId.toString()}`;
  });
}

// ================== INCOME ==================
async function insertIncome(income) {
  await safeSql(async () => {
    await sql.query`
      INSERT INTO Incomes (nId, nUserId, nSource, dAmount, dtDate, iMonth, iYear, dtCreatedAt, dtUpdatedAt)
      VALUES (${income._id.toString()}, ${income.userId.toString()}, ${income.source}, ${income.amount}, ${income.date}, ${income.month}, ${income.year}, ${income.createdAt}, ${income.updatedAt})
    `;
  });
}

async function updateIncome(income) {
  await safeSql(async () => {
    await sql.query`
      UPDATE Incomes 
      SET nSource = ${income.source}, dAmount = ${income.amount}, dtDate = ${income.date}, 
          iMonth = ${income.month}, iYear = ${income.year}, dtUpdatedAt = ${new Date()}
      WHERE nId = ${income._id.toString()}
    `;
  });
}

async function deleteIncome(incomeId) {
  await safeSql(async () => {
    await sql.query`DELETE FROM Incomes WHERE nId = ${incomeId.toString()}`;
  });
}

// ================== EXPENSE ==================
async function insertExpense(expense) {
  await safeSql(async () => {
    await sql.query`
      INSERT INTO Expenses (nId, nUserId, dAmount, nCategory, nDescription, dtDate, iMonth, iYear, dtCreatedAt, dtUpdatedAt)
      VALUES (${expense._id.toString()}, ${expense.userId.toString()}, ${expense.amount}, ${expense.category}, ${expense.description}, ${expense.date}, ${expense.month}, ${expense.year}, ${expense.createdAt}, ${expense.updatedAt})
    `;
  });
}

async function updateExpense(expense) {
  await safeSql(async () => {
    await sql.query`
      UPDATE Expenses 
      SET dAmount = ${expense.amount}, nCategory = ${expense.category}, nDescription = ${expense.description}, 
          dtDate = ${expense.date}, iMonth = ${expense.month}, iYear = ${expense.year}, dtUpdatedAt = ${new Date()}
      WHERE nId = ${expense._id.toString()}
    `;
  });
}

async function deleteExpense(expenseId) {
  await safeSql(async () => {
    await sql.query`DELETE FROM Expenses WHERE nId = ${expenseId.toString()}`;
  });
}

module.exports = {
  insertUser, updateUser, deleteUser,
  insertIncome, updateIncome, deleteIncome,
  insertExpense, updateExpense, deleteExpense
};