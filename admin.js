/* User Interface */
class UI {
    constructor() {
        this.raceInfoEdit = document.getElementById('raceInfoEdit');
        this.raceInfoTable = document.getElementById('raceInfoTable');
        this.raceTableBody = document.getElementById('raceTableBody');
    }

    hideRaceInfoEdit() {
        this.raceInfoEdit.classList.add("d-none");
    }
    
    expandRaceInfoTable() {
        this.raceInfoTable.classList.remove("col-md-6");
        this.raceInfoTable.classList.add("col-md-12");
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
            <td><a href="#" class="edit-item"><i class="fa fa-pencil"></i></a></td>
            <td><a href="#" class="delete-item"><i class="fa fa-remove"></i></a></td>
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


function getRaceInfo() {
    test.get("test-data/race-info-list.json")
    .then(data => ui.updateRaceTable(data))
    .catch(err => console.log(err));
}


ui.hideRaceInfoEdit();
ui.expandRaceInfoTable();

getRaceInfo();