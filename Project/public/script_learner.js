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

    influencerContent.forEach(influencer => {
        const row = tableBody.insertRow();
        influencer.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from Brand Deal and displays it.
async function fetchAndDisplayBrandDeals() {

    const tableElement = document.getElementById('BrandDeal');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/brandDeal', {
        method: 'GET'
    });

    const responseData = await response.json();
    const brandDealContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    brandDealContent.forEach(deal => {
        const row = tableBody.insertRow();
        deal.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from BrandDealOne and displays it as dropdown options.
async function fetchAndDisplayBrandDealOptions() {

    const dropdown = document.getElementById('brandDealIDs');

    try {
        const response = await fetch('/brandDeal', {
            method: 'GET'
        });

        const responseData = await response.json();
        const brandDealContent = responseData.data;

        // Always clear old, already fetched data before new fetching process.
        if (dropdown) {
            dropdown.innerHTML = '';
        }

        // default/placeholder option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an ID';
        dropdown.appendChild(defaultOption);

        brandDealContent.forEach(bd => {
            const option = document.createElement('option');
            option.value = bd[0];
            option.textContent = bd[0];
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch brand deal data:', error);
    }
}

// !! ERROR HANDLING TODO: only display company/post options that are unique
//    b/c of the one-to-one constraint 

// Fetches data from SponsorCompany and displays it as dropdown options.
async function fetchAndDisplayCompanyOptions() {

    const dropdown = document.getElementById('companyIDs');

    try {
        const response = await fetch('/company', {
            method: 'GET'
        });

        const responseData = await response.json();
        const companyContent = responseData.data;

        // Always clear old, already fetched data before new fetching process.
        if (dropdown) {
            dropdown.innerHTML = '';
        }

        // default/placeholder option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an ID';
        dropdown.appendChild(defaultOption);

        companyContent.forEach(company => {
            const option = document.createElement('option');
            option.value = company[0];
            option.textContent = company[0];
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch company data:', error);
    }
}

// Fetches data from PostOne and displays it as dropdown options.
async function fetchAndDisplayPostOptions() {

    const dropdown = document.getElementById('postIDs');

    try {
        const response = await fetch('/post', {
            method: 'GET'
        });

        const responseData = await response.json();
        const postContent = responseData.data;

        // Always clear old, already fetched data before new fetching process.
        if (dropdown) {
            dropdown.innerHTML = '';
        }

        // default/placeholder option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an ID';
        dropdown.appendChild(defaultOption);

        postContent.forEach(post => {
            const option = document.createElement('option');
            option.value = post[0];
            option.textContent = post[0];
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch post data:', error);
    }
}

async function joinTables(event) {
    event.preventDefault();
    const costInputElement = document.getElementById("costThreshold");
    const costThreshold = costInputElement.value;

    const response = await fetch(`/join-table/${costThreshold}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const joinTable = responseData.data;
    const messageElement = document.getElementById('joinResultMessage');
    messageElement.style.visibility = "visible";
    if (responseData.success) {
        if (joinTable && joinTable.length > 0) {
            messageElement.textContent = "Data successfully displayed!";
        } else {
            messageElement.textContent = "No results found.";
        }
    } else {
        messageElement.textContent = `Error: ${responseData.message || "Unable to display data."}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000);
    
    const tableHeaderElement = document.getElementById("joinTable");
    tableHeaderElement.style.visibility = "visible";

    const tableElement = document.getElementById('joinTable');
    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    joinTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function aggregationWithHaving(event) {
    event.preventDefault();
    const engagementInput = document.getElementById("engagementRateInput").value;

    const response = await fetch(`/aggregation-with-having?engagementRate=${engagementInput}`, {
        method: 'GET'
    });

    const responseTable = await response.json();
    const aggregationTable = responseTable.data;

    const messageElement = document.getElementById('aggHavingResultMessage');
    messageElement.style.visibility = "visible";
    if (responseTable.success) {
        if (aggregationTable && aggregationTable.length > 0) {
            messageElement.textContent = "Data successfully displayed!";
        } else {
            messageElement.textContent = "No results found.";
        }
    } else {
        messageElement.textContent = `Error: ${responseTable.message || "Unable to display data."}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000);
    
    const tableElement = document.getElementById("aggWithHavingTable");
    tableElement.style.visibility = "visible";

    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    aggregationTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function nestedAggregation(event) {
    event.preventDefault();

    const response = await fetch('/nested-aggregation', {
        method: 'GET'
    });

    const responseTable = await response.json();
    const aggregationTable = responseTable.data;

    const messageElement = document.getElementById('nestedAggResultMessage');
    messageElement.style.visibility = "visible";
    if (responseTable.success) {
        if (aggregationTable && aggregationTable.length > 0) {
            messageElement.textContent = "Data successfully displayed!";
        } else {
            messageElement.textContent = "No results found.";
        }
    } else {
        messageElement.textContent = `Error: ${responseTable.message || "Unable to display data."}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000);
    
    const tableElement = document.getElementById("nestedAggTable");
    tableElement.style.visibility = "visible";

    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    aggregationTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function groupByAggregation(event) {
    event.preventDefault();

    const response = await fetch('/group-by-aggregation', {
        method: 'GET'
    });

    const responseTable = await response.json();
    const aggregationTable = responseTable.data;
    const messageElement = document.getElementById('groupByAggResultMessage');
    messageElement.style.visibility = "visible";
    if (responseTable.success) {
        if (aggregationTable && aggregationTable.length > 0) {
            messageElement.textContent = "Data successfully displayed!";
        } else {
            messageElement.textContent = "No results found.";
        }
    } else {
        messageElement.textContent = `Error: ${responseTable.message || "Unable to display data."}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000);
    
    const tableElement = document.getElementById("groupByAggTable");
    tableElement.style.visibility = "visible";

    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    aggregationTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function divisionAgg(event) {
    event.preventDefault();
    const response = await fetch('/division-aggregation', {
        method: 'GET'
    });
    const responseTable = await response.json();
    const aggregationTable = responseTable.data;

    const messageElement = document.getElementById('divideAggResultMessage');
    messageElement.style.visibility = "visible";
    if (responseTable.success) {
        if (aggregationTable && aggregationTable.length > 0) {
            messageElement.textContent = "Data successfully displayed!";
        } else {
            messageElement.textContent = "No results found.";
        }
    } else {
        messageElement.textContent = `Error: ${responseTable.message || "Unable to display data."}`;
    }

    setTimeout(() => {
        messageElement.style.visibility = "hidden";
    }, 3000);

    const tableElement = document.getElementById("divisionTable");
    tableElement.style.visibility = "visible";
    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';
    aggregationTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    //fetchTableData();
    //findTables();
    
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("joinQuery").addEventListener("submit", joinTables);
    document.getElementById("aggregationWithHaving").addEventListener("submit", aggregationWithHaving);
    document.getElementById("nestedAggBtn").addEventListener("click", nestedAggregation);
    document.getElementById("groupByAggBtn").addEventListener("click", groupByAggregation);
    document.getElementById("divisionBtn").addEventListener("click", divisionAgg);
    document.getElementById("joinQuery").addEventListener("submit", joinTables);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayAccounts();
//     fetchAndDisplayInfluencers();
//     fetchAndDisplayBrandDeals();
//     fetchAndDisplayCompanyOptions();
//     fetchAndDisplayPostOptions();
//     fetchAndDisplayBrandDealOptions(); 
// }
