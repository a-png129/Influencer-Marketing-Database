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

async function findTables() {
    const response = await fetch('/table-names', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableNames = responseData.data;
   // console.log(tableNames);
    
    const optionElement = document.getElementById('tableOptions');

    tableNames.forEach((opt) => {
        optionElement.add(new Option(text = opt, value = opt));
    });

    optionElement.addEventListener("change", findAttributes);
}


async function findAttributes() {
    //initialization
    const buttonElement = document.getElementById("prjSubmitButton");
    buttonElement.disabled = true;
     const tableHeaderElement = document.getElementById("prjHeaderRow");
    tableHeaderElement.innerHTML = '';
    const tableElement = document.getElementById('prjTable');
    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    //finding attributes
    const optionElement = document.getElementById('tableOptions');
    const tableName = optionElement.value;
    console.log(tableName);

    const response = await fetch(`/table-attributes/${tableName}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const attributes = responseData.data;

    const checkBoxElement = document.getElementById("projectionAttribute");

    checkBoxElement.innerHTML = '';

    //console.log(attributes);

    //populate the checkbox options
    attributes.forEach((att) => {
        const input = document.createElement("input");
        const lb = document.createElement("label");
        input.type = "checkbox";
        input.value = att;
        lb.for = input.id;
        lb.textContent = att;
        checkBoxElement.appendChild(input);
        checkBoxElement.appendChild(lb);
    });

    checkBoxElement.addEventListener("change", checkProjectionInput);
}

async function checkProjectionInput(event) {
    console.log("change happend");
    const buttonElement = document.getElementById("prjSubmitButton");
    const checkBoxElement = document.getElementById(
        "projectionAttribute"
    ).querySelectorAll('input:checked');

    buttonElement.disabled = checkBoxElement.length == 0;
}

async function projection(event) {
    event.preventDefault();

    const optionElement = document.getElementById('tableOptions');
    const tableName = optionElement.value;
    const checkBoxElement = document.getElementById(
        "projectionAttribute"
    ).querySelectorAll('input:checked');

    var columns = "";
    checkBoxElement.forEach((e)=>{
        console.log(e.value);
        columns = columns + e.value + ", "
    });
    columns = columns.slice(0, -2);

    const response = await fetch(`/projection-table/${tableName}/${columns}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const prjTable = responseData.data;

    const tableHeaderElement = document.getElementById("prjHeaderRow");
    tableHeaderElement.innerHTML = '';
    const tableElement = document.getElementById('prjTable');
    const tableBody = tableElement.querySelector('tbody');
    tableBody.innerHTML = '';

    checkBoxElement.forEach((e2)=>{
        console.log(e2.value);
        const thElement = document.createElement("th");
        thElement.textContent = e2.value;
        tableHeaderElement.appendChild(thElement);
    });

    prjTable.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

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
                    <input type="text" class="value" placeholder="Enter value">
                    <button type="button" class="removeConditionBtn">−</button>`;
    document.getElementById('conditionContainer').appendChild(row);
    row.querySelector('.removeConditionBtn').addEventListener('click', () => {
        row.remove();
    });
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
    const tableElement = document.getElementById("FilteredInfluencer");
    tableElement.style.visibility = "visible";
    const tbody = tableElement.querySelector('tbody');
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
                    <input type="text" class="value" placeholder="Enter value">
                    <button type="button" class="removeConditionBtnOR">−</button>`;
    document.getElementById('conditionContainerOR').appendChild(row);
    row.querySelector('.removeConditionBtnOR').addEventListener('click', () => {
        row.remove();
    });
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
    const tableElement = document.getElementById("FilteredInfluencerOR");
    tableElement.style.visibility = "visible";
    const tbody = tableElement.querySelector('tbody');
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
    findTables();
    
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("projection").addEventListener("submit", projection);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayCompanyOptions();
    fetchAndDisplayPostOptions();
    fetchAndDisplayBrandDealOptions(); 
}
