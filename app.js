// Initializes all of the necessary HTML elements
const formContainer = document.getElementById('form-container');
const listContainer = document.getElementById('list-container');

const newTaskButton = document.getElementById('new-task-button');
const formTaskButton = document.getElementById('alter-tasks-button');
const formCancelButton = document.getElementById('form-cancel-button');
const clearAllTasksButton = document.getElementById('clear-all');

const formContainerElement = document.getElementById('form-container');
const formTitleInput = document.getElementById('form-title');
const formDateInput = document.getElementById('form-date');
const formDescriptionInput = document.getElementById('form-description');

let taskData = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedTask = -1;

// Checks if the taskData array has elements in it on page load, if so call the method to load all of the task items.
if (taskData.length) {
    loadTaskData();
}

// Rewrites the date into an easier to read format.
// // Parameter is a date that will be converted.
function formatDate(date) {
    let newDate = new Date(date)
    return `${newDate.toDateString()} ${newDate.toLocaleTimeString()}`;
}

// Loads all of the task items into the listContainer
function loadTaskData() {
    // Clears the list container in case any task was edited or removed
    listContainer.innerHTML = ``;
    // Iterates through the taskData array.
    for (const index in taskData) {
        // Appends a the task item to the list container
        listContainer.innerHTML += `<div class="task" id="${index}">
            <div class="task-main-info">    
                <p><strong>Title:</strong> ${taskData[index].taskName}</p>
                <p><strong>Date:</strong> ${formatDate(taskData[index].taskDate)}</p>
            </div>
            <div class="task-description">
                <p><strong>Description:</strong> ${taskData[index].taskDescription}</p>
            </div>
            <div class="task-buttons">
                <h4 class="edit-button header-button">Edit</h4>
                <h4 class="delete-button header-button">Delete</h4>
            </div>
            </div>`
    }

    // Saves the current taskData array to storage.
    localStorage.setItem('tasks', JSON.stringify(taskData));

    // Calls the method to load the necessary eventHandlers for the edit and delete buttons.
    loadTaskButtonEvents()

    // Checks if the taskData array contains any items.
    if (taskData.length) {
        // If so, the clear all button is displayed to the user.
        clearAllTasksButton.classList.remove('hidden')
    } else {
        // If not, the clear all button is hidden from the user.
        clearAllTasksButton.classList.add('hidden')
    }
}

// Initializes a new taskObject to store the necessary information for each task item.
function taskObject(id, name, date, description) {
    this.taskID = id;
    this.taskName = name;
    this.taskDate = date;
    this.taskDescription = description;
}

// Reloads the various containers and inputs to their default state.
function reloadApp() {
    // Toggles the various UI elements to be hidden or displayed, based on their current state when the function is called.
    formContainer.classList.toggle('hidden');
    listContainer.classList.toggle('hidden');
    newTaskButton.classList.toggle('hidden');

    // Sets the currently selected task to -1.
    selectedTask = -1;

    // Calls the method to display the current tasks in the taskData array.
    loadTaskData();
}

// Displays the form container, also hides the listContainer and newTaskButton and performs other functions if edit mode is invoked.
// // Parameter is to signify if the containers should be set for editing a task or adding a task, if it is editing a task, the taskObj is passed in to set the values within the various inputs
function displayFormContainer(value, taskObj) {
        formContainer.classList.toggle('hidden');
        listContainer.classList.toggle('hidden');
        newTaskButton.classList.toggle('hidden');
        formTaskButton.innerHTML = "Add Task";
        formTitleInput.readOnly = false;
        clearAllTasksButton.classList.add('hidden')

        // Sets the user inputs on the formContainer to empty
        formTitleInput.value = ``;
        formDateInput.value = '';
        formDescriptionInput.value = ``;
    if (value) {
        // Sets the various inputs to the selected taskObj values
        formTitleInput.value = taskObj.taskName;
        formDateInput.value = taskObj.taskDate;
        formDescriptionInput.value = taskObj.taskDescription;

        // Makes the formTitle input readOnly to prevent the user from altering it.
        formTitleInput.readOnly = true;

        // Sets the text on the formTaskButton to be edit task.
        formTaskButton.innerHTML = "Edit Task";
    }
}

// Loads the event handlers for the edit and delete buttons on each task.
function loadTaskButtonEvents() {
    // Assigns a node list of all buttons to a variable.
    let headerButtons = listContainer.querySelectorAll('.header-button')

    // Loops through the node list.
    for (const button of headerButtons) {
        // Checks if current button contains the class .edit-button.
        if (button.classList.contains('edit-button')) {
            // If so, adds an eventListener that will activate once the element is clicked by the user. 
            // This event calls the method to preload the user inputs on the formContainer with the values 
            // in the respective task, and it passes in the id of the parent container.
            button.addEventListener('click', () => {
                preloadTask(button.parentElement.parentElement.getAttribute('id'));
            }, {once:true});
        } else {
            // If not, adds an eventListener that will activate once the element is clicked by the user.
            // This event calls the method to remove the task from the taskData array object, and it passes
            // in the id of the parent container.
            button.addEventListener('click', () => {
                removeTask(button.parentElement.parentElement.getAttribute('id'));
            }, {once:true});
        }
    }
}

