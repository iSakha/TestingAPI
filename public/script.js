const HOST = 'http://127.0.0.1';
// const HOST = 'http://82.209.203.205';
const PORT = 3070;
const URL = HOST + ':' + PORT;
let USER;
let eventLocations = {};
let events = {};
let selectedEventId;
let departments = {};
let equipByCat = {};

console.log({ "login": "john_doe", "pass": "1234" });
console.log({ "login": "test_admin", "pass": "4321" });
console.log({ "login": "just_user", "pass": "1111" });

//********************************************************************************//
//                      Page navigation
//********************************************************************************//
document.getElementById('nav-login').addEventListener('click', (e) => {
    showHideDiv(e.target);
});
document.getElementById('nav-event').addEventListener('click', (e) => {
    showHideDiv(e.target);
});
document.getElementById('nav-equip').addEventListener('click', (e) => {
    showHideDiv(e.target);
    getAllDepartments();
});
document.getElementById('nav-reserve').addEventListener('click', (e) => {
    showHideDiv(e.target);
});

document.getElementById('nav-transfer').addEventListener('click', (e) => {
    showHideDiv(e.target);
    dep = getAllDepartments();

});

function showHideDiv(nav) {
    document.getElementById('login-div').classList.add('d-none');
    document.getElementById('event-div').classList.add('d-none');
    document.getElementById('event-sum-div').classList.add('d-none');
    document.getElementById('event-tbl-div').classList.add('d-none');
    document.getElementById('equipment-div').classList.add('d-none');
    document.getElementById('eqip-header').classList.add('d-none');
    document.getElementById('reservation-div').classList.add('d-none');
    document.getElementById('transfer-div').classList.add('d-none');
    document.getElementById('transfer-header').classList.add('d-none');
    document.getElementById('btn-trans-move').classList.add('d-none');
    document.getElementById('tbl-trans-equip').classList.add('d-none');

    switch (nav.id) {
        case 'nav-login':
            document.getElementById('login-div').classList.remove('d-none');
            break;
        case 'nav-event':
            document.getElementById('event-div').classList.remove('d-none');
            break;
        case 'nav-equip':
            document.getElementById('equipment-div').classList.remove('d-none');
            document.getElementById('eqip-header').classList.remove('d-none');
            break;
        case 'nav-reserve':
            document.getElementById('reservation-div').classList.remove('d-none');
            break;
        case 'nav-transfer':
            document.getElementById('transfer-div').classList.remove('d-none');
            document.getElementById('transfer-header').classList.remove('d-none');
            document.getElementById('btn-trans-move').classList.remove('d-none');
            document.getElementById('tbl-trans-equip').classList.remove('d-none');
            break;
    }
}

//********************************************************************************//
//                      LOGIN page
//********************************************************************************//

document.getElementById('btn-login').addEventListener('click', (e) => {

    e.preventDefault();

    let user_name = document.getElementById('txt-login').value;
    let user_pass = document.getElementById('txt-pass').value;
    let data = {};
    data.user_name = user_name;
    data.user_pass = user_pass;

    if (document.getElementById('auto-login').checked == true) {
        data.user_name = 'john_doe';
        data.user_pass = '1234';
        USER = data.user_name;
    } else USER = user_name;

    fetch(URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                document.getElementById('nav-event').classList.remove('disabled');
                document.getElementById('nav-event').classList.add('active');
                document.getElementById('nav-equip').classList.remove('disabled');
                document.getElementById('nav-equip').classList.add('active');
                document.getElementById('nav-reserve').classList.remove('disabled');
                document.getElementById('nav-reserve').classList.add('active');
                document.getElementById('nav-transfer').classList.remove('disabled');
                document.getElementById('nav-transfer').classList.add('active');
            }
            console.log("login result:", data.message);
        })

        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })

    document.getElementById('frm-login').reset();
    loadCities();
});

//********************************************************************************//
//                      PROJECTS page
//********************************************************************************//

document.getElementById('btn-new-event').addEventListener('click', showNewEventForm);

