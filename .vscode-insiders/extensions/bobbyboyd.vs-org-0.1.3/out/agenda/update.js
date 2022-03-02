"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
module.exports = function () {
    let config = vscode.workspace.getConfiguration("vsorg");
    let checkFolder = config.get("folderPath");
    let folder;
    let dateArray = [];
    let textArray = [];
    let datelessText;
    let getDate;
    let convertedDateArray = [];
    let unsortedObject = {};
    let sortedObject = {};
    readFiles();
    function readFiles() {
        fs.readdir(setMainDir(), (err, items) => {
            let agendaFile = checkFolder + "\\agendas\\agenda.vsorg";
            //erase data in file
            fs.writeFileSync(agendaFile, "");
            //loop through all of the files in the directory
            for (let i = 0; i < items.length; i++) {
                //make sure its a vsorg file
                if (items[i].includes(".vsorg")) {
                    //check for SCHEDULED
                    let fileText = fs
                        .readFileSync(setMainDir() + "\\" + items[i])
                        .toString()
                        .split(/[\r\n]/);
                    fileText.forEach(element => {
                        if (element.includes("SCHEDULED")) {
                            datelessText = element.trim().match(/.*(?=.*SCHEDULED)/g);
                            datelessText = datelessText[0].replace("⊙", "");
                            datelessText = datelessText.replace("⊘", "");
                            datelessText = datelessText.replace("⊖", "");
                            datelessText = datelessText.trim();
                            datelessText = items[i] + ": " + "SCHED: " + datelessText;
                            getDate = element.match(/\[(.*)\]/);
                            //get the day of the week
                            let d = new Date(getDate[1]).getDay();
                            let nameOfDay;
                            if (d === 0) {
                                nameOfDay = "Sunday";
                            }
                            else if (d === 1) {
                                nameOfDay = "Monday";
                            }
                            else if (d === 2) {
                                nameOfDay = "Tuesday";
                            }
                            else if (d === 3) {
                                nameOfDay = "Wednesday";
                            }
                            else if (d === 4) {
                                nameOfDay = "Thursday";
                            }
                            else if (d === 5) {
                                nameOfDay = "Friday";
                            }
                            else if (d === 6) {
                                nameOfDay = "Saturday";
                            }
                            convertedDateArray = [];
                            if (new Date(getDate[1]).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                                convertedDateArray.push({
                                    date: getDate[0] + ", " + nameOfDay.toUpperCase(),
                                    text: datelessText
                                });
                            }
                            convertedDateArray.forEach(element => {
                                if (!unsortedObject[element.date]) {
                                    unsortedObject[element.date] = "  " + element.text + "\n";
                                }
                                else {
                                    unsortedObject[element.date] += "  " + element.text + "\n";
                                }
                            });
                        }
                    });
                    Object.keys(unsortedObject)
                        .sort()
                        .forEach(function (key) {
                        sortedObject[key] = unsortedObject[key];
                    });
                    console.log(sortedObject);
                    //write the sorted object to the agenda file
                }
            }
            if (!fs.existsSync(checkFolder + "\\agendas")) {
                fs.mkdirSync(checkFolder + "\\agendas");
            }
            if (!fs.existsSync(agendaFile)) {
            }
            else {
                var test = "";
                for (var property in sortedObject) {
                    test += property + "\n" + sortedObject[property] + "\n";
                }
                console.log(test);
                fs.appendFileSync(agendaFile, "#+Upcoming Tasks\n\n" + test, "utf-8");
            }
        });
    }
    function setMainDir() {
        if (checkFolder === "") {
            let homeDir = os.homedir();
            folder = homeDir + "\\VSOrgFiles";
        }
        else {
            folder = checkFolder;
        }
        return folder;
    }
};
//# sourceMappingURL=update.js.map