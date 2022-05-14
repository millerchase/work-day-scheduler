// grab and set today's date
let today = moment().format("dddd, MMMM Do");
$("#currentDay").text(today);

// set today's time
let currentTime = moment().hour();

// task list for saving  
let wdTasks;

// list of hours used in timeblock creation and auditing
const timeSlotHrs = [9,10,11,12,13,14,15,16,17];

// refs
const timeBlocksListEl = $("#time-blocks-list");

// create time block elements
const createTimeBlockEl = hour => {
    // create formated time from hour
    hour = moment().hour(hour).format('H');
    
    // create timeblock div
    let timeBlockEl = $("<div>").addClass("row time-block").attr('id', `timeblock-${hour}`);
    
    let hourEl = $("<h6>").addClass("hour").text(`${moment().hour(hour).format("ha")}`);
    let textareaEl = $("<textarea>").addClass("description").attr('id', `textarea-${hour}`);
    let lockImg = $("<i>").addClass("fa-solid fa-lock");
    let saveBtnEl = $("<button>").addClass("saveBtn").append(lockImg).attr('id', `saveBtn-${hour}`);

    // create click listener for buttons
    timeBlocksListEl.on('click', `#saveBtn-${hour}`, function() {
        let selectedTimeblock = `#textarea-${hour}`;
        let text = $(selectedTimeblock).val() || ' ';
        if (text) {
            tasks.push([selectedTimeblock, text]);
        }
        saveTasks(selectedTimeblock);
    });

    timeBlockEl.append(hourEl, textareaEl, saveBtnEl);

    timeBlocksListEl.append(timeBlockEl);
};

// create list of time block elements
const createTimeBlockListEl = () => {

    for (let i = 0; i < timeSlotHrs.length; i++) {
        createTimeBlockEl(timeSlotHrs[i]);
        auditTimeblock(timeSlotHrs[i]);
    }
};

const saveTasks = taskLocation => {

    if (tasks) {
        // check if there is already a saved task in timeblock and remove it if so
        for (let i = 0; i < tasks.length - 1; i++) {
            if (tasks[i][0] === taskLocation) {
                tasks.splice(i, 1);
            }
        }
        // remove empty items from tasks
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i][1] === ' ') {
                tasks.splice(i, 1);
            }
        }
    }

    localStorage.setItem("workdayTasks", JSON.stringify(tasks));
};

const loadTasks = () => {
    // grab tasks if they exist
    tasks = JSON.parse(localStorage.getItem("workdayTasks"));

    // if no tasks assign empty array
    if(!tasks) {
        tasks = [];
    }

    // if tasks assign tasks to appropriate timeblock
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            $(tasks[i][0]).val(tasks[i][1]);
        }
    }
};

// consolidate timeblock creation and task loading to be able to update regularly
const auditTimeblock = blockHr => {
    let timeBlockEl = $(`#timeblock-${blockHr}`);

    // remove pre existing status
    timeBlockEl.removeClass('past present future');

    // check time block time status
    switch (true) {
        // past
        case (blockHr < currentTime):
            timeBlockEl.addClass('past');
            break;
        
        // present
        case (blockHr == currentTime):
            timeBlockEl.addClass('present');
            break;

        // future
        case (blockHr > currentTime):
            timeBlockEl.addClass('future');
            break;

        default:
            console.log("Problem in timeblock audit");
            break;
    };
}

// application start
createTimeBlockListEl();
loadTasks();

// update time slot status every 30 minutes
setInterval(() => {
    for(let i = 0; i < timeSlotHrs.length; i++) {
        auditTimeblock(timeSlotHrs[i]);
    }
}, (1000*60) * 30);