function showNewEventForm() {
    document.getElementById('frm-new-event').classList.remove('d-none');
    document.getElementById('txt-event-user').value = USER;
    document.getElementById('txt-event-user').disabled = true;
    // document.getElementById('frm-new-event').reset();    ???
    resetEventForm();
}
function resetEventForm() {
    document.getElementById('txt-event-title').value = "";
    document.getElementById('txt-event-user').value = USER;
    document.getElementById('date-event-start').value = "";
    document.getElementById('date-event-end').value = "";
    document.getElementById('select-city').selectedIndex = 0;
    document.getElementById('select-status').selectedIndex = 0;
    document.getElementById('select-manager-1').selectedIndex = -1;
    document.getElementById('select-manager-2').selectedIndex = -1;
    document.getElementById('select-event-city').selectedIndex = -1;
    document.getElementById('select-event-place').selectedIndex = -1;
    document.getElementById('select-event-phase').selectedIndex = -1;
    document.getElementById('event-notes').value = "";
}

// GET Cities (Calendars/warehouses) as a data source for select input 
//============================================================
function loadCities() {

    console.log("GET cities: http://82.209.203.205:3070/cities");

    let selectCity = document.getElementById('select-city');
    let selectFrom = document.getElementById('select-trans-from');
    let selectTo = document.getElementById('select-trans-to');

    fetch(URL + '/cities', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("cities:", data);
            loadSelectSource(data, selectCity);
            loadSelectSource(data, selectFrom);
            loadSelectSource(data, selectTo);
        })
        .then(loadStatus)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

// GET Event status as a data source for select input 
//============================================================
function loadStatus() {

    console.log("GET event status: http://82.209.203.205:3070/status");

    let selectStatus = document.getElementById('select-status');
    fetch(URL + '/status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("status:", data);
            loadSelectSource(data, selectStatus);
        })
        .then(loadManager)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

// GET Event managers as a data source for select input 
//============================================================
function loadManager() {

    console.log("GET event managers: http://82.209.203.205:3070/managers");

    let selectManager1 = document.getElementById('select-manager-1');
    let selectManager2 = document.getElementById('select-manager-2');

    fetch(URL + '/managers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("manager:", data);
            loadSelectSource(data, selectManager1);
            loadSelectSource(data, selectManager2);
        })
        .then(loadLocations)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

// GET Event locations as a data source for select input 
//============================================================
function loadLocations() {

    console.log("GET event locations: http://82.209.203.205:3070/locations");

    let selectEventCity = document.getElementById('select-event-city');

    fetch(URL + '/locations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            eventLocations = data;
            console.log("eventLocations:", eventLocations);
            // remove cities duplicates
            const table = {};
            const cities = eventLocations.filter(({ event_city }) => (!table[event_city] && (table[event_city] = 1)));
            console.log("distinct cities:", cities);
            // loadSelectSource(cities, selectEventCity);
            fillSelectLocation(cities, selectEventCity);
        })
        .then(loadEventPhases)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

// GET Event phases as a data source for select input 
//============================================================

