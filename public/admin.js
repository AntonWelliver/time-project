
/* User Interface */
class UI {
    constructor() {
        this.raceInfoProducer = document.getElementById('raceInfoProducer');
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
        this.displayOption1 = document.getElementById('option1');
        this.displayOption2 = document.getElementById('option2');
        this.displayOption3 = document.getElementById('option3');
        this.displayOption4 = document.getElementById('option4');
        this.raceMessage = document.getElementById('race-message');
        this.alert = document.getElementById('alert');
        this.raceId = "";
        this.addState = true;
    }

    hideraceInfoProducer() {
        this.raceInfoProducer.classList.add("d-none");
    }

    expandRaceInfoTable() {
        this.raceInfoTable.classList.remove("col-md-6");
        this.raceInfoTable.classList.add("col-md-12");
    }

    displayRaceInfoProducer() {
        this.raceInfoProducer.classList.remove("d-none");
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
        const checkedRedCircle = `<a href="#" class="circle-item"><i class="fas fa-circle text-danger"></i></a>`;
        const checkedBlueCircle = `<a href="#" class="circle-item"><i class="fas fa-circle text-primary"></i></a>`;
        const checkedGreenCircle = `<a href="#" class="circle-item"><i class="fas fa-circle text-success"></i></a>`;
        const emptyCircle = `<a href="#" class="circle-item"><i class="far fa-circle"></i></a>`;

        //Remove Excisting Rows
        this.raceTableBody.innerHTML = "";

        //Create The Excisting Rows
        let output = "";
        let circle = emptyCircle;

        theRaceList.forEach(function (race) {
            if (race.displayOption == ui.displayOption1.value) {
                circle = checkedRedCircle;
            } else if (race.displayOption == ui.displayOption2.value) {
                circle = checkedBlueCircle;
            } else if (race.displayOption == ui.displayOption3.value) {
                circle = checkedGreenCircle;
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
    updateRaceInfoProducer(raceInfo) {
        const dateObject = new Date(raceInfo.date);
        const localDateStr = dateObject.toLocaleDateString();
        const localTimeStr = dateObject.toLocaleTimeString();

        ui.raceDate.value = `${localDateStr}T${localTimeStr}`;
        ui.raceName.value = raceInfo.name;
        ui.raceDistance.value = raceInfo.distance;
        ui.raceCapacity.value = raceInfo.capacity;
        ui.raceLocation.value = raceInfo.location;
        ui.raceMessage.value = raceInfo.message;
        
        if (raceInfo.displayOption === ui.displayOption1.value) {
            ui.displayOption1.checked = true;
        } else if (raceInfo.displayOption === ui.displayOption2.value) {
            ui.displayOption2.checked = true;
        } else if (raceInfo.displayOption === ui.displayOption3.value) {
            ui.displayOption3.checked = true;
        } else {
            ui.displayOption4.checked = true;
        }
    }
}

ui = new UI();

class AccessHTTP {
    constructor() {
        this.status = 0;
    }

    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();
        this.status = response.status;

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
        this.status = response.status;

        return resData;
    }

    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        this.status = response.status;

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

        ui.decreaseRaceInfoTable();
        ui.displayRaceInfoProducer();

        //Get Data From Database
        accessHTTP.get(`http://localhost:5000/information/${id}`)
        .then(raceInfo => ui.updateRaceInfoProducer(raceInfo))
        .catch(err => console.log(err));
        
        ui.raceInfoH3.innerHTML = "Edit Race Info";
    }


    e.preventDefault();
}


function getRaceInfo() {
    accessHTTP.get("http://localhost:5000/information")
        .then(raceInfo => ui.updateRaceTable(raceInfo))
        .catch(err => console.log(err));
}

ui.hideAlert();
ui.hideraceInfoProducer();
ui.expandRaceInfoTable();

getRaceInfo();

ui.newRaceButton.addEventListener("click", displayRaceInfo);

function displayRaceInfo(e) {
    ui.raceName.value = "";
    ui.raceDistance.value = "";
    ui.raceDate.value = "";
    ui.raceCapacity.value = "";
    ui.raceLocation.value = "";
    ui.displayOption4.checked = true;
    ui.raceMessage.value = "";

    ui.raceInfoH3.innerHTML = "Add New Race";
    ui.decreaseRaceInfoTable();
    ui.displayRaceInfoProducer();
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
    const message = ui.raceMessage.value;

    let selectedOption = "";

    if (ui.displayOption1.checked == true) {
        selectedOption = ui.displayOption1.value;
    } else if (ui.displayOption2.checked == true) {
        selectedOption = ui.displayOption2.value;
    } else if (ui.displayOption3.checked == true) {
        selectedOption = ui.displayOption3.value;
    } else {
        selectedOption = ui.displayOption4.value;
    }

    const displayOption = selectedOption;

    //Data For Database
    const raceInfo = {
        name,
        distance,
        date,
        capacity,
        location,
        displayOption,
        message
    }

    //Check For Add State, If Add Do POST Or Else PATCH
    if(ui.addState == true) {
        console.log(raceInfo);
        // POST
        accessHTTP.post("http://localhost:5000/information", raceInfo)
        .then(() => getRaceInfo())
        .catch(err => console.log(err));
    } else {
        // PATCH
        const id = ui.raceId;
        accessHTTP.patch(`http://localhost:5000/information/${id}`, raceInfo)
        .then(updateRaceInfo => {
            if (updateRaceInfo !== null) {

                switch (accessHTTP.status) {
                    case 200:
                        ui.showAlert("Save Successful.", "bg-success");
                        break;

                    case 404:
                        ui.showAlert("404 Not Found.", "bg-danger");
                        break;

                    case 400:
                        ui.showAlert("Invalid Request.", "bg-danger");
                        break;
                    
                    default:
                        ui.showAlert("Remote Server Error", "bg-danger");
                }

                setTimeout(() => {
                    ui.hideAlert();
                }, 2000);

                getRaceInfo();
            }
        })
        .catch(err => {
            ui.showAlert("Server Error", "bg-danger");

            setTimeout(() => {
                ui.hideAlert();
            }, 2000);
        });
    }

    e.preventDefault();
}

