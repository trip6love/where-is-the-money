// DB CONNECTION //
let db;
const request = indexedDB.open('where_is_the_money', 1);

// ONLY WHEN DB VERSION CHANGES //
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_budget_ticket', { autoIncrement: true });
};