function loadEventPhases() {

    console.log("GET event phases: http://82.209.203.205:3070/phases");

    let selectEventPhase = document.getElementById('select-event-phase');

    fetch(URL + '/phases', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("eventPhases:", data);
            loadSelectSource(data, selectEventPhase);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

// dependent dropdown lists (event city => event place)
//============================================================
document.getElementById('select-event-city').addEventListener('change', (e) => {
    let selectEventPlace = document.getElementById('select-event-place');
    let city = e.target.options[e.target.selectedIndex].text;
    let place = eventLocations.filter((p) => {
        return p.event_city == city;
    })
    console.log("place:", place);

    fillSelectLocation(place, selectEventPlace);

});

function fillSelectLocation(location, selectLocation) {
    selectLocation.innerHTML = "";
    let empty_opt = document.createElement('option');
    empty_opt.innerHTML = "";
    empty_opt.value = 1;
    selectLocation.appendChild(empty_opt);

    for (let i = 0; i < location.length; i++) {

        let opt = document.createElement('option');
        switch (selectLocation.id) {
            case 'select-event-city':
                opt.innerHTML = location[i].event_city;
                opt.value = location[i].city_id;
                selectLocation.appendChild(opt);
                break;
            case 'select-event-place':
                opt.innerHTML = location[i].event_place;
                opt.value = location[i].place_id;
                selectLocation.appendChild(opt);
                break;
        }
    }
}

// dependent dropdown lists (department => category)
//============================================================

document.getElementById('select-trans-dep').addEventListener('change', (e) => {
    let selectCat = document.getElementById('select-trans-cat');
    let dep = e.target.options[e.target.selectedIndex].value;
    console.log("dep:", dep);

    fetch(URL + '/equip/cat/' + dep, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("data:", data);
            loadSelectSource(data, selectCat)
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })

});

//  Create data source for any select input function (except location)
//============================================================
function loadSelectSource(data, select) {

    select.innerHTML = "";
    let empty_opt = document.createElement('option');
    empty_opt.innerHTML = "";
    empty_opt.value = 1;

    select.appendChild(empty_opt);
    switch (select.id) {
        case 'select-city':
            empty_opt.innerHTML = "Выбрать город";
            select.appendChild(empty_opt);
            break;

        case 'select-status':
            empty_opt.innerHTML = "Выбрать статус";
            select.appendChild(empty_opt);
            break;
    }

    for (let i = 0; i < data.length; i++) {
        let opt = document.createElement('option');
        switch (select.id) {
            case 'select-city':
            case 'select-trans-from':
            case 'select-trans-to':
                opt.innerHTML = data[i].cal_name;
                break;
            case 'select-status':
                opt.innerHTML = data[i].status;
                break;
            case 'select-event-phase':
                opt.innerHTML = data[i].phase;
                break;
            case 'select-trans-dep':
            case 'select-trans-cat':
                opt.innerHTML = data[i].name;
                opt.value = data[i].id;
                break;
            default:
                opt.innerHTML = data[i].concat_name;
                break;
        }
        opt.value = data[i].id;
        select.appendChild(opt);
    }

}


//  Save NEW Event to database
//============================================================
document.getElementById('btn-save-new-event').addEventListener('click', sendDataToDB);

function sendDataToDB() {

    let newEvent = {};
    newEvent.title = document.getElementById('txt-event-title').value;
    newEvent.current_user = document.getElementById('txt-event-user').value;
    newEvent.start = document.getElementById('date-event-start').value;
    newEvent.end = document.getElementById('date-event-end').value;
    newEvent.city = parseInt(document.getElementById('select-city').value);
    newEvent.status = parseInt(document.getElementById('select-status').value);
    newEvent.manager_1 = parseInt(document.getElementById('select-manager-1').value);
    newEvent.manager_2 = parseInt(document.getElementById('select-manager-2').value);
    newEvent.location_city = parseInt(document.getElementById('select-event-city').value);
    newEvent.location_place = parseInt(document.getElementById('select-event-place').value);
    newEvent.phase = parseInt(document.getElementById('select-event-phase').value);
    newEvent.notes = document.getElementById('event-notes').value;

    console.log("newEvent:", newEvent);

    fetch(URL + '/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent)
    })
        .then(res => res.json())
        .then(data => {
            console.log("data:", data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })

    resetEventForm();
}

//  GET All events
// ======================================================================
document.getElementById('btn-all-events').addEventListener('click', getAllEvents);

function getAllEvents() {
    document.getElementById('event-tbl-div').classList.remove('d-none');
    document.getElementById('event-sum-div').classList.remove('d-none');

    fetch(URL + '/events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            events = data
            loadEventsTable(events);
        })
        .then(getSummary)
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

function loadEventsTable(data) {

    console.log(data);

    let tbl = document.getElementById('tbl-events');
    let tblBody = document.getElementById('tbl-body-events');
    tblBody.innerHTML = "";
    let row;
    let cell;
    let location;

    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {

            row = document.createElement('tr');

            cell = document.createElement("td");
            cell.innerHTML = data[i].id;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.innerHTML = data[i].cal_name;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.innerHTML = data[i].title;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.innerHTML = data[i].start.slice(0, 10);
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.innerHTML = data[i].end.slice(0, 10);
            row.appendChild(cell);

            cell = document.createElement("td");
            location = data[i].event_city + ", " + data[i].event_place;
            cell.innerHTML = location;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.innerHTML = data[i].manager_1;
            row.appendChild(cell);

            tblBody.appendChild(row);

        }
        tbl.append(tblBody);
    }

}

