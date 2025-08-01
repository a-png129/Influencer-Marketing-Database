const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchAccountFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Account');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchInfluencerFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Influencer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchBrandDealFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BrandDealOne');
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function fetchCompanyFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM SponsorCompany');
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function fetchPostFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PostOne');
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function deleteInfluencer(deleteID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Influencer WHERE influencerID = :deleteID ',
            [deleteID],
            { autoCommit: true }
        );

        if (result.rowsAffected == 0) {
            return {
                success: false,
                message: `Cannot delete the influencer with ID ${deleteID}.
                Please re-check if the ID entered is valid or not.`
            };
        }
        return { success: true, message: null };

    }).catch((error) => {
        jsonResult = { success: false, message: error.message };
        return jsonResult;
    });
}

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

async function insertAccount(username, platform, influencer, followers, actDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Account (username, platformName, influencerID, followerCount, activationDate) 
            VALUES (:username, :platform, :influencer, :followers, TO_DATE(:actDate, 'yyyy-mm-dd'))`,
            [username, platform, influencer, followers, actDate],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateBrandDeal(brandDealID, adType, paymentRate, companyID, postID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'UPDATE BrandDealOne SET adType=:adType, paymentRate=:paymentRate, companyID=:companyID, postID=:postID WHERE brandDealID=:brandDealID',
            [adType, paymentRate, companyID, postID, brandDealID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }


async function filterInfluencer(filters) {
    return await withOracleDB(async (connection) => {
        if (!filters || filters.length === 0) {
            const result = await connection.execute('SELECT * FROM Influencer');
            return result.rows;
        }
        const whereClauses = [];
        const bindValues = {};
        filters.forEach((f, index) => {
            const key = `vals${index}`;
            const clause = f.op === 'LIKE'
                ? `${f.attr} LIKE :${key}`
                : `${f.attr} ${f.op} :${key}`;
            bindValues[key] = ['age', 'influencerID'].includes(f.attr)
                ? Number(f.val)
                : (f.op === 'LIKE' ? `%${f.val}%` : f.val);
            if (index ===0) {
                whereClauses.push(clause);
            } else {
                const conj=f.conj?.toUpperCase()==='OR'?'OR':'AND';
                whereClauses.push(`${conj} ${clause}`);
            }
        });
        const query = `SELECT * FROM Influencer WHERE ${whereClauses.join(' ')}`;
        console.log("Query:", query);
        console.log("Bind values:", bindValues);
        const result = await connection.execute(query, bindValues);
        return result.rows;
    }).catch((err) => {
        console.error(err);

async function fetchTableNamesFromDB() {
     return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT table_name FROM user_tables');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAttributeNameFromTable(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT column_name FROM USER_TAB_COLUMNS WHERE table_name =:tableName',
            [tableName]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchProjectionTableFromDB(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${attributes} FROM ${tableName}`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function filterInfluencerOr(filters) {
    return await withOracleDB(async (connection) => {
        if (!filters || filters.length === 0) {
            const result = await connection.execute('SELECT * FROM Influencer');
            return result.rows;
        }
        const whereClauses = [];
        const bindValues = {};
        filters.forEach((f, index) => {
            const key = `vals${index}`;
            const clause = f.op === 'LIKE'
                ? `${f.attr} LIKE :${key}`
                : `${f.attr} ${f.op} :${key}`;
            bindValues[key] = ['age', 'influencerID'].includes(f.attr)
                ? Number(f.val)
                : (f.op === 'LIKE' ? `%${f.val}%` : f.val);
            if (index ===0) {
                whereClauses.push(clause);
            } else {
                const conj=f.conj?.toUpperCase()==='OR'?'OR':'OR';
                whereClauses.push(`${conj} ${clause}`);
            }
        });
        const query = `SELECT * FROM Influencer WHERE ${whereClauses.join(' ')}`;
        console.log("Query:", query);
        console.log("Bind values:", bindValues);
        const result = await connection.execute(query, bindValues);
        return result.rows;
    }).catch((err) => {
        console.error(err);

async function fetchJoinedTable(productionCost) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT BrandDealOne.adType, PostOne.productionCost
             FROM BrandDealOne, PostOne
             WHERE BrandDealOne.postID = PostOne.postID AND PostOne.productionCost > ${productionCost}`
        );
        return result.rows;
    }).catch(() => {

        return [];
    });
}

module.exports = {
    testOracleConnection,
    fetchAccountFromDb,
    fetchInfluencerFromDb,
    fetchBrandDealFromDb,
    fetchCompanyFromDb,
    fetchPostFromDb,
    deleteInfluencer,
    fetchTableNamesFromDB,
    fetchAttributeNameFromTable,
    fetchProjectionTableFromDB,
    fetchJoinedTable,
    // initiateDemotable, 
    insertAccount,
    // updateNameDemotable, 
    insertAccount, 
    updateBrandDeal, 
    // countDemotable
    filterInfluencer,
    filterInfluencerOr
};