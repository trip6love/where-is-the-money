// DB CONNECTION //
let db;
const request = indexedDB.open('where_is_the_money', 1);

// ONLY WHEN DB VERSION CHANGES //
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget_item', { autoIncrement: true });
};

// REQUEST SUCCESS //
request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.online) {
        uploadBudget();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode)
};

function recordSave(record) {
    const trans = db.transaction(['new_budget_item'], 'readwrite');

    const budgetObjStore = trans.objectStore('new_budget_item');
    // ADD TO OBJECT STORE //
    budgetObjStore.add(record)
}

function uploadBudget() {
    const trans = db.transaction(['new_budget_item'], 'readwrite');

    const budgetObjStore = trans.objectStore('new_budget_item');

    const getAll = budgetObjStore.getAll();
    // WHEN SUCCESSFUL THIS WILL EXECUTE //
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const trans = db.transaction(['new_budget_item'], 'readwrite');

                    const budgetObjStore = trans.objectStore('new_budget_item');

                    budgetObjStore.clear();

                    alert('All saved items have been submitted')
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}
window.addEventListener('online', uploadBudget);

