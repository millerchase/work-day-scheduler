// grab and set today's date
let today = moment().format("dddd, MMMM Do");
$("#currentDay").text(today);

// set today's time
let currentTime = moment().hour();

// task list for saving  
const tasks = [];

// refs
const timeBlocksListEl = $("#time-blocks-list");

var auditTask = () => {
  
    // git current time
    console.log(moment().hour());
  
    // // remove any old classes from element
    // $(taskEl).removeClass("list-group-item-warning list-group-item-dander");
  
    // // apply new class if task is near/over due date
    // if (moment().isAfter(time)) {
    //   $(taskEl).addClass("list-group-item-danger");
    // } else if (Math.abs(moment().diff(time, "days")) <= 2) {
    //   $(taskEl).addClass("list-group-item-warning");
    // }
};

// create time block elements
const createTimeBlockEl = (hour) => {
    // create formated time from hour
    hour = moment().hour(hour).format('H');
    
    // create timeblock div
    let timeBlockEl = $("<div>").addClass("row time-block").attr('id', `timeblock-${hour}`);

    // check time block status
    switch (true) {
        // past
        case (hour < currentTime):
            timeBlockEl.addClass('past');
            break;
        
        // present
        case (hour == currentTime):
            timeBlockEl.addClass('present');
            break;

        // future
        case (hour > currentTime):
            timeBlockEl.addClass('future');
            break;

        default:
            console.log("Problem in 'creatTimeBlockEl'");
            break;
    };
    
    let hourEl = $("<h6>").addClass("hour").text(`${moment().hour(hour).format("ha")}`);
    let textareaEl = $("<textarea>").addClass("description").attr('id', `textarea-${hour}`);
    let lockImg = $("<i>").addClass("fa-solid fa-lock");
    let saveBtnEl = $("<button>").addClass("saveBtn").append(lockImg).attr('id', `saveBtn-${hour}`);

    // create click listener for buttons
    timeBlocksListEl.on('click', `#saveBtn-${hour}`, function() {
        let text = $(`#textarea-${hour}`).val();
        if (text) {
            // add task to tasks list
        }
    });

    timeBlockEl.append(hourEl, textareaEl, saveBtnEl);

    timeBlocksListEl.append(timeBlockEl);
};

const createTimeBlockListEl = () => {
    let timeSlotHrs = [9,10,11,12,13,14,15,16,17];

    for (let i = 0; i < timeSlotHrs.length; i++) {
        createTimeBlockEl(timeSlotHrs[i]);
    }
};

createTimeBlockListEl();
