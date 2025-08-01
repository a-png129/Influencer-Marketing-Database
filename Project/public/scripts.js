/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the Account and displays it.
async function fetchAndDisplayAccounts() {

    const tableElement = document.getElementById('Account');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/account', {
        method: 'GET'
    });

    const responseData = await response.json();
    const accountContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    accountContent.forEach(account => {
        const row = tableBody.insertRow();
        account.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// fetch from account and display it
async function fetchAndDisplayInfluencers() {

    const tableElement = document.getElementById('Influencer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/influencer', {
        method: 'GET'
    });

    const responseData = await response.json();
    const influencerContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    influencerContent.forEach(account => {
        const row = tableBody.insertRow();
        account.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// // This function resets or initializes the demotable.
// async function resetDemotable() {
//     const response = await fetch("/initiate-demotable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();

//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "demotable initiated successfully!";
//         fetchTableData();
//     } else {
//         alert("Error initiating table!");
//     }
// }

// Inserts new records into the Account.
async function insertAccount(event) {
    event.preventDefault();

    const usernameVal = document.getElementById('insertUsername').value;
    const platformVal = document.getElementById('insertPlatform').value;
    const influencerIDVal = document.getElementById('insertInfluencerID').value;
    const followersVal = document.getElementById('insertFollowerCount').value;
    const activationDateVal = document.getElementById('insertActDate').value;

    const response = await fetch('/insert-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameVal,
            platform: platformVal,
            influencer: influencerIDVal,
            followers: followersVal,
            date: activationDateVal
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function deleteInfluencer(event) {
    event.preventDefault();
    const influencerID = document.getElementById('deleteID').value;

    const response = await fetch(`/delete-influencer/${influencerID}`, {
        method: 'DELETE'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMessage');
    messageElement.style.visibility = "visible";
    if (responseData.success) {
        messageElement.textContent = "Data deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = `Error: ${responseData.message}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000)
}

// // Updates names in the demotable.
// async function updateNameDemotable(event) {
//     event.preventDefault();

//     const oldNameValue = document.getElementById('updateOldName').value;
//     const newNameValue = document.getElementById('updateNewName').value;

//     const response = await fetch('/update-name-demotable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             oldName: oldNameValue,
//             newName: newNameValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateNameResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Name updated successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error updating name!";
//     }
// }

// // Counts rows in the demotable.
// // Modify the function accordingly if using different aggregate functions or procedures.
// async function countDemotable() {
//     const response = await fetch("/count-demotable", {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('countResultMsg');

//     if (responseData.success) {
//         const tupleCount = responseData.count;
//         messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
//     } else {
//         alert("Error in count demotable!");
//     }
// }

document.getElementById('addConditionBtn').addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'condition-row';
    row.innerHTML = `
<select class="attribute">
                        <option value="influencerID">Influencer ID</option>
                        <option value="influencerName">Influencer Name</option>
                        <option value="location">Location</option>
                        <option value="age">Age</option>
                        <option value="niche">Niche</option>
                    </select>
                    <select class="operator">
                        <option value="=">=</option>
                        <option value="<"><</option>
                        <option value=">">></option>
                        <option value="LIKE">LIKE</option>
                    </select>
                    <input type="text" class="value" placeholder="Enter value">`;
    document.getElementById('conditionContainer').appendChild(row);
});

document.getElementById('filterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const filters = [];
    document.querySelectorAll('#conditionContainer .condition-row').forEach(row => {
        filters.push({
            attr: row.querySelector('.attribute').value,
            op: row.querySelector('.operator').value,
            val: row.querySelector('.value').value,
        });
    });
    const res = await fetch('/filter-influencer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
    });
    const data = await res.json();
    const tbody = document.getElementById('FilteredInfluencer').querySelector('tbody');
    tbody.innerHTML = '';
    data.data.forEach(row => {
        const tr = tbody.insertRow();
        row.forEach(cell => tr.insertCell().textContent = cell);
    });
});

document.getElementById('addConditionBtnOR').addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'condition-row';
    row.innerHTML = `
<select class="attribute">
                        <option value="influencerID">Influencer ID</option>
                        <option value="influencerName">Influencer Name</option>
                        <option value="location">Location</option>
                        <option value="age">Age</option>
                        <option value="niche">Niche</option>
                    </select>
                    <select class="operator">
                        <option value="=">=</option>
                        <option value="<"><</option>
                        <option value=">">></option>
                        <option value="LIKE">LIKE</option>
                    </select>
                    <input type="text" class="value" placeholder="Enter value">`;
    document.getElementById('conditionContainerOR').appendChild(row);
});

document.getElementById('filterFormOR').addEventListener('submit', async (e) => {
    e.preventDefault();
    const filters = [];
    document.querySelectorAll('#conditionContainerOR .condition-row').forEach(row => {
        filters.push({
            attr: row.querySelector('.attribute').value,
            op: row.querySelector('.operator').value,
            val: row.querySelector('.value').value,
        });
    });
    const res = await fetch('/filter-influencer-or', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
    });
    const data = await res.json();
    const tbody = document.getElementById('FilteredInfluencerOR').querySelector('tbody');
    tbody.innerHTML = '';
    data.data.forEach(row => {
        const tr = tbody.insertRow();
        row.forEach(cell => tr.insertCell().textContent = cell);
    });
});

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertAccount").addEventListener("submit", insertAccount);
    document.getElementById("deleteInfluencer").addEventListener("submit", deleteInfluencer)
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayAccounts();
    fetchAndDisplayInfluencers();
}
