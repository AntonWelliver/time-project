/* User Interface */
class UI {
    constructor() {
        this.raceInfoEdit = document.getElementById('raceInfoEdit');
        this.raceInfoTable = document.getElementById('raceInfoTable');
        this.raceTableBody = document.getElementById('raceTableBody');
        this.newRaceButton = document.getElementById('newRaceButton');
        this.saveButton = document.getElementById('saveButton');
        this.raceName = document.getElementById('race-name');
        this.raceDistance = document.getElementById('race-distance');
        this.raceDate = document.getElementById('race-date');
        this.raceCapacity = document.getElementById('race-capacity');
        this.raceLocation = document.getElementById('race-location');
        this.raceCompetitionClass = document.getElementById('race-competition-class');
        this.raceMessage = document.getElementById('race-message');
        this.alert = document.getElementById('alert');
        this.raceId = "";
        this.state = "";
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
        const filledBlueStar = `<a href="#" class="star-item"><i class="fas fa-star"></i></a>`;
        const emptyBlueStar = `<a href="#" class="star-item"><i class="far fa-star"></i></a>`;
        //Remove Excisting Rows
        this.raceTableBody.innerHTML = "";
        //Create The Excisting Rows
        let output = "";
        let star = emptyBlueStar;
        theRaceList.forEach(function(race) {
            if (race.show === true) {
                star = filledBlueStar;
            } else {
                star = emptyBlueStar;
            };

            output += `
        <tr>
            <td>${race.name}</td>
            <td>${race.date}</td>
            <td>${race.location}</td>
            <td>${star}</td>
            <td><a href="#" class="edit-item" data-id="${race.id}"><i class="fa fa-pencil"></i></a></td>
            <td><a href="#" class="delete-item" data-id="${race.id}"><i class="fa fa-remove"></i></a></td>
        </tr>
            `;
          });
          //Update Race Table With Content
          this.raceTableBody.innerHTML = output;
    }
}

ui = new UI();

class testData {
    constructor() {

    }

    async get(url) {
        const response = await fetch(url);
        const resData = await response.json();
        return resData;
    }
}

let test = new testData();

//Listen For Edit State
ui.raceTableBody.addEventListener("click", editRaceInfo);

function editRaceInfo(e) {
    if(e.target.parentElement.classList.contains("edit-item")) {
        const id = e.target.parentElement.dataset.id;

        ui.raceId = id;
        ui.state = "edit";
        //Get Data From Database
        ui.decreaseRaceInfoTable();
        ui.displayRaceInfoEdit();
    }


    e.preventDefault();
}


function getRaceInfo() {
    test.get("test-data/race-info-list.json")
    .then(data => ui.updateRaceTable(data))
    .catch(err => console.log(err));
}

ui.hideAlert();
ui.hideRaceInfoEdit();
ui.expandRaceInfoTable();

getRaceInfo();

ui.newRaceButton.addEventListener("click", displayRaceInfo);

function displayRaceInfo(e) {
    ui.decreaseRaceInfoTable();
    ui.displayRaceInfoEdit();
    
    e.preventDefault();
}

ui.saveButton.addEventListener("click", saveRaceInfo);

function saveRaceInfo(e) {
    const name = ui.raceName.value;
    const distance = ui.raceDistance.value;
    const date = ui.raceDate.value;
    const capacity = ui.raceCapacity.value;
    const location = ui.raceLocation.value;
    const competitionClass = ui.raceCompetitionClass.value;
    const message = ui.raceMessage.value;

    //Data For Database
    const data = {
        name,
        distance,
        date,
        capacity,
        location,
        competitionClass,
        message
    }

    //Check For Edit State
    //If Edit Then PUT Or Else POST

    //Create Post
    //test.post("test-data/race-info-list.json", data)

    ui.showAlert("Save successful.", "bg-success");
    setTimeout(() => {
        ui.hideAlert();
    }, 2000);

    getRaceInfo();
    e.preventDefault();
}

