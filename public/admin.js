/* User Interface */
class UI {
    constructor() {
        this.raceInfoEdit = document.getElementById('raceInfoEdit');
        this.raceInfoTable = document.getElementById('raceInfoTable');
        this.raceInfoH3 = document.getElementById('raceInfoH3');
        this.raceTableBody = document.getElementById('raceTableBody');
        this.newRaceButton = document.getElementById('newRaceButton');
        this.saveButton = document.getElementById('saveButton');
        this.raceName = document.getElementById('race-name');
        this.raceDistance = document.getElementById('race-distance');
        this.raceDate = document.getElementById('race-date');
        this.raceCapacity = document.getElementById('race-capacity');
        this.raceLocation = document.getElementById('race-location');
        this.raceDisplay = document.getElementById('togBtn');
        this.raceMessage = document.getElementById('race-message');
        this.alert = document.getElementById('alert');
        this.raceId = "";
        this.addState = true;
    }

    hideRaceInfoEdit() {
        this.raceInfoEdit.classList.add("d-none");
    }

    expandRaceInfoTable() {
        this.raceInfoTable.classList.remove("col-md-6");
        this.raceInfoTable.classList.add("col-md-12");
    }

    displayRaceInfoEdit() {
        this.raceInfoEdit.classList.remove("d-none");
    }

    decreaseRaceInfoTable() {
        this.raceInfoTable.classList.remove("col-md-12");
        this.raceInfoTable.classList.add("col-md-6");
    }

    hideAlert() {
        this.alert.classList.add("d-none");
    }

    showAlert(alertMessage, alertClass) {
        this.alert.classList.remove("d-none");
        this.alert.classList.add(alertClass);
        this.alert.classList.add("text-center");

        this.alert.innerHTML = `<h4>${alertMessage}</h4>`;
    }

    updateRaceTable(theRaceList) {
        const checkedCircle = `<a href="#" class="circle-item"><i class="fas fa-check-circle"></i></a>`;
        const emptyCircle = `<a href="#" class="circle-item"><i class="far fa-circle"></i></a>`;
        //Remove Excisting Rows
        this.raceTableBody.innerHTML = "";
        //Create The Excisting Rows
        let output = "";
        let circle = emptyCircle;
        theRaceList.forEach(function (race) {
            if (race.display === true) {
                circle = checkedCircle;
            } else {
                circle = emptyCircle;
            };

            let raceDate = new Date(race.date).toLocaleDateString();

            output += `
        <tr>
            <td>${race.name}</td>
            <td>${raceDate}</td>
            <td>${race.location}</td>
            <td>${circle}</td>
            <td><a href="#" class="edit-item" data-id="${race._id}"><i class="fa fa-pencil"></i></a></td>
            <td><a href="#" class="delete-item" data-id="${race._id}"><i class="fa fa-remove"></i></a></td>
        </tr>
            `;
        });
        //Update Race Table With Content
        this.raceTableBody.innerHTML = output;
    }
}

ui = new UI();

class AccessHTTP {
    constructor() {

    }

    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();
        return resData;
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        return resData;
    }
}

let accessHTTP = new AccessHTTP();

//Listen For Edit State
ui.raceTableBody.addEventListener("click", editRaceInfo);

function editRaceInfo(e) {
    if (e.target.parentElement.classList.contains("edit-item")) {
        const id = e.target.parentElement.dataset.id;

        ui.raceId = id;
        ui.addState = false;
        //Get Data From Database
        ui.raceInfoH3.innerHTML = "Edit Race Info";

        ui.decreaseRaceInfoTable();
        ui.displayRaceInfoEdit();
    }


    e.preventDefault();
}


function getRaceInfo() {
    accessHTTP.get("http://localhost:5000/information")
        .then(data => ui.updateRaceTable(data))
        .catch(err => console.log(err));
}

ui.hideAlert();
ui.hideRaceInfoEdit();
ui.expandRaceInfoTable();

getRaceInfo();

ui.newRaceButton.addEventListener("click", displayRaceInfo);

function displayRaceInfo(e) {
    ui.raceInfoH3.innerHTML = "Add New Race";
    ui.decreaseRaceInfoTable();
    ui.displayRaceInfoEdit();
    ui.addState = true;

    e.preventDefault();
}

ui.saveButton.addEventListener("click", saveRaceInfo);

function saveRaceInfo(e) {
    const name = ui.raceName.value;
    const distance = ui.raceDistance.value;
    const date = ui.raceDate.value;
    const capacity = ui.raceCapacity.value;
    const location = ui.raceLocation.value;
    const display = ui.raceDisplay.value;
    const message = ui.raceMessage.value;

    //Data For Database
    const data = {
        name,
        distance,
        date,
        capacity,
        location,
        display,
        message
    }

    //Check For Add State, If Add Do POST Or Else PATCH
    if(ui.addState == true) {
        // POST
        accessHTTP.post("http://localhost:5000/information", data)
        .then(data => getRaceInfo())
        .catch(err => console.log(err));
    } else {
        // PATCH
    }
  
    //Create Post
    //test.post("test-data/race-info-list.json", data)

    ui.showAlert("Save successful.", "bg-success");
    setTimeout(() => {
        ui.hideAlert();
    }, 2000);

    getRaceInfo();
    e.preventDefault();
}