// Checks if a newly created item is unique or edits an already made item in the taskData array.
// // The parameter is an object, and is a new task that is intended to be added at the end of the array.
function newItemCheck(newItem) {
    // Iterates through all items in the taskData array
    for (let i = 0; i < taskData.length; i++) {
        // Checks if the currently selected item has the same id as the passed in newly created item.
        if (taskData[i].taskID === newItem.taskID) {
            // If so return true, showing that the item was flagged as already existing.
            return true;
        };
    };
    // After iterating through the whole list and finding no similar items,
    // Push the newItem to the taskData array.
    taskData.push(newItem)

    // Returns false, showing that the newItem was unique and added to the array.
    return false;
};

// Removes the task located at the specified index from the taskData array.
// // The parameter is a number that specifies the location of the taskObj to be removed.
function removeTask(taskIndex) {
    // Triggers a confirm modal to ensure the user wishes 
    let result = confirm("Are you sure you want to permanently remove this item?")

    // Checks if the result from the confirm modal is true.
    if (result) {  
        // If the user confirms,

        // Removes the task from the specified index.
        taskData.splice(taskIndex, 1)

        // Calls the method to reload all of the task data.
        loadTaskData();
    }
}

// Removes all tasks from the taskData array.
function clearAllTasks() {
    let result = confirm("Warning, confirming will erase all tasks.")
    // Pops up a confirm modal to ensure the user wants to remove all items.
    if (result) {
            // Sets taskData to an equal to an empty array.
        taskData = [];
    }


    // Calls the function to load the taskData array.
    loadTaskData();
}

// Loads the respective values from the specified taskObj into the user inputs on the formContainer.
// // The parameter is a number that specifies the location of the taskObj.
function preloadTask(taskIndex) {
    // Calls the method to display the formContainer and to fill it with the values from the taskObj at the specified index
    // in the taskData array.
    displayFormContainer(true, taskData[taskIndex]);

    // Sets the global variable for the selected task equal to value passed in.
    selectedTask = taskIndex;
}

// Creates and returns the new taskObj based on the values in the user inputs on the formContainer.
function createNewTaskObj() {
    // Takes user inputs from the various inputs and assigns them to variables.
    let name = formTitleInput.value;
    let date = formDateInput.value;
    let description = formDescriptionInput.value;

    // Checks and ensures that all fields are filled with values.
    if (name === '' || date === '' || description === '') {
        // If any of the inputs are empty,

        // Popup a modal to alert the user to fill out all of the fields and return undefined.
        confirm("Please Fill Out All Fields!");
        return undefined;
    } else {
        // If all fields are filled,
        
        // Creates an id for the task in the form of the name which is converted to spinal-tap.
        let id = name.split(' ').join('-').toLowerCase()

        // Creates a new task item based on a new taskObject
        let newItem = new taskObject(id, name, date, description);

        // Returns the newly created item
        return newItem;
    }

}

// Edits the existing task at the currently selected task with the new values changed by the user.
function editTask() {
    // Checks that a task is currently selected.
    if (selectedTask !== -1) {
        // If so, the method to create a new taskObj is called and the result is stored in a variable.
        let replacementObj = createNewTaskObj();

        if (replacementObj !== undefined) {
            // Replaces the object at the specified index with the newly updated taskObj
            taskData[selectedTask] = replacementObj;

            // Calls the method to load the tasks from the taskObj.
            loadTaskData();

            // Calls the method to reset the app to its default state.
            reloadApp();
        }
    }
}

// Adds a task based on the values entered into the formContainer inputs
function addTask() {
    // Calls the method to create a new object based on the various inputs values and stores them in a variable.
    let newItem = createNewTaskObj() 
    
    if (newItem !== undefined) {
        // Calls the newItemCheck method to check if the newItem being added is unique,
        let result = newItemCheck(newItem);

        // Checks the result from the newItemCheck method
        if (result === false) {
            // If it is false, the item is unique was appended to the taskData array. 

            // Calls the method to reload the taskData array.
            loadTaskData();

            // Calls the method to reset the containers back to their default views.
            reloadApp();
        } else {
            // If the result was true, then the item was flagged as already existing.

            // Pops up a modal that warns the user the item title is already in use
            confirm('Item Already Exists in List, Please Choose a Different Title or Edit the Existing Item.');
        }
    }
}

// Loads all of the default event listeners
function loadDefaultEventListeners() {
    // Initializes the eventListeners necessary for creating a new task
    newTaskButton.addEventListener('click', () => {
        displayFormContainer(false);
    });
    formCancelButton.addEventListener('click', () => {
        // Provides a confirm modal to confirm the discarding of any changes.
        let result = confirm('Warning: this action will discard any changes made.');
        // If the user confirms, calls the resetContainer method.
        result ? reloadApp() : '';
    });

    // Initializes the eventListeners necessary for adding or editing a task.
    formTaskButton.addEventListener('click', () => {
        formTaskButton.innerHTML === "Add Task" ? addTask() : editTask();
    })

    // Initializes the evenListener for clearing all of the tasks from the taskData array.
    clearAllTasksButton.addEventListener('click', clearAllTasks)

    // Initializes the eventListener for the formContainerElement to prevent a webpage reload if the submit event occurs.
    formContainerElement.addEventListener('submit', (e) => {
        e.preventDefault();
    })
}

loadDefaultEventListeners();