//  GET summary
// ======================================================================
function getSummary() {
    fetch(URL + '/events/summary', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("summary:", data);
            displaySummary(data)
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

function displaySummary(data) {
    document.getElementById('sum-minsk').innerHTML = "<h4>Минск: " + data[0].qty + "</h4>";
    document.getElementById('sum-moscow').innerHTML = "<h4>Москва: " + data[1].qty + "</h4>";
    document.getElementById('sum-kazan').innerHTML = "<h4>Казань: " + data[2].qty + "</h4>";
    document.getElementById('sum-piter').innerHTML = "<h4>Питер: " + data[3].qty + "</h4>";
}

//  Click Event table
// ======================================================================
let tblBody = document.getElementById('tbl-body-events');
tblBody.addEventListener('click', (e) => {
    // console.log(e.target);
    let td = e.target;
    let row = td.parentNode;
    selectedEventId = row.children[0].innerHTML;
    clearBackgroundColor(tblBody);

    row.className = "yellow";

    displaySelectedEventIntoForm(selectedEventId);

});

function clearBackgroundColor(tbl) {
    let rows = tbl.rows;
    // console.log(rows.length);
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("yellow");
    }
}

function displaySelectedEventIntoForm(selectedEventId) {
    document.getElementById('frm-new-event').classList.remove('d-none');
    let selectedEvent = events.filter(function (el) {
        return el.id == selectedEventId;
    });

    console.log("selectedEvent:", selectedEvent);

    document.getElementById('txt-event-title').value = selectedEvent[0].title;
    document.getElementById('txt-event-user').value = selectedEvent[0].current_user;
    document.getElementById('date-event-start').value = selectedEvent[0].start.slice(0, 10);
    document.getElementById('date-event-end').value = selectedEvent[0].end.slice(0, 10);
    document.getElementById('select-city').selectedIndex = parseInt(selectedEvent[0].calendarId);
    document.getElementById('select-status').selectedIndex = parseInt(selectedEvent[0].statusId);
    document.getElementById('select-manager-1').selectedIndex = parseInt(selectedEvent[0].manager_1Id);
    document.getElementById('select-manager-2').selectedIndex = parseInt(selectedEvent[0].manager_2Id);
    document.getElementById('select-event-city').selectedIndex = parseInt(selectedEvent[0].event_cityId) - 1;

    let selectEventPlace = document.getElementById('select-event-place');
    let city = selectedEvent[0].event_city;
    let placeArr = eventLocations.filter((p) => {
        return p.event_city == city;
    });

    console.log("placeArr:", placeArr);

    fillSelectLocation(placeArr, selectEventPlace);
    let selectedPlace = selectedEvent[0].event_place;

    for (let i = 0; i < placeArr.length; i++) {
        if (placeArr[i].event_place == selectedPlace) {
            console.log("index:", i);
            selectEventPlace.selectedIndex = i + 1;
        }
    }

    document.getElementById('select-event-phase').selectedIndex = parseInt(selectedEvent[0].phaseId);
    document.getElementById('event-notes').value = selectedEvent[0].notes;
}


//  UPDATE event
// ======================================================================
document.getElementById('btn-update-event').addEventListener('click', updateEvent);


function updateEvent() {
    let updEvent = {};
    updEvent.title = document.getElementById('txt-event-title').value;
    updEvent.current_user = document.getElementById('txt-event-user').value;
    updEvent.start = document.getElementById('date-event-start').value;
    updEvent.end = document.getElementById('date-event-end').value;
    updEvent.city = parseInt(document.getElementById('select-city').value);
    updEvent.status = parseInt(document.getElementById('select-status').value);
    updEvent.manager_1 = parseInt(document.getElementById('select-manager-1').value);
    updEvent.manager_2 = parseInt(document.getElementById('select-manager-2').value);
    updEvent.location_city = parseInt(document.getElementById('select-event-city').value);
    updEvent.location_place = parseInt(document.getElementById('select-event-place').value);
    console.log("location_place:", document.getElementById('select-event-place').value);
    updEvent.phase = parseInt(document.getElementById('select-event-phase').value);
    updEvent.notes = document.getElementById('event-notes').value;

    console.log("updEvent:", updEvent);

    fetch(URL + '/events/' + selectedEventId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updEvent)
    })
        .then(res => res.json())
        .then(data => {
            console.log("data:", data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

//  DELETE event
// ======================================================================
document.getElementById('btn-delete-event').addEventListener('click', deleteEvent);

function deleteEvent() {

    fetch(URL + '/events/' + selectedEventId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ""
    })
        .then(res => res.json())
        .then(data => {
            console.log("data:", data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error)
        })
}

//********************************************************************************//
//                      EQUIPMENT page
//********************************************************************************//

//  GET all departments
// ======================================================================
function getAllDepartments() {

    console.log("GET all departments:http://82.209.203.205:3070/equip/dep");
    selectDepartment = document.getElementById('select-trans-dep');
    console.log(selectDepartment);
    fetch(URL + '/equip/dep', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("departments:", data);
            // displaySummary(data)
            departments = data;
            loadSelectSource(departments, selectDepartment);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}
//  GET all equipment
// ======================================================================
document.getElementById('equip-all').addEventListener('click', getAllEquip);

function getAllEquip() {

    console.log("GET all equipment:http://82.209.203.205:3070/equip");
    document.getElementById('tbl-equip').classList.remove('d-none');

    fetch(URL + '/equip', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("all equipment:", data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

//  GET light equipment
// ======================================================================
document.getElementById('equip-light').addEventListener('click', getLightEquip);

function getLightEquip() {

    console.log("GET light equipment:http://82.209.203.205:3070/equip/001");
    document.getElementById('tbl-equip').classList.remove('d-none');

    fetch(URL + '/equip/001', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("lighting:", data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

//  GET light equipment by category
// ======================================================================
document.getElementById('equip-light-000').addEventListener('click', (e) => {
    console.log(e.target.id.slice(-3));
    let cat = e.target.id.slice(-3);
    console.log("GET lighting by category: http://82.209.203.205:3070/equip/001/" + cat);
    fetch(URL + '/equip/001/' + cat, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("lighting: " + cat, data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })

});


//  GET video equipment
// ======================================================================
document.getElementById('equip-video').addEventListener('click', getVideoEquip);

function getVideoEquip() {

    console.log("GET video equipment:http://82.209.203.205:3070/equip/dep");
    document.getElementById('tbl-equip').classList.remove('d-none');

    fetch(URL + '/equip/002', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("video:", data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

//  GET video equipment by category
// ======================================================================
document.getElementById('equip-video-000').addEventListener('click', (e) => {
    console.log(e.target.id.slice(-3));
    let cat = e.target.id.slice(-3);
    console.log("GET video by category: http://82.209.203.205:3070/equip/002/" + cat);
    fetch(URL + '/equip/002/' + cat, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("video: " + cat, data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })

});


//  GET commutation equipment
// ======================================================================
document.getElementById('equip-comm').addEventListener('click', getCommEquip);

function getCommEquip() {

    console.log("GET commutation equipment:http://82.209.203.205:3070/equip/dep");
    document.getElementById('tbl-equip').classList.remove('d-none');

    fetch(URL + '/equip/003', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("commutation:", data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

//  GET commutation equipment by category
// ======================================================================
document.getElementById('equip-comm-000').addEventListener('click', (e) => {
    console.log(e.target.id.slice(-3));
    let cat = e.target.id.slice(-3);
    console.log("GET commutation by category: http://82.209.203.205:3070/equip/003/" + cat);
    fetch(URL + '/equip/003/' + cat, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("commutation: " + cat, data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })

});

//  GET rigging equipment
// ======================================================================
document.getElementById('equip-rig').addEventListener('click', getRigEquip);

function getRigEquip() {

    console.log("GET rigging equipment:http://82.209.203.205:3070/equip/dep");
    document.getElementById('tbl-equip').classList.remove('d-none');

    fetch(URL + '/equip/004', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("rigging:", data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}

//  GET rigging equipment by category
// ======================================================================
document.getElementById('equip-rig-000').addEventListener('click', (e) => {
    console.log(e.target.id.slice(-3));
    let cat = e.target.id.slice(-3);
    console.log("GET rigging by category: http://82.209.203.205:3070/equip/004/" + cat);
    fetch(URL + '/equip/004/' + cat, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("rigging: " + cat, data);
            fillEquipTable(data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })

});

function fillEquipTable(data) {

    let tbl = document.getElementById('tbl-equip');
    let tblBody = document.getElementById('tbody-equip');
    tblBody.innerHTML = "";

    if (data.length > 0) {

        for (let i = 0; i < data.length; i++) {

            let row = document.createElement('tr');

            let cell = document.createElement("td");
            let id = data[i].fixture_type.slice(0, 11);
            let cat = id.slice(8, 12);
            // console.log("id:", id);
            // console.log("cat:", id.slice(8,12));
            if (cat === "000") {
                cell.innerHTML = "";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "<h5>" + data[i].name + "</h5>";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "";
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = "";
                row.appendChild(cell);
            } else {
                cell.innerHTML = id;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].name;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].qty;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].qty_minsk;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].qty_kazan;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].qty_msc;
                row.appendChild(cell);

                cell = document.createElement("td");
                cell.innerHTML = data[i].qty_piter;
                row.appendChild(cell);
            }




            tblBody.appendChild(row);
        }
        tbl.append(tblBody);
    }
}

//********************************************************************************//
//                      TRANSFER page
//********************************************************************************//

document.getElementById("select-trans-cat").addEventListener('change', (e) => {

    let id = e.target.options[e.target.selectedIndex].value;
    cat = id.slice(4, 7);
    let dep = id.slice(0, 3);

    fetch(URL + '/equip/' + dep + '/' + cat, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            equipByCat = data;
            loadTransferEquipTable(equipByCat);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })

});




function loadTransferEquipTable(data) {

    console.log("equipment by category: ", data);

    let transferColumns = [];

    let warehouseFromSelect = document.getElementById("select-trans-from");
    let warehouseToSelect = document.getElementById("select-trans-to");
    let warehouseFrom = warehouseFromSelect.options[warehouseFromSelect.selectedIndex].text;
    let warehouseTo = warehouseFromSelect.options[warehouseToSelect.selectedIndex].text;


    switch (warehouseFrom) {
        case "Минск":
            transferColumns.push('qty_minsk');
            break;
        case "Москва":
            transferColumns.push('qty_msc');
            break;
        case "Казань":
            transferColumns.push('qty_kazan');
            break;
        case "Питер":
            transferColumns.push('qty_piter');
            break;
    }

    switch (warehouseTo) {
        case "Минск":
            transferColumns.push('qty_minsk');
            break;
        case "Москва":
            transferColumns.push('qty_msc');
            break;
        case "Казань":
            transferColumns.push('qty_kazan');
            break;
        case "Питер":
            transferColumns.push('qty_piter');
            break;
    }


    let tbl = document.getElementById('tbl-trans-equip');
    tbl.innerHTML = "";
    let tblHead = document.createElement('thead');
    let tblBody = document.createElement('tbody');
    tblBody.id = "tbody-transfer"
    let tRow = document.createElement('tr');
    let tCell = document.createElement('tr');
    let tHead = document.createElement('th');
    tHead.innerHTML = "id";
    tRow.appendChild(tHead);

    tHead = document.createElement('th');
    tHead.innerHTML = "Оборудование"
    tRow.appendChild(tHead);

    tHead = document.createElement('th');
    tHead.innerHTML = "Кол-во общее"
    tRow.appendChild(tHead);

    tHead = document.createElement('th');
    tHead.innerHTML = "Откуда: " + warehouseFrom;
    tHead.col = transferColumns[0];
    tRow.appendChild(tHead);

    tHead = document.createElement('th');
    tHead.innerHTML = "Куда: " + warehouseTo;
    tHead.col = transferColumns[1];
    tRow.appendChild(tHead);

    tHead = document.createElement('th');
    tHead.innerHTML = "Сколько";
    tRow.appendChild(tHead);

    tRow.appendChild(tHead);
    tblHead.appendChild(tRow);
    tbl.appendChild(tblHead);


    for (let i = 0; i < data.length; i++) {

        let id = data[i].fixture_type.slice(0, 11);
        tRow = document.createElement('tr');

        if (id.slice(8, 12) === "000") {
            tCell = document.createElement('td');
            tCell.innerHTML = "";
            tRow.appendChild(tCell);

            tCell = document.createElement('td');
            tCell.innerHTML = "<h5>" + data[i].name + "</h5>";
            tRow.appendChild(tCell);

        } else {
            tCell = document.createElement('td');
            tCell.innerHTML = id;
            tRow.appendChild(tCell);

            tCell = document.createElement('td');
            tCell.innerHTML = data[i].name;
            tRow.appendChild(tCell);

            tCell = document.createElement('td');
            tCell.innerHTML = data[i].qty;
            tRow.appendChild(tCell);

            tCell = document.createElement('td');
            const arrData = Object.entries(data);
            // console.log("arrData:" + i,arrData[i]);

            const arrDataRow = Object.entries(arrData[i][1]);
            // console.log("arrDataRow:" + i, arrDataRow);

            for (let i = 0; i < 4; i++) {
                // console.log(arrDataRow[i+3][0]);

                if (arrDataRow[i + 3][0] === transferColumns[0]) {
                    tCell.innerHTML = arrDataRow[i + 3][1];
                    tRow.appendChild(tCell);
                }
            }

            tCell = document.createElement('td');

            for (let i = 0; i < 4; i++) {
                if (arrDataRow[i + 3][0] === transferColumns[1]) {
                    tCell.innerHTML = arrDataRow[i + 3][1];
                    tRow.appendChild(tCell);
                }
            }

            tCell = document.createElement('td');
            let inputbox = document.createElement("input");
            inputbox.classList.add('txt-to-move');
            inputbox.id = "txt-" + i;
            inputbox.value = 0;
            inputbox.setAttribute("type", "text");
            tCell.appendChild(inputbox);
            tRow.appendChild(tCell);
        }

        tblBody.appendChild(tRow);
    }
    tbl.appendChild(tblBody);

}

document.getElementById('tbl-trans-equip').addEventListener('click', (e) => {
    // console.log(e.target);
    // console.log(e.target.className);

    if (e.target.className == 'txt-to-move') {
        let txt = e.target;
        txt.value = "";
        let txt_id = txt.id;
        let td = txt.parentNode;
        let row = td.parentNode;

        document.getElementById(txt_id).addEventListener('change', (e) => {
            txt.classList.add('yellow');

            let qty_from = parseInt(row.children[3].innerHTML);
            let qty_to = parseInt(row.children[4].innerHTML);
            let qty_howmany = parseInt(txt.value);

            // console.log(qty_from);
            // console.log(qty_to);
            // console.log(qty_howmany);

            row.children[3].innerHTML = qty_from - qty_howmany;
            row.children[4].innerHTML = qty_to + qty_howmany;

            row.children[0].classList.add('bold-font');
            row.children[1].classList.add('bold-font');
            row.children[2].classList.add('bold-font');
            row.children[3].classList.add('bold-font');
            row.children[4].classList.add('bold-font');
        })

        txt.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                txt.blur();
            }
        })
    }
})

//  Save transferring data to DB
// ======================================================================

document.getElementById('btn-trans-move').addEventListener('click', saveTransferData);

function saveTransferData() {
    let transDataArr = [];

    let tbl = document.getElementById('tbl-trans-equip');
    let thead = tbl.children[0];
    let tr = thead.children[0];
    let whouseNameFrom = tr.children[3].innerHTML.slice(8, 16);
    let whouseNameTo = tr.children[4].innerHTML.slice(6, 16);

    let qty_from;
    let qty_to;
    let qty_transfer;
    let id;

    // console.log(tbl.rows[2].children[1]);

    for (let i = 2; i < tbl.rows.length; i++) {

        id = tbl.rows[i].children[0].innerHTML;
        qty_from = parseInt(tbl.rows[i].children[3].innerHTML);
        qty_to = parseInt(tbl.rows[i].children[4].innerHTML);
        qty_transfer = tbl.rows[i].children[5].children[0].value;

        if (qty_transfer > 0) {

            let transData = {};

            id = id + "-000";
            let equip = equipByCat.filter((p) => {
                return p.fixture_type == id;
            });

            transData.fixture_type = id;
            transData.qty_minsk = equip[0].qty_minsk;
            transData.qty_msc = equip[0].qty_msc;
            transData.qty_kazan = equip[0].qty_kazan;
            transData.qty_piter = equip[0].qty_piter;

            // console.log("equip: ", equip);
            // console.log('transData.qty_minsk', transData.qty_minsk);
            // console.log('transData.qty_msc', transData.qty_msc);
            // console.log('transData.qty_kazan', transData.qty_kazan);
            // console.log('transData.qty_piter', transData.qty_piter);

            // console.log("transData before:", transData);

            switch (whouseNameFrom) {
                case "Минск":
                    transData.qty_minsk = qty_from;
                    switch (whouseNameTo) {
                        case "Москва":
                            transData.qty_msc = qty_to;
                            break;
                        case "Казань":
                            transData.qty_kazan = qty_to;
                            break;
                        case "Питер":
                            transData.qty_piter = qty_to;
                            break;
                    }
                    break;
                case "Москва":
                    transData.qty_msc = qty_from;
                    switch (whouseNameTo) {
                        case "Минск":
                            transData.qty_minsk = qty_to;
                            break;
                        case "Казань":
                            transData.qty_kazan = qty_to;
                            break;
                        case "Питер":
                            transData.qty_piter = qty_to;
                            break;
                    }
                    break;
                case "Казань":
                    transData.qty_kazan = qty_from;
                    switch (whouseNameTo) {
                        case "Минск":
                            transData.qty_minsk = qty_to;
                            break;
                        case "Москва":
                            transData.qty_msc = qty_to;
                            break;
                        case "Питер":
                            transData.qty_piter = qty_to;
                            break;
                    }
                    break;
                case "Питер":
                    transData.qty_piter = qty_from;
                    switch (whouseNameTo) {
                        case "Минск":
                            transData.qty_minsk = qty_to;
                            break;
                        case "Москва":
                            transData.qty_msc = qty_to;
                            break;
                        case "Казань":
                            transData.qty_kazan = qty_to;
                            break;
                    }
                    break;


            }

            // console.log("transData after:", transData);

            transDataArr.push(transData);
        }

    }
    console.log("transDataArr:", transDataArr);

    let data = JSON.stringify(transDataArr);

    console.log("POST send transferring equipment: http://82.209.203.205:3070/equip/transfer");
    fetch(URL + '/equip/transfer', {

        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })
        .then(res => res.json())
        .then(data => {
            console.log("response: ", data);
        })
        .catch(error => {
            // enter your logic for when there is an error (ex. error toast)
            console.log(error);
        })
}



