/*...........................apiService to get data................... */

/* The function fetchData return a promise either success or error */
function fetchData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dokaudi.com/search_calender_database",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ ticker: "ixigo IN", user_id: "2" }),
      success: function (apiResponse) {
        resolve(apiResponse);
      },
      error: function (apiResponse) {
        reject(apiResponse);
      },
    });
  });
}

/* Process the API response and extract the required data to display */
function processTaskData(data) {
  return data.result.map((item) => {
    let assignedList = [];
    if (item.assigned_to_list_of_dict)
      assignedList = item.assigned_to_list_of_dict.map((person) => {
        const {
          client_id,
          first_name,
          middle_name,
          last_name,
          role,
          email,
          phone,
        } = person;

        /* Storing the full Name as a string seperated by space */

        const fullName = [first_name, middle_name, last_name]
          .filter(Boolean)
          .join(" ");

        return {
          id: client_id,
          fullName: fullName,
          role: role,
          maidId: email[0]?.email_address ?? null,
          phoneNo: phone[0]?.phone_number ?? null,
        };
      });
    const pro = item.progress ? Math.round(item.progress) : 0;
    return {
      id: item?.task_id ?? 1,
      assignedTo: assignedList,
      name: item?.title ?? "",
      startDate: item?.start ?? "2024-01-01",
      description: item?.description ?? "",
      nextUpdate: item.next_update,
      endDate: item?.end ?? "2024-12-31",
      rating: item?.rating ?? 1,
      status: item?.status ?? "close",
      // progress: item?.progress ?? 0
      progress: pro,
      weeklyUpdates: item?.updates ?? [],
      calender_id: item.id,
      source: item.source,
      weeklyUpdates: item?.updates ?? [],
      calender_id: item.id,
      source: item.source,
    };
  });
}

/* Exporting  the functions to make them accessible  */
window.apiService = {
  fetchData,
  processTaskData,
};

/* The Global variable named currentIndex that is used to keep track the current object in the array from the api*/
let currentIndex = 0;

/* getting the element with id assign from the dom */
const assignedTo = document.getElementById("assign");

/*
 Function that handles the pastUpdates along with the showMore and showLess Buttons
 dynamically 
*/
function pastUpdatesFunctionality() {
  /*getting all the required elements from the dom that are responsible for past updates*/
  let pastUpdates = document.getElementById("updateslist");

  /* getting all the list items in the as a node list */
  let allItems = pastUpdates.getElementsByTagName("li");

  /* targeting showMore Button */
  let showLessBtn = document.getElementById("show-less-button");

  /* targetting showLess Button */
  let showMoreBtn = document.getElementById("show-more-button");

  /* Targetting the header element of the past updates */
  let pastUpdatesHeader = document.getElementById("pastUpdatesHeader");

  /* hiding the showLessButton */
  showLessBtn.style.display = "none";

  /* Handling if there are no updates initially,
   conditionally rendering the header either to show or not to show */

  if (allItems.length === 0) {
    pastUpdatesHeader.style.display = "none";
  } else {
    pastUpdatesHeader.style.display = "block";
  }

  /*
   Function that is responsible to show only first two updates 
   and hide the rest and display show more Btn 
  */
  function showHideUpdates() {
    for (let i = 0; i < allItems.length; i++) {
      if (i > 1) {
        allItems[i].style.display = "none";
      } else {
        if (allItems[i].style.display === "none")
          allItems[i].style.display = "list-item";
      }
    }

    if (allItems.length > 2) {
      showMoreBtn.style.display = "block";
    } else {
      showMoreBtn.style.display = "none";
    }
  }

  /* 
  Call back Function that activates when showMore Button is clicked 
  and shows the rest of the updates along with the first two, hides
  the show more button and displays show less button
  */
  function showMore() {
    for (let i = 2; i < allItems.length; i++) {
      allItems[i].style.display = "list-item";
    }
    showMoreBtn.style.display = "none";
    showLessBtn.style.display = "block";
  }

  /*
  call back function that activates when show less button is clicked,
  shows only first 2 updates , hides the rest of the updates , displays
  show more button  , hides itself
  */
  function showLess() {
    for (let i = 2; i < allItems.length; i++) {
      allItems[i].style.display = "none";
    }
    showMoreBtn.style.display = "block";
    showLessBtn.style.display = "none";
  }

  /*
     Calling the showHidesFunction initially
     as this is default feature in our web page
  */
  showHideUpdates();

  /* 
  attaching the click event listeners to both Buttons along with call back functions separately
  */
  showMoreBtn.addEventListener("click", showMore);
  showLessBtn.addEventListener("click", showLess);
}

/*  
 Function that gets the current date in year-month-day format
 which is to set default date as today
*/
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/* 
When add update Button is clicked The model shows the todays date as the default date
*/
$("#addUpdateBtn").on("click", function () {
  $("#updateDate").val(getCurrentDate());
});

/* Intergrating  Summer Note for description with models  */
$(document).ready(function () {
  $("#updateDescription").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["fontname", ["fontname"]],
      ["color", ["color"]],
      ["fontsize", ["fontsize"]],
      ["para", ["ul", "ol"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview", "help"]],
      ["height", ["height"]],
    ],
    callbacks: {},
  });
  $("#updateDate").attr("value", getCurrentDate());
  $("#updateDescription").summernote("code", "");

  $("#updateDescription1").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["fontname", ["fontname"]],
      ["color", ["color"]],
      ["fontsize", ["fontsize"]],
      ["para", ["ul", "ol"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview", "help"]],
      ["height", ["height"]],
    ],
    callbacks: {},
  });

  $("#descriptionInput").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["fontname", ["fontname"]],
      ["color", ["color"]],
      ["fontsize", ["fontsize"]],
      ["para", ["ul", "ol"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview", "help"]],
      ["height", ["height"]],
    ],
    callbacks: {},
  });

  $("#taskNameInput").summernote({
    height: 200,
    placeholder: "Type your Task Name here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["fontname", ["fontname"]],
      ["color", ["color"]],
      ["fontsize", ["fontsize"]],
      ["para", ["ul", "ol"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview", "help"]],
      ["height", ["height"]],
    ],
    callbacks: {},
  });
});

/* Function that is responsible to add the update */
function AddUpdate(Task) {
  $("#updateModal")
    .off("click", "#saveUpdateBtn")
    .on("click", "#saveUpdateBtn", function () {
      /* getting the date entered from the model */
      let date = $("#updateDate").val();

      /* getting the description from the model */
      let desc = $("#updateDescription").summernote("code");

      /* if the date is invalid shows alert message */
      if (date == "") {
        alert("Date is invalid please select Date");
      } else if (desc == "") {
        /* if there is no description */
        alert("please enter Description");
      }

      //  both are entered
      else {
        /*formatting the date to display*/

        date = formatDate(date);

        /* creating a div */
        let tempElement = document.createElement("div");

        /* updating the innerhtml */
        tempElement.innerHTML = desc.trim();

        /*geting the description entered from the model */
        let descText = tempElement.textContent || tempElement.innerText || "";

        /* removing the unnecessary white spaces at the beginning of the string */
        descText = descText.trim();

        /* adding the listItem at the beginning of the list*/
        Task.weeklyUpdates.unshift({ date: date, desc: descText });

        /* Updating the changes in the data base*/
        UpdateTaskInDatabase(Task);

        /* Updating in the dom */
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${date}:</strong> ${descText.trim()} <i id="icon" class="fa fa-trash" aria-hidden="true"
        style='color: red'></i>`;

        /* adding in the front of updates List */
        $("#updateslist").prepend(listItem);

        /* after updating calling the function that handles pastUpdates*/
        pastUpdatesFunctionality();

        /* Clear Summernote content */
        $("#updateDescription").summernote("code", "");

        /* hiding the Mode */
        $("#updateModal").modal("hide");
      }
    });
}

/* function that is responsibe to show the details of the Task in the wep page dynamically */

function updateTaskDetails(Task) {
  /* getting the status from the JSon  */
  const initialStatus = Task.status;
  const id = Task.id;
  const idElement = document.getElementById("id");
  idElement.innerHTML = `<b>Task id :</b> ${id}`;
  /* getting taskId element */
  const taskid = document.getElementById("taskid");

  /* getting progress element */
  const progress = document.getElementById("progressDisplay");

  /* getting description element from the dom */
  const desc = document.getElementById("desc");

  /* getting assignedTo element from the dom */
  const assignedto = document.getElementById("assign");

  /* getting rating element from the dom  */
  const rating = document.getElementById("rating");

  /* getting all the radio buttons from the dom */
  let openStatus = document.getElementById("open");
  let closeStatus = document.getElementById("close");
  let passiveStatus = document.getElementById("passive");

  /* mark the status based on the initialStatus value */
  if (initialStatus === "open") {
    openStatus.checked = true;
  } else if (initialStatus === "close") {
    closeStatus.checked = true;
  } else if (initialStatus === "passive") {
    passiveStatus.checked = true;
  }

  /* updating taskId  */
  taskid.innerHTML = `<b>Project :</b> ${Task.name}`;

  /* updating description */
  desc.innerHTML = `<strong>Description:</strong> ${Task.description}`;

  /* getting assigned ones array */
  const AssignedCandidates = Task.assignedTo;

  /* clearing previous content */
  assignedTo.innerHTML = "";

  /* Adding progress*/
  progress.value = `${Task.progress}`;

  /* creating a div element */
  const Div = document.createElement("div");

  /* creating an ol element */
  const candidatesList = document.createElement("ol");

  /* attaching id */
  candidatesList.id = "candidatesList";

  /* for each person in the assigned candidates creating a list Item */

  AssignedCandidates.forEach(function (person) {
    // +", " + person.role;
    const candidate = person.fullName;
    const listItem = document.createElement("li");

    listItem.innerHTML = `<a href="https://dokaudi.com/profile?client_id=${person.id}" target="_blank" style="text-decoration: none;color: black;"> ${candidate}</a> `;

    /* If the person has a phoneNO then display phone , whatsapp icon
       along with their functionalities */
    if (person.phoneNo) {
      listItem.innerHTML += `<a href="tel:+91${person.phoneNo}"><i class="fa fa-phone" aria-hidden="true"></i></a> `;
      listItem.innerHTML += `<a href="https://api.whatsapp.com/send?phone=91${person.phoneNo}&amp;text=Hi%20${candidate}" target="_blank" class="text-success"><i class="fab fa-whatsapp mr-2" aria-hidden="true"></i></a>`;
    }

    /* If the person has the mailId then display the mail icon along with mailto functionality*/

    if (person.maidId) {
      listItem.innerHTML += `<a href="mailto:${person.maidId}?subject=Hello&body=Hi%20${candidate}!">
      <i class="fas fa-envelope action-icon" style="cursor: pointer; color: black; min-width: 5px;" aria-hidden="true"></i></a> `;
    }

    /* Attaching the delete icon */
    listItem.innerHTML += `<i class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;

    candidatesList.appendChild(listItem);
  });

  /* appending the list to the div */
  Div.appendChild(candidatesList);

  /* updating assignedto */
  assignedto.innerHTML = `<strong>Assigned to:</strong><i id="editIcon" class="fa fa-plus" aria-hidden="true"> </i>`;
  assignedTo.appendChild(candidatesList);

  /* updating rating */
  rating.innerHTML = `<strong>Rating:</strong> <span class="star-rating"><a href="#">${generateStarRating(
    Task.rating
  )}</a></span>`;

  /* function that gets the stars with colour based on the rating number */
  function getStars(color) {
    const fullStars = document.querySelectorAll(".full-star");
    fullStars.forEach((star) => {
      star.style.color = color;
    });
  }
  switch (Task.rating) {
    case 1:
      getStars("#44ce1b");
      break;
    case 2:
      getStars("#bbdb44");
      break;
    case 3:
      getStars("#f7e379");
      break;
    case 4:
      getStars("#f2a134");
      break;
    case 5:
      getStars("#e51f1f");
      break;
  }

  /* getting the nextUpdateElement from the dom */

  const nextUpdateInput = document.getElementById("nextUpdateDate");

  /* function that sets the start date of the each Task dynamically from the JSON*/

  setStartDate(Task);

  /* function that sets the end date of the each Task dynamically from the JSON */
  setEnddate(Task);

  /* getting the nextUpdate from the Json  */
  const defaultDate = Task.nextUpdate;

  /* updating in the UI */
  nextUpdateInput.value = defaultDate;

  /* getting the updatesList element from the dom */
  const updates = document.getElementById("updateslist");

  updates.innerHTML = "";

  /* getting the updates from the JSON if exists*/
  if (Task.weeklyUpdates) {
    const addUpdates = Task.weeklyUpdates;

    addUpdates.forEach(function (update) {
      let listItem = document.createElement("li");
      listItem.setAttribute("id", update.update_id);
      listItem.innerHTML = `<strong>${update.date}:</strong> ${update.desc} <i id="icon" update_id=${update.update_id} class="fa fa-trash " aria-hidden="true"
      style='color: red'></i>`;

      updates.appendChild(listItem);
    });
  }

  /* calling  pastUpdates function */
  pastUpdatesFunctionality();

  /* calling editName function */
  handleDeleteAssigne(Task.assignedTo, Task);

  /* calling Function that handles TaskId (single click to edit) */
  handleTaskId(Task);

  /* calling Function that handles Descripton (single click to edit ) */
  handleDescription(Task);

  /* calling Function that is responsible to edit the id of the task */
  changeId(Task);

  /* calling Function that is responsible to add update */
  AddUpdate(Task);

  /*calling  function that is responsible to edit the past updates on single click */
  handleDoubleClick(Task);

  /*calling the addAssignee function */
  addAssignee(Task);

  /* function that is responsible to delete the updates when clicked on the delete icon dynamically */
  handleDelete(Task);

  /* Function that is responsible to delete the entire task */
  DeleteTask(Task);
}

document.addEventListener("DOMContentLoaded", function () {
  /* targetting the loading element */
  const loadingOverlay = document.getElementById("loading-overlay");

  /* targetting the Task Container */
  const Container = document.getElementById("TaskContainer");

  /* initially hiding the container until the data is fetched from the api */
  Container.style.display = "none";

  /* Show the loading overlay initially until the data is feteched from the api */
  loadingOverlay.style.display = "block";

  var taskDetails;
  var details = [];
  /* getting the data from the api */
  window.apiService
    .fetchData()
    .then((apiResponse) => {
      /* Task details */
      taskDetails = window.apiService.processTaskData(apiResponse);

      /* getting the id from the local Storage */
      const getId = localStorage.getItem("taskId");
      // console.log(getId);

      /* getting the index from the taskDetails */
      const getInd = taskDetails.findIndex(function (item) {
        return item.id == getId;
      });

      /* if it exists the updating the current index */
      if (getInd !== -1) {
        currentIndex = getInd;
      }

      /* getting the Current Task object from the Json */
      const Task = taskDetails[currentIndex];

      /* updating in the UI */
      updateTaskDetails(Task);

      /* handling date event listeners */
      handleDates(taskDetails);

      /* handling progress listeners */
      handleProgress(taskDetails);

      /* targetting the previous element from the html Dom */
      const prev = document.getElementById("prev");

      /* adding click event listener to the previous Button */
      prev.addEventListener("click", function () {
        currentIndex =
          (currentIndex - 1 + taskDetails.length) % taskDetails.length;
        document.getElementById("selectedOption").innerHTML =
          taskDetails[currentIndex].name;
        updateTaskDetails(taskDetails[currentIndex]);
      });

      /* targetting the next Button */
      const next = document.getElementById("next");

      /* adding click event listener to the previous button */
      next.addEventListener("click", function () {
        currentIndex++;
        if (currentIndex > taskDetails.length - 1) {
          currentIndex = 0;
        }
        document.getElementById("selectedOption").innerHTML =
          taskDetails[currentIndex].name;
        updateTaskDetails(taskDetails[currentIndex]);
      });

      /* logic for tasks and assignees */

      const TasksAndAssigneeContainer = document.querySelector(
        ".TaskAndAssigneeInfo"
      );

      taskDetails.forEach((item) => {
        item.assignedTo.forEach((assignee) => {
          const index = details.findIndex(
            (item) => item.name === assignee.fullName
          );

          if (index !== -1) {
            details[index].count += 1;
            details[index].avg += item.progress;
            details[index].avg = parseFloat(
              details[index].avg / details[index].count
            ).toFixed(2);
          } else {
            details.push({
              name: assignee.fullName,
              count: 1,
              avg: item.progress,
            });
          }
        });
      });
      const sortbtns = document.querySelectorAll(".taskassigne");
      sortbtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          showDetails(details, e.target.id);
        });
      });

      showDetails(details);
      function showDetails(details, name) {
        if (details) {
          switch (name) {
            case "name":
              details = details.sort((a, b) => {
                return a.name.localeCompare(b.name);
              });
              break;
            case "count":
              details.sort((a, b) => {
                return a.count - b.count;
              });
              break;
            case "avg":
              details.sort((a, b) => {
                return a.avg - b.avg;
              });
              break;
            default:
              console.log("I am called");
              details.sort((a, b) => {
                return a.name.localeCompare(b.name);
              });
          }

          TasksAndAssigneeContainer.innerHTML = "";
          details.forEach((item) => {
            const rowdiv = document.createElement("div");
            rowdiv.classList.add("row");
            rowdiv.classList.add("mb-2");
            const coldiv1 = document.createElement("div");
            coldiv1.classList.add("col");
            coldiv1.innerHTML = `
          ${item.name}`;
            const coldiv2 = document.createElement("div");
            coldiv2.classList.add("col");
            coldiv2.innerHTML = `
          ${item.count}`;
            const coldiv3 = document.createElement("div");
            coldiv3.classList.add("col");
            coldiv3.innerHTML = item.avg;
            rowdiv.appendChild(coldiv1);
            rowdiv.appendChild(coldiv2);
            rowdiv.appendChild(coldiv3);
            TasksAndAssigneeContainer.appendChild(rowdiv);
          });
        }
      }

      // /*Targetting the navbars for smaller screen as well as large one */        ---------------------------->dropdown
      const navBarDropDown = document.getElementById("navBarDropDown");
      const navBarDropDown1 = document.getElementById("navBarDropDown1");
      if (navBarDropDown && navBarDropDown1) {
        taskDetails.forEach((task) => {
          const idparts = task.id.split(".");
          const indentation = idparts.length * 10;
          navBarDropDown.innerHTML += `<a style='padding-left:${indentation}px' href="#tasks" data-target="#tasks" class="dropdown-item" onclick="selectItem('${task.name}')" data-task-id= ${task.id} > ${task.name} </a>`;
          navBarDropDown1.innerHTML += `<a style='padding-left:${indentation}px' href="#tasks" data-target="#tasks" class="dropdown-item" onclick="selectItem('${task.name}')" data-task-id= ${task.id} > ${task.name} </a>`;
          // console.log(
          //   `<a style='padding-left:${indentation}px' href="#tasks" class="dropdown-item"  data-task-id= ${task.id} > ${task.name} </a>`
          // );
        });
      }
      dropdownItems = document.querySelectorAll(
        "#navBarDropDown .dropdown-item"
      );
      dropdownItems1 = document.querySelectorAll(
        "#navBarDropDown1 .dropdown-item"
      );

      function handleClick(e) {
        e.preventDefault();
        const taskId = this.getAttribute("data-task-id");
        if (taskId) {
          localStorage.setItem("taskId", taskId);
          // console.log(taskId);
          const storedTaskId = localStorage.getItem("taskId");
          // console.log(storedTaskId);

          /* getting the id from the local Storage */
          const getId = localStorage.getItem("taskId");
          // console.log(getId);

          /* getting the index from the taskDetails */
          const getInd = taskDetails.findIndex(function (item) {
            return item.id == getId;
          });

          /* if it exists the updating the current index */
          if (getInd !== -1) {
            currentIndex = getInd;
          }

          updateTaskDetails(taskDetails[currentIndex]);

          // Get the content based on the selected task ID
          // let newContent = getContentForTaskId(taskId);

          // // Update the inner HTML of the target element
          // const targetElement = document.getElementById("TaskContainer");
          // if (targetElement) {
          //   targetElement.innerHTML = newContent;
          // }

          // Reload the page or navigate to the specified location if needed
        }
      }

      /* adding click events the dropdown items in both navs */
      dropdownItems.forEach((item) => {
        item.addEventListener("click", handleClick);
      });

      dropdownItems1.forEach((item) => {
        item.addEventListener("click", handleClick);
      });

      /* function that gets today */
      function getToday() {
        let date = new Date();

        let year = date.getFullYear();

        let month = (date.getMonth() + 1).toString();
        month = month.padStart(2, "0");

        let day = date.getDay().toString();

        day = day.padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      /*..................... Add New Task........................*/

      /* targetting the add task tab */
      const TaskForminNav = document.getElementById("addTaskitem");

      /* targetting the actual form in the task form model */
      const form = document.getElementById("taskForm");

      /* targetting the submitter */
      const submitter = document.querySelector("button[value=Formsubmit]");

      /* targetting the check box in the form */
      const checkedBox = document.getElementById("enableSubTask");

      /* targetting the subTaskDropDown */
      const subTaskDropDown = document.getElementById("subtaskof");

      /* attaching event listner to the check box */
      checkedBox.addEventListener("change", function (e) {
        if (this.checked) {
          subTaskDropDown.disabled = false;
        } else {
          subTaskDropDown.disabled = true;
        }
      });

      /* updating the nextupdate value to the today's date */
      document.getElementById("nextUpdatedatepicker").value = getCurrentDate();

      /* updating the startdate to the today's date as default one */
      document.getElementById("formStartDatePicker").value = getCurrentDate();

      /* updating the enddate to the today's date as default one */
      document.getElementById("formEndDatePicker").value = getCurrentDate();

      /* attaching submit event to the form */
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form, submitter);

        const formDataJSON = {};
        for (const [name, value] of formData.entries()) {
          // formDataJSON[name] = value;
          if (formDataJSON[name]) {
            if (!Array.isArray(formDataJSON[name])) {
              formDataJSON[name] = [formDataJSON[name]];
            }
            formDataJSON[name].push(value);
          } else {
            formDataJSON[name] = value;
          }
        }

        formDataJSON["className"] = "ixigo IN";
        // console.log(formDataJSON);
        localStorage.setItem("newObject", JSON.stringify(formDataJSON));

        /*.............................Sending JSON to insert_calender_database..... */

        $.ajax({
          url: "https://dokaudi.com/insert_calender_database",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(formDataJSON),
          success: function (apiResponse) {
            // console.log(apiResponse["result"]);
            ticker = apiResponse.result;
            location.reload();
            processData(ticker);
          },
          error: function (apiResponse) {
            alert(error);
            console.error(
              "Error fetching director details from the database: ",
              apiResponse
            );
          },
        });

        /* clearing all the form fields except the date fields after submission */
        this.reset();

        /* updating the nextupdate value to the today's date */

        document.getElementById("nextUpdatedatepicker").value = getToday();

        /* updating the startdate to the today's date as default one */
        document.getElementById("formStartDatePicker").value = getToday();

        /* updating the enddate to the today's date as default one */
        document.getElementById("formEndDatePicker").value = getToday();

        $("#taskModal").modal("hide");

        /* toggleing the active class */
        TaskForminNav.classList.toggle("active");
      });

      TaskForminNav.addEventListener("click", function (e) {
        e.preventDefault();
        TaskForminNav.classList.toggle("active");
      });

      /* toggling the active class when the close button is clicked */
      const TaskFormCloseBtn = document.getElementById("TaskFormCloseButton");
      TaskFormCloseBtn.addEventListener("click", function () {
        TaskForminNav.classList.toggle("active");
      });

      /* function that populates the subtasks dynamically */
      function populateSubtaskOptions() {
        const subtaskSelect = document.getElementById("subtaskof");

        /* Clear existing options */
        subtaskSelect.innerHTML = "";

        /* Add a default option */
        const defaultOption = document.createElement("option");
        defaultOption.text = "Select a subtask";
        defaultOption.value = "";
        subtaskSelect.add(defaultOption);
        /* Adding each task  */
        taskDetails.forEach((task) => {
          const option = document.createElement("option");
          // option.text = task.name;
          option.innerHTML = task.name;
          option.value = task.id;
          subtaskSelect.add(option);
        });
      }

      populateSubtaskOptions();
      /* Once we got the data from the api hiding the loader 
      and showing the container
       */
      loadingOverlay.style.display = "none";
      Container.style.display = "block";
    })
    .catch((error) => {
      alert(error.statusText);
      console.error("Error fetching data from the API:", error);
    });
});

/* generating the stars dynamically */
function generateStarRating(rating) {
  /* Number of full stars */
  const fullStarsCount = Math.floor(rating);

  /* Number of empty stars */
  const emptyStarsCount = 5 - fullStarsCount;

  let starsHTML = "";

  /*adding fullstars  */
  for (let i = 0; i < fullStarsCount; i++) {
    starsHTML += '<span class="full-star"  data-value="full">★</span>';
  }

  /* adding emptystars */
  for (let i = 0; i < emptyStarsCount; i++) {
    starsHTML += '<span class="empty-star" data-value="empty">☆</span>';
  }

  return `<div class="star-rating" >${starsHTML}</div>`;
}

/* function that formatsDate */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/* function that handles delete of an past update */
function handleDelete(Task) {
  function handle(event) {
    const listItem = event.target.parentNode;
    const get = listItem.textContent.split(":");

    if (event.target.classList.contains("fa-trash")) {
      if (listItem && listItem.parentNode) {
        $("#deleteModal").modal("show");
      }
    }
    $("#deleteModal")
      .off("click", "#deleteUpdateButton")
      .on("click", "#deleteUpdateButton", function () {
        Task.weeklyUpdates = Task.weeklyUpdates.filter((item) => {
          return item.update_id != event.target.getAttribute("update_id");
        });
        // console.log(Task);
        UpdateTaskInDatabase(Task);
        listItem.parentNode.removeChild(listItem);
        pastUpdatesFunctionality();
        $("#deleteModal").modal("hide");
      });
  }

  /* Remove previous event listener before adding a new one */
  document.getElementById("updateslist").removeEventListener("click", handle);

  /* Add new event listener with the current index */
  document.getElementById("updateslist").addEventListener("click", handle);
}

/* getting the date from the string */
function getData1(Date) {
  let month = "";
  month = Date.slice(0, 3);
  month = month.toLowerCase();
  switch (month) {
    case "jan":
      month = 1;
      break;
    case "feb":
      month = 2;
      break;
    case "mar":
      month = 3;
      break;
    case "apr":
      month = 4;
      break;
    case "may":
      month = 5;
      break;
    case "jun":
      month = 6;
      break;
    case "jul":
      month = 7;
      break;
    case "aug":
      month = 8;
      break;
    case "sep":
      month = 9;
      break;
    case "oct":
      month = 10;
      break;
    case "nov":
      month = 11;
      break;
    case "dec":
      month = 12;
      break;
    default:
      month = -1;
      break;
  }
  if (month == -1) {
    return Date;
  }
  let x = Date.slice(4);
  let Day = parseInt(x).toString();
  if (Day.length < 2) {
    Day = "0" + Day;
  }
  month = month.toString();
  if (month.length < 2) {
    month = "0" + month;
  }
  let y = Date.slice(-4);
  let year = parseInt(y);
  return `${year}-${month}-${Day}`;
}

/* function that handles edit of a pastUpdate on click  */
function handleDoubleClick(Task) {
  const updatesList = document.getElementById("updateslist");

  function handleListDoubleClick(event) {
    let Dateinstring;
    let initialDesc;

    const liElement = event.target.closest("li");
    const id = liElement.getAttribute("id");

    const update = Task.weeklyUpdates.filter((item) => item.update_id == id);

    if (liElement) {
      const childNodes = event.target.childNodes;
      if (childNodes && childNodes.length >= 2) {
        let Date = childNodes[0].textContent;

        Date = Date.slice(0, Date.length - 1);
        Dateinstring = Date.trim();
        if (update) initialDesc = update[0].desc;

        $("#updateModal1").modal("show");

        Date = getData1(Date);

        $("#updateDate1").val(Date);
        $("#updateDescription1").summernote("code", update[0].desc);
      }

      $("#updateModal1")
        .off("click", "#save1")
        .on("click", "#save1", handleSaveButtonClick);

      function handleSaveButtonClick() {
        const EditedDate = $("#updateDate1").val();
        const EditedDescription = $("#updateDescription1").summernote("code");
        if (EditedDate && EditedDescription) {
          const newContent = `<strong>${formatDate(
            EditedDate
          )}:</strong> ${EditedDescription} <i id="icon" class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;
          liElement.setAttribute("id", id);
          liElement.innerHTML = newContent;

          Task.weeklyUpdates = Task.weeklyUpdates.map((update) => {
            if (update.date == Dateinstring && update.desc == initialDesc) {
              return {
                date: formatDate(EditedDate).trim(),
                desc: EditedDescription.trim(),
                update_id: id,
              };
            }
            return update;
          });

          UpdateTaskInDatabase(Task);

          //Update in local stroage
          const localStorageData =
            JSON.parse(localStorage.getItem("filteredTasks")) || [];
          const oldTaskId = Task.id; // assuming taskId is unique
          const taskToUpdate = localStorageData.find(
            (task) => task.id === oldTaskId
          );
          const newDescription = EditedDescription; // Replace with your new progress
          if (taskToUpdate) {
            taskToUpdate.desc = newDescription;
          }
          localStorage.setItem(
            "filteredTasks",
            JSON.stringify(localStorageData)
          );
        }
        $("#updateModal1").modal("hide");
        $("#updateDescription1").summernote("code", "");
      }
    }
  }

  /* initially the event is double click to make it work fine with mobile modified to single click */
  updatesList.addEventListener("click", handleListDoubleClick);
}

// data for assigned to from the api used in the add task form
var ticker;
var responseData;

/*......................................get_ticker_database......................... */
$.ajax({
  url: "https://dokaudi.com/get_ticker_database",
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify({ ticker: "ixigo IN" }),
  success: function (apiResponse) {
    ticker = apiResponse.result;
    processData(ticker);
  },
  error: function (apiResponse) {
    console.error("Error fetching director details from the database:");
  },
});

let apiData;
function processData(data) {
  apiData = data;
  const selectAssigneeInForm = document.getElementById("addAssignee1");

  if (selectAssigneeInForm && apiData) {
    const assignees = [];
    apiData.forEach((item) => {
      let name =
        item.client_first_name +
        " " +
        item.client_middle_name +
        " " +
        item.client_last_name;
      assignees.push({ name: name, clientId: item.client_id });
      // let assignOption = `<option clientid="${item.client_id}" value="${item.client_id}">${name}</option>`;
      // selectAssigneeInForm.innerHTML += assignOption;
    });
    assignees.sort((a, b) => a.name.localeCompare(b.name));
    assignees.forEach((assignee) => {
      let assignOption = `<option clientid="${assignee.clientId}" value="${assignee.clientId}">${assignee.name}</option>`;
      selectAssigneeInForm.innerHTML += assignOption;
    });
  }
}

/* 
  Function that deletes the assignee when clicked on delete icon 
*/
function handleDeleteAssigne(Assigned, Task) {
  /* getting the assignees list from the dom */
  const candidatesNames = document.getElementById("candidatesList");

  /* callback function that triggers when delete icon is clicked */
  function DeleteAssignee(e) {
    if (e.target.classList.contains("fa-trash")) {
      const name = e.target.parentNode.textContent.trim();

      candidatesNames.removeChild(e.target.parentNode);
      // + ", " + item.role
      const id = Assigned.findIndex((item) => {
        return item.fullName == name;
      });

      Task.assignedTo = Task.assignedTo.filter((item, currentIndex) => {
        return currentIndex != id;
      });

      UpdateTaskInDatabase(Task);
    }
  }
  candidatesNames.addEventListener("click", DeleteAssignee);
}

const AssignedTo = document.getElementsByTagName("ol");

function changeId(Task) {
  const idElement = document.getElementById("id");
  idElement.addEventListener("click", (e) => {
    e.stopPropagation();
    const initialId = idElement.textContent.split("id :")[1].trim();

    $("#editidModal").modal("show");
    $("#idInput").val(initialId);
    $("#editidModal")
      .off("click", "#saveIDBtn")
      .on("click", "#saveIDBtn", function () {
        let updatedId = $("#idInput").val();
        if (updatedId) {
          idElement.innerHTML = `<b>id :</b> ${updatedId}`;
          Task.id = updatedId;
          UpdateTaskInDatabase(Task);
          $("#editidModal").modal("hide");
        } else {
          alert("Please enter a valid id");
        }
      });
  });
}

/* function that handles the Task if already exist */
function showModal() {
  // Show the Bootstrap modal
  $("#taskExistsModal").modal("show");
}

/* function that handles the description on click */
function handleDescription(Task) {
  const Description = document.getElementById("desc");
  // updated to click event to make it work with mobile
  Description.addEventListener("click", function () {
    const DescriptionElement = document.getElementById("desc").textContent;
    const currentDescription =
      DescriptionElement.split("Description:")[1].trim();
    $("#editDescriptionModal").modal("show");
    $("#descriptionInput").summernote("code", currentDescription);
  });
  $("#editDescriptionModal")
    .off("click", "#saveDescriptionBtn")
    .on("click", "#saveDescriptionBtn", function () {
      let descriptionFromSummerNote = $("#descriptionInput").summernote("code");

      if (descriptionFromSummerNote === "") {
        alert("Please enter a valid description");
      } else {
        Description.innerHTML = `<strong>Description:</strong> ${descriptionFromSummerNote}`;
        // console.log("I will update in db for task desc");
        Task.description = descriptionFromSummerNote;
        UpdateTaskInDatabase(Task);

        //Update in local stroage
        console.log(Task);
        const localStorageData =
          JSON.parse(localStorage.getItem("filteredTasks")) || [];
        const oldTaskId = Task.calender_id; // assuming taskId is unique
        const taskToUpdate = localStorageData.find(
          (task) => task.calender_id === oldTaskId
        );
        const newDescription = descriptionFromSummerNote; // Replace with your new progress
        if (taskToUpdate) {
          taskToUpdate.description = newDescription;
        }
        localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
        // Trigger the click event on the link to activate the "task_details" pill
        $('[href="#task_details"]').click();

        $("#editDescriptionModal").modal("hide");
      }
    });
}

/* function that handles the taskName on click */
function handleTaskId(Task) {
  const TaskIdElement = document.getElementById("taskid");

  function cbfortaskid(e) {
    const TaskIdElementTextContent =
      document.getElementById("taskid").textContent;
    const TaskIdInitial = TaskIdElementTextContent.split("Project :")[1].trim();

    $("#taskNameInput").summernote("code", TaskIdInitial);
    $("#editTaskNameModal").modal("show");
  }

  TaskIdElement.addEventListener("click", cbfortaskid);

  $("#editTaskNameModal")
    .off("click", "#saveTaskNameBtn")
    .on("click", "#saveTaskNameBtn", function () {
      const TaskIdFromSummerNote = $("#taskNameInput").summernote("code");
      if (TaskIdFromSummerNote === "") {
        alert("Please enter a valid TaskId");
      } else {
        TaskIdElement.innerHTML = `<strong>Project : </strong>${TaskIdFromSummerNote}`;

        Task.name = TaskIdFromSummerNote;
        console.log("I will update in the db for Task Id");
        UpdateTaskInDatabase(Task);

        // Update in local storage
        const localStorageData =
          JSON.parse(localStorage.getItem("filteredTasks")) || [];
        const oldTaskId = Task.calender_id; // assuming taskId is unique
        const taskToUpdateIndex = localStorageData.findIndex(
          (task) => task.calender_id === oldTaskId
        );

        if (taskToUpdateIndex !== -1) {
          const newTaskName = TaskIdFromSummerNote;
          localStorageData[taskToUpdateIndex].name = newTaskName;

          // Update local storage with the modified data
          localStorage.setItem(
            "filteredTasks",
            JSON.stringify(localStorageData)
          );
          console.log("Task updated successfully");
        } else {
          console.warn("Task not found in local storage");
        }

        //handleButtonClick();
        $("#editTaskNameModal").modal("hide");
      }
    });
}

/* functions that sets the startDate in dom of each Task dynamically from the Json */
function setStartDate(Task) {
  const startDateElement = document.getElementById("startDatePicker");
  const startDate = Task.startDate;
  if (startDate) startDateElement.value = startDate;
}

/* function that sets the endDate in dom of each Task dynamically from the Json */
function setEnddate(Task) {
  const endDateElement = document.getElementById("endDatePicker");

  const endDate = Task.endDate;
  if (endDate) endDateElement.value = endDate;
}

// Function to enable editing when clicking on the input
function enableEdit(input) {
  input.readOnly = false;
}

/* 
function that is responsible to handle progress in the dom 
and update in the db
*/
function handleProgress(taskDetails) {
  const progressInput = document.getElementById("progressDisplay");
  progressInput.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.progress = progressInput.value;
    UpdateTaskInDatabase(Task);

    // Update in local storage
    const localStorageData =
      JSON.parse(localStorage.getItem("filteredTasks")) || [];
    const oldTaskId = Task.calender_id; // assuming taskId is unique
    const taskToUpdateIndex = localStorageData.findIndex(
      (task) => task.calender_id === oldTaskId
    );

    if (taskToUpdateIndex !== -1) {
      const newProgress = progressInput.value;
      localStorageData[taskToUpdateIndex].progress = newProgress;
      // Update local storage with the modified data
      localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
      console.log("Task updated successfully");
    } else {
      console.warn("Task not found in local storage");
    }
  });
}

/* 
function that is responsible to handle dates change in the dom 
and update in the db
*/
function handleDates(taskDetails) {
  const startDate = document.getElementById("startDatePicker");
  startDate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.startDate = startDate.value;
    UpdateTaskInDatabase(Task);
    // Update in local storage
    const localStorageData =
      JSON.parse(localStorage.getItem("filteredTasks")) || [];
    const oldTaskId = Task.calender_id; // assuming taskId is unique
    const taskToUpdateIndex = localStorageData.findIndex(
      (task) => task.calender_id === oldTaskId
    );

    if (taskToUpdateIndex !== -1) {
      const newStartDate = startDate.value;
      localStorageData[taskToUpdateIndex].startDate = newStartDate;
      // Update local storage with the modified data
      localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
      console.log("Task updated successfully");
    } else {
      console.warn("Task not found in local storage");
    }
  });
  const endDate = document.getElementById("endDatePicker");
  endDate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.endDate = endDate.value;
    UpdateTaskInDatabase(Task);
    // Update in local storage
    const localStorageData =
      JSON.parse(localStorage.getItem("filteredTasks")) || [];
    const oldTaskId = Task.calender_id; // assuming taskId is unique
    const taskToUpdateIndex = localStorageData.findIndex(
      (task) => task.calender_id === oldTaskId
    );

    if (taskToUpdateIndex !== -1) {
      const newEndDate = endDate.value;
      localStorageData[taskToUpdateIndex].endDate = newEndDate;
      // Update local storage with the modified data
      localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
      console.log("Task updated successfully");
    } else {
      console.warn("Task not found in local storage");
    }
  });
  const nextUpdate = document.getElementById("nextUpdateDate");
  nextUpdate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.nextUpdate = nextUpdate.value;
    UpdateTaskInDatabase(Task);
    // Update in local storage
    const localStorageData =
      JSON.parse(localStorage.getItem("filteredTasks")) || [];
    const oldTaskId = Task.calender_id; // assuming taskId is unique
    const taskToUpdateIndex = localStorageData.findIndex(
      (task) => task.calender_id === oldTaskId
    );

    if (taskToUpdateIndex !== -1) {
      const newnextUpdate = nextUpdate.value;
      localStorageData[taskToUpdateIndex].nextUpdate = newnextUpdate;
      // Update local storage with the modified data
      localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
      console.log("Task updated successfully");
    } else {
      console.warn("Task not found in local storage");
    }
  });
  const radioBtnDiv = document.getElementById("radioBtnDiv");
  radioBtnDiv.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.status = e.target.value;
    UpdateTaskInDatabase(Task);
    // Update in local storage
    const localStorageData =
      JSON.parse(localStorage.getItem("filteredTasks")) || [];
    const oldTaskId = Task.calender_id; // assuming taskId is unique
    const taskToUpdateIndex = localStorageData.findIndex(
      (task) => task.calender_id === oldTaskId
    );

    if (taskToUpdateIndex !== -1) {
      const newStatus = e.target.value;
      localStorageData[taskToUpdateIndex].status = newStatus;
      // Update local storage with the modified data
      localStorage.setItem("filteredTasks", JSON.stringify(localStorageData));
      console.log("Task updated successfully");
    } else {
      console.warn("Task not found in local storage");
    }
  });
}

const navBar = document.getElementById("navbar");

/* 
  function that is resposible to the send update request to the database through 
  update_calender_database  
*/

/*........................................update_calender_database...................*/

function UpdateTaskInDatabase(Task) {
  const {
    id,
    name,
    assignedTo,
    description,
    startDate,
    nextUpdate,
    endDate,
    progress,
    rating,
    status,
    weeklyUpdates,
    calender_id,
    source,
  } = Task;
  const ids = assignedTo.map((item) => item.id);

  const JsonForApi = {
    task_id: id,
    title: name,
    assigned_to: ids,
    description: description,
    rating: rating,
    start: startDate,
    end: endDate,
    next_update: nextUpdate,
    updates: weeklyUpdates,
    status: status,
    progress: progress,
    calender_id: calender_id,
    source: source,
  };
  console.log(JsonForApi);
  $.ajax({
    url: "https://dokaudi.com/update_calender_database",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(JsonForApi),
    success: function (apiResponse) {
      var parsedResponse = apiResponse;

      console.log(parsedResponse);
      if (parsedResponse.result.includes("Task Id")) {
        // Call a function to show the modal
        showModal();
        //location.reload();
      }
      alert("Data Updated");
      // location.reload();
    },
    error: function (apiResponse) {
      console.error("Error fetching director details from the database:");
    },
  });
}

/* Function that is responsibe for add assigne when clicked */
function addAssignee(Task) {
  const addIcon = document.getElementById("editIcon");
  const addAssigneeDropDown = document.getElementById("addAssignee");
  const candidatesList = document.getElementById("candidatesList");

  if (apiData) {
    // +" ," + item.client_role;
    const assignees = [];
    apiData.forEach((item) => {
      let name =
        item.client_first_name +
        " " +
        item.client_middle_name +
        " " +
        item.client_last_name;
      assignees.push({ name: name, clientId: item.client_id });
      // let assignOption = `<option clientid="${item.client_id}" value="${name}">${name}</option>`;

      // addAssigneeDropDown.innerHTML += assignOption;
    });
    assignees.sort((a, b) => a.name.localeCompare(b.name));
    assignees.forEach((assignee) => {
      let assignOption = `<option clientid="${assignee.clientId}" value="${assignee.name}">${assignee.name}</option>`;
      addAssigneeDropDown.innerHTML += assignOption;
    });
  }

  addIcon.addEventListener("click", function (e) {
    $("#addAssigneeModal").modal("show");
  });

  $("#addAssigneeModal")
    .off("click", "#add")
    .on("click", "#add", function () {
      const selectElement = document.getElementById("addAssignee");
      const selectedOptions = Array.from(selectElement.selectedOptions);

      selectedOptions.forEach((selectedOption) => {
        const clientId = selectedOption.getAttribute("clientid");
        const listElement = document.createElement("li");

        listElement.innerHTML = ` ${selectedOption.value} <i class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;

        candidatesList.appendChild(listElement);

        Task.assignedTo.push({ id: clientId, fullName: selectedOption.value });
      });

      UpdateTaskInDatabase(Task);
      $("#addAssigneeModal").modal("hide");
    });
}

/*.......................... Apex Charts ..................................... */

const currentDate = new Date();
let taskDetails1 = [];

// Function to convert a string to sentence case
function toSentenceCase(str) {
  if (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

var chart;
function renderChart(data) {
  console.log("inside render chart", data);
  // Custom sorting function
  function customSort(a, b) {
    const getIdParts = (id) =>
      id.split(".").map((part) => (isNaN(part) ? part : parseFloat(part)));

    const partsA = getIdParts(a.id);
    const partsB = getIdParts(b.id);

    const minLength = Math.min(partsA.length, partsB.length);

    for (let i = 0; i < minLength; i++) {
      const compareResult = partsA[i] - partsB[i];
      if (compareResult !== 0) {
        return compareResult;
      }
    }

    return partsA.length - partsB.length;
  }

  // Sort the data using the custom sort function
  const sortedData = data.sort(customSort);

  if (chart) {
    chart.destroy();
  }

  const SampleData = data.map((item) => {
    let prog = parseFloat(item.progress);
    if (isNaN(prog)) {
      prog = 0;
    }
    if (item.name === undefined || item.name === null) {
      console.log("Undefined name in item:", item);
    }
    return {
      id: `${item.id}`,
      name: item.name,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      x: `${item.name}`,
      y: [new Date(item.startDate).getTime(), new Date(item.endDate).getTime()],
      progress: prog,
      status: item.status,
    };
  });
  var windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  /* Creating options to show apex charts syntax from official docs */
  var options = {
    series: [
      {
        name: "Task",
        data: SampleData,
      },
    ],
    chart: {
      useHTML: true,
      width: "95%",
      height: "auto",
      // height: "900",
      type: "rangeBar",

      events: {
        /* attaching click event   */
        click: function (event, chartContext, config) {
          const index = config.dataPointIndex;
          if (
            index !== undefined &&
            index !== null &&
            chartContext.opts.series.length > 0 &&
            chartContext.opts.series[0].data.length > index &&
            chartContext.opts.series[0].data[index].id !== undefined
          ) {
            const id = chartContext.opts.series[0].data[index].id;
            if (id != -1) {
              const obj = taskDetails1.find((item) => id === item.id);
              // console.log(obj);
              if (obj) {
                const taskId = obj.id;
                localStorage.setItem("taskId", taskId);
                // console.log(obj);
                document.getElementById("selectedOption").innerHTML = obj.name;
                updateTaskDetails(obj);
                // Trigger the click event on the link to activate the "task_details" pill
                const taskDetailsLink = $('[href="#task_details"]');
                if (taskDetailsLink.length > 0) {
                  taskDetailsLink.tab("show");
                }
              }
            }
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      useHTML: true,
      enabled: true,
      textAnchor: windowWidth < 768 ? "middle" : "start",
      fontSize: windowWidth < 768 ? "10px" : "15px",
      formatter: function (val, opts) {
        let label = opts.w.globals.labels[opts.dataPointIndex];
        let progress =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
            .progress + "%";

        let id =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].id;
        let idparts = id.split(".").length;

        /* Handling for less screen width devices */
        if (windowWidth < 768) {
          let temp = document.createElement("div");
          temp.innerHTML = label;
          label = temp.innerText || temp.textContent;
          opts.text = label;
          return label;
        }

        // Use a DOM element to parse HTML and retrieve text content
        var temp = document.createElement("div");
        temp.innerHTML = label;
        label = temp.innerText || temp.textContent;

        opts.text = label + ": " + progress + " completed";

        return label + ": " + progress + " completed";
      },

      style: {
        colors: ["#000000", "#000000"],
        fontSize: "8px",

        fontWeight: "normal",
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1,
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date().getTime(),
          strokeDashArray: 0,
          borderColor: "#ff0000",
          useHTML: true,
          label: {
            borderWidth: 1,
            borderColor: "#999",
            textAnchor: "start",
            orientation: "horizontal",
            position: "top",
            text: "Today",
            style: {
              color: "black",
              background: "yellow",
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4,
              },
              fontSize: "12px",
            },
            offsetY: 20,
            offsetX: -10,
          },
        },
      ],
    },
    tooltip: {
      /* Custom fuction that is used show the data as per our need while hoverovering */
      useHTML: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        var item = data[dataPointIndex];
        var tooltipContent =
          '<div  class="custom-tooltip">' +
          "<strong>Name:</strong> " +
          item.name +
          "<br>" +
          "<strong>Description:</strong> " +
          item.description +
          "<br>" +
          "<strong>Start Date:</strong> " +
          item.startDate +
          "<br>" +
          "<strong>End Date:</strong> " +
          item.endDate +
          "<br>" +
          "</div>";
        return tooltipContent;
      },
    },
    /* This is used for responsiveness */
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: "100%",
          },
        },
      },
    ],
  };

  /* Showing the colour of the progess based on
     the progress and start date and end date
 */
  options.series[0].data.forEach((task) => {
    const endDate = new Date(task.y[1]);
    const startDate = new Date(task.y[0]);
    const progress = task.progress;
    const status = task.status;

    if (status == "close" && progress < 100) {
      task.fillColor = "#D3D3D3";
    } else if (progress == 100 || status == "close") {
      task.fillColor = "#33FF33";
    } else if (currentDate > endDate && progress < 100) {
      task.fillColor = "#FF6666";
    } else if (currentDate < startDate) {
      task.fillColor = "#00d2ff";
    } else if (currentDate <= endDate && progress < 100) {
      if (progress <= 25) {
        task.fillColor = "#FFFF00";
      } else if (progress <= 50) {
        task.fillColor = "#FFD700";
      } else if (progress <= 75) {
        task.fillColor = "#FFA500";
      } else {
        task.fillColor = "#FFFF00";
      }
    } else if (currentDate > endDate && progress == 100) {
      task.fillColor = "#33FF33";
    } else {
      task.fillColor = "#00d2ff";
    }
  });
  chart = new ApexCharts(document.querySelector("#chart"), options);
  var chart_div = document.querySelector("#chart");
  chart_div.innerHTML = " ";
  chart.render();
}

/* Show the loading overlay initially */
const loadingOverlay = document.getElementById("loading-overlay");

loadingOverlay.style.display = "block";

/* Using the fetchData and processTaskData functions from apiService */
apiService
  .fetchData()
  .then(apiService.processTaskData)
  .then((data) => {
    taskDetails1 = data;

    loadingOverlay.style.display = "none";
  })
  .catch(function (error) {
    alert(error.statusText);
    console.error("Error fetching data:", error);
  });

/*...................Tabulator......................................*/

/* Wait for the DOM content to be loaded */
document.addEventListener("DOMContentLoaded", function () {
  /* Targetting the loader element from the dom */
  const loadingOverlay = document.getElementById("loading-overlay");

  /* Show the loading overlay initially until we get data from api */

  loadingOverlay.style.display = "block";
  /* Call the fetchData method from the apiService */
  apiService
    .fetchData()
    .then((apiResponse) => {
      /*
       Process the API response using the 
       processTaskData method from the apiService
     */
      // Function to create buttons dynamically

      const taskDetailsFromApi = apiService.processTaskData(apiResponse);

      /* Declare a variable for the Tabulator table */
      var table;

      /* Function to create the Tabulator table */
      function createTabulatorTable(data) {
        // console.log("table", data);
        function dateEditor(cell, onRendered, success, cancel, editorParams) {
          const input = document.createElement("input");
          input.setAttribute("type", "date");
          input.style.width = "100%";
          input.style.boxSizing = "border-box";

          /* Set the value of the input to the cell value */
          input.value = cell.getValue();

          input.addEventListener("change", function (e) {
            success(input.value);
          });

          input.addEventListener("blur", function (e) {
            success(input.value);
          });

          input.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
              cancel();
            }
          });

          onRendered(function () {
            input.focus();
          });

          return input;
        }

        var rowMenu = [
          {
            label: "<i class='fas fa-user'></i> Change Name",
            action: function (e, row) {
              row.update({ name: "Steve Bobberson" });
            },
          },
          {
            label: "<i class='fas fa-check-square'></i> Select Row",
            action: function (e, row) {
              row.select();
            },
          },
          {
            separator: true,
          },
          {
            label: "Admin Functions",
            menu: [
              {
                label: "<i class='fas fa-trash'></i> Delete Row",
                action: function (e, row) {
                  row.delete();
                },
              },
              {
                label: "<i class='fas fa-ban'></i> Disabled Option",
                disabled: true,
              },
            ],
          },
        ];

        //define column header menu as column visibility toggle
        var headerMenu = function () {
          var menu = [];
          var columns = this.getColumns();

          for (let column of columns) {
            //create checkbox element using font awesome icons
            let icon = document.createElement("i");
            icon.classList.add("fas");
            icon.classList.add(
              column.isVisible() ? "fa-check-square" : "fa-square"
            );

            //build label
            let label = document.createElement("span");
            let title = document.createElement("span");

            title.textContent = " " + column.getDefinition().title;

            label.appendChild(icon);
            label.appendChild(title);

            //create menu item
            menu.push({
              label: label,
              action: function (e) {
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if (column.isVisible()) {
                  icon.classList.remove("fa-square");
                  icon.classList.add("fa-check-square");
                } else {
                  icon.classList.remove("fa-check-square");
                  icon.classList.add("fa-square");
                }
              },
            });
          }

          return menu;
        };

        /* Syntax to create a table from the data */
        table = new Tabulator("#example-table", {
          data: data,
          height: "60vh",
          pagination: "local",
          paginationSize: 200,
          paginationSizeSelector: [10, 50, 100, 200, 500],
          movableColumns: true,
          paginationCounter: "rows",
          rowContextMenu: rowMenu,
          responsiveLayoutCollapseUseFormatters: false,

          // height: "382px",

          // responsiveLayout: "collapse",

          dataTree: true,
          layout: "fitData",
          columns: [
            { title: "#", formatter: "rownum", hozAlign: "center", width: 60 },
            {
              title: "Id",
              field: "id",
              sorter: function (a, b, aRow, bRow, column, dir, sorterParams) {
                const aParts = a.split(".");
                const bParts = b.split(".");

                for (
                  let i = 0;
                  i < Math.min(aParts.length, bParts.length);
                  i++
                ) {
                  const aNum = parseInt(aParts[i], 10);
                  const bNum = parseInt(bParts[i], 10);

                  if (aNum !== bNum) {
                    return aNum - bNum;
                  }
                }
                return aParts.length - bParts.length;
              },
              editor: true,
              width: 70,
              sorterParams: {
                // Set default sorting direction, 'asc' or 'desc'
                defaultSortOrder: "asc",
              },
            },
            {
              title: "Task",
              field: "name",
              editor: true,
              width: 300,
              headerMenu: headerMenu,
              formatter: "html",
            },
            {
              title: "Description",
              field: "description",
              editor: true,
              width: 200,
              headerMenu: headerMenu,
              formatter: "html",
            },
            {
              title: "Assigned To",
              field: "assignedTo",
              sorter: function (a, b, aRow, bRow, column, dir, sorterParams) {
                const aNames = a.map((item) => item.fullName).join(", ");
                const bNames = b.map((item) => item.fullName).join(", ");
                return aNames.localeCompare(bNames); // Use string comparison for sorting
              },
              width: 150,
              headerMenu: headerMenu,
              formatter: function (cell, formatterParams) {
                const assignedToString = cell
                  .getValue()
                  .map((item) => item.fullName)
                  .join(", ");
                return assignedToString;
              },
            },

            {
              title: '<i class="fa fa-percent" aria-hidden="true"></i>',
              field: "progress",
              width: 75,
              editor: true,
              hozAlign: "center",
              headerMenu: headerMenu,
            },

            {
              title: '<i class="fa fa-circle-notch" aria-hidden="true"></i>',
              field: "progress",
              width: 130,
              hozAlign: "left",
              formatter: "progress",
              formatterParams: {
                color: ["red", "orange", "lightgreen", "green"],
              },
              editor: true,
              headerMenu: headerMenu,
            },
            {
              title: "Start",
              field: "startDate",
              width: 100,
              editor: dateEditor,
              headerMenu: headerMenu,
              formatter: function (cell, formatterParams, onRendered) {
                // Assuming startDate is in the format YYYY-MM-DD
                var dateParts = cell.getValue().split("-");
                var formattedDate = new Date(
                  dateParts[0],
                  dateParts[1] - 1,
                  dateParts[2]
                );

                // Format the date as DD MMM YYYY
                var options = {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                };
                var formattedDateString = formattedDate.toLocaleDateString(
                  "en-US",
                  options
                );

                return formattedDateString;
              },
              hozAlign: "right",
            },
            {
              title: "Next Update",
              field: "nextUpdate",
              width: 100,
              editor: dateEditor,
              headerMenu: headerMenu,
              formatter: function (cell, formatterParams, onRendered) {
                if (cell.getValue()) {
                  var dateParts = cell.getValue().split("-");
                  var formattedDate = new Date(
                    dateParts[0],
                    dateParts[1] - 1,
                    dateParts[2]
                  );

                  // Format the date as DD MMM YYYY
                  var options = {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  };
                  var formattedDateString = formattedDate.toLocaleDateString(
                    "en-US",
                    options
                  );

                  return formattedDateString;
                }
              },
              hozAlign: "right",
            },
            {
              title: "End",
              field: "endDate",
              width: 100,
              editor: dateEditor,
              headerMenu: headerMenu,
              formatter: function (cell, formatterParams, onRendered) {
                // Assuming startDate is in the format YYYY-MM-DD
                var dateParts = cell.getValue().split("-");
                var formattedDate = new Date(
                  dateParts[0],
                  dateParts[1] - 1,
                  dateParts[2]
                );

                // Format the date as DD MMM YYYY
                var options = {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                };
                var formattedDateString = formattedDate.toLocaleDateString(
                  "en-US",
                  options
                );

                return formattedDateString;
              },
              hozAlign: "right",
            },
            {
              title: "Rating",
              field: "rating",
              formatter: "star",
              formatterParams: { stars: 5, color: "green" },
              hozAlign: "center",
              width: 100,
              editor: true,
              headerMenu: headerMenu,
            },

            {
              title: "Status",
              field: "status",
              editor: "select",
              headerMenu: headerMenu,
              editorParams: {
                values: { open: "Open", close: "Close", passive: "Passive" },
              },
            },
            {
              title: '<i class="fa fa-calendar" aria-hidden="true"></i>',
              field: "icon",
              hozAlign: "center",
              formatter: function (cell, formatterParams, onRendered) {
                return '<i class="fa fa-calendar" aria-hidden="true"></i>';
              },
            },
          ],
          initialSort: [
            { column: "id", dir: "asc" }, // Set "Id" column as default sorted in ascending order
          ],
        });

        var saveAs =
          saveAs ||
          (function (e) {
            "use strict";
            if (
              typeof e === "undefined" ||
              (typeof navigator !== "undefined" &&
                /MSIE [1-9]\./.test(navigator.userAgent))
            ) {
              return;
            }
            var t = e.document,
              n = function () {
                return e.URL || e.webkitURL || e;
              },
              r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
              o = "download" in r,
              a = function (e) {
                var t = new MouseEvent("click");
                e.dispatchEvent(t);
              },
              i = /constructor/i.test(e.HTMLElement) || e.safari,
              f = /CriOS\/[\d]+/.test(navigator.userAgent),
              u = function (t) {
                (e.setImmediate || e.setTimeout)(function () {
                  throw t;
                }, 0);
              },
              s = "application/octet-stream",
              d = 1e3 * 40,
              c = function (e) {
                var t = function () {
                  if (typeof e === "string") {
                    n().revokeObjectURL(e);
                  } else {
                    e.remove();
                  }
                };
                setTimeout(t, d);
              },
              l = function (e, t, n) {
                t = [].concat(t);
                var r = t.length;
                while (r--) {
                  var o = e["on" + t[r]];
                  if (typeof o === "function") {
                    try {
                      o.call(e, n || e);
                    } catch (a) {
                      u(a);
                    }
                  }
                }
              },
              p = function (e) {
                if (
                  /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                    e.type
                  )
                ) {
                  return new Blob([String.fromCharCode(65279), e], {
                    type: e.type,
                  });
                }
                return e;
              },
              v = function (t, u, d) {
                if (!d) {
                  t = p(t);
                }
                var v = this,
                  w = t.type,
                  m = w === s,
                  y,
                  h = function () {
                    l(v, "writestart progress write writeend".split(" "));
                  },
                  S = function () {
                    if ((f || (m && i)) && e.FileReader) {
                      var r = new FileReader();
                      r.onloadend = function () {
                        var t = f
                          ? r.result
                          : r.result.replace(
                              /^data:[^;]*;/,
                              "data:attachment/file;"
                            );
                        var n = e.open(t, "_blank");
                        if (!n) e.location.href = t;
                        t = undefined;
                        v.readyState = v.DONE;
                        h();
                      };
                      r.readAsDataURL(t);
                      v.readyState = v.INIT;
                      return;
                    }
                    if (!y) {
                      y = n().createObjectURL(t);
                    }
                    if (m) {
                      e.location.href = y;
                    } else {
                      var o = e.open(y, "_blank");
                      if (!o) {
                        e.location.href = y;
                      }
                    }
                    v.readyState = v.DONE;
                    h();
                    c(y);
                  };
                v.readyState = v.INIT;
                if (o) {
                  y = n().createObjectURL(t);
                  setTimeout(function () {
                    r.href = y;
                    r.download = u;
                    a(r);
                    h();
                    c(y);
                    v.readyState = v.DONE;
                  });
                  return;
                }
                S();
              },
              w = v.prototype,
              m = function (e, t, n) {
                return new v(e, t || e.name || "download", n);
              };
            if (
              typeof navigator !== "undefined" &&
              navigator.msSaveOrOpenBlob
            ) {
              return function (e, t, n) {
                t = t || e.name || "download";
                if (!n) {
                  e = p(e);
                }
                return navigator.msSaveOrOpenBlob(e, t);
              };
            }
            w.abort = function () {};
            w.readyState = w.INIT = 0;
            w.WRITING = 1;
            w.DONE = 2;
            w.error =
              w.onwritestart =
              w.onprogress =
              w.onwrite =
              w.onabort =
              w.onerror =
              w.onwriteend =
                null;
            return m;
          })(
            (typeof self !== "undefined" && self) ||
              (typeof window !== "undefined" && window) ||
              this.content
          );
        if (typeof module !== "undefined" && module.exports) {
          module.exports.saveAs = saveAs;
        } else if (
          typeof define !== "undefined" &&
          define !== null &&
          define.amd !== null
        ) {
          define("FileSaver.js", function () {
            return saveAs;
          });
        }

        var ics = function (e, t) {
          "use strict";
          {
            if (
              !(
                navigator.userAgent.indexOf("MSIE") > -1 &&
                -1 == navigator.userAgent.indexOf("MSIE 10")
              )
            ) {
              void 0 === e && (e = "default"), void 0 === t && (t = "Calendar");
              var r =
                  -1 !== navigator.appVersion.indexOf("Win") ? "\r\n" : "\n",
                n = [],
                i = ["BEGIN:VCALENDAR", "PRODID:" + t, "VERSION:2.0"].join(r),
                o = r + "END:VCALENDAR",
                a = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
              return {
                events: function () {
                  return n;
                },
                calendar: function () {
                  return i + r + n.join(r) + o;
                },
                addEvent: function (t, i, o, l, u, s) {
                  if (
                    void 0 === t ||
                    void 0 === i ||
                    void 0 === o ||
                    void 0 === l ||
                    void 0 === u
                  )
                    return !1;
                  if (s && !s.rrule) {
                    if (
                      "YEARLY" !== s.freq &&
                      "MONTHLY" !== s.freq &&
                      "WEEKLY" !== s.freq &&
                      "DAILY" !== s.freq
                    )
                      throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
                    if (s.until && isNaN(Date.parse(s.until)))
                      throw "Recurrence rrule 'until' must be a valid date string";
                    if (s.interval && isNaN(parseInt(s.interval)))
                      throw "Recurrence rrule 'interval' must be an integer";
                    if (s.count && isNaN(parseInt(s.count)))
                      throw "Recurrence rrule 'count' must be an integer";
                    if (void 0 !== s.byday) {
                      if (
                        "[object Array]" !==
                        Object.prototype.toString.call(s.byday)
                      )
                        throw "Recurrence rrule 'byday' must be an array";
                      if (s.byday.length > 7)
                        throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
                      s.byday = s.byday.filter(function (e, t) {
                        return s.byday.indexOf(e) == t;
                      });
                      for (var c in s.byday)
                        if (a.indexOf(s.byday[c]) < 0)
                          throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
                    }
                  }
                  var g = new Date(l),
                    d = new Date(u),
                    f = new Date(),
                    S = ("0000" + g.getFullYear().toString()).slice(-4),
                    E = ("00" + (g.getMonth() + 1).toString()).slice(-2),
                    v = ("00" + g.getDate().toString()).slice(-2),
                    y = ("00" + g.getHours().toString()).slice(-2),
                    A = ("00" + g.getMinutes().toString()).slice(-2),
                    T = ("00" + g.getSeconds().toString()).slice(-2),
                    b = ("0000" + d.getFullYear().toString()).slice(-4),
                    D = ("00" + (d.getMonth() + 1).toString()).slice(-2),
                    N = ("00" + d.getDate().toString()).slice(-2),
                    h = ("00" + d.getHours().toString()).slice(-2),
                    I = ("00" + d.getMinutes().toString()).slice(-2),
                    R = ("00" + d.getMinutes().toString()).slice(-2),
                    M = ("0000" + f.getFullYear().toString()).slice(-4),
                    w = ("00" + (f.getMonth() + 1).toString()).slice(-2),
                    L = ("00" + f.getDate().toString()).slice(-2),
                    O = ("00" + f.getHours().toString()).slice(-2),
                    p = ("00" + f.getMinutes().toString()).slice(-2),
                    Y = ("00" + f.getMinutes().toString()).slice(-2),
                    U = "",
                    V = "";
                  y + A + T + h + I + R != 0 &&
                    ((U = "T" + y + A + T), (V = "T" + h + I + R));
                  var B,
                    C = S + E + v + U,
                    j = b + D + N + V,
                    m = M + w + L + ("T" + O + p + Y);
                  if (s)
                    if (s.rrule) B = s.rrule;
                    else {
                      if (((B = "rrule:FREQ=" + s.freq), s.until)) {
                        var x = new Date(Date.parse(s.until)).toISOString();
                        B +=
                          ";UNTIL=" +
                          x.substring(0, x.length - 13).replace(/[-]/g, "") +
                          "000000Z";
                      }
                      s.interval && (B += ";INTERVAL=" + s.interval),
                        s.count && (B += ";COUNT=" + s.count),
                        s.byday &&
                          s.byday.length > 0 &&
                          (B += ";BYDAY=" + s.byday.join(","));
                    }
                  new Date().toISOString();
                  var H = [
                    "BEGIN:VEVENT",
                    "UID:" + n.length + "@" + e,
                    "CLASS:PUBLIC",
                    "DESCRIPTION:" + i,
                    "DTSTAMP;VALUE=DATE-TIME:" + m,
                    "DTSTART;VALUE=DATE-TIME:" + C,
                    "DTEND;VALUE=DATE-TIME:" + j,
                    "LOCATION:" + o,
                    "SUMMARY;LANGUAGE=en-us:" + t,
                    "TRANSP:TRANSPARENT",
                    "END:VEVENT",
                  ];
                  return B && H.splice(4, 0, B), (H = H.join(r)), n.push(H), H;
                },
                /**
                 * Create mailto link with calendar attachment
                 * @param  {string} eventName Name of the event for the email subject
                 */
                sendEmailWithAttachment: function (eventName) {
                  if (n.length < 1) {
                    return false;
                  }

                  var calendarContent = i + r + n.join(r) + o;
                  var blob;
                  if (-1 === navigator.userAgent.indexOf("MSIE 10")) {
                    blob = new Blob([calendarContent], {
                      type: "text/x-vCalendar;charset=" + document.characterSet,
                    });
                  } else {
                    var bb = new BlobBuilder();
                    bb.append(calendarContent);
                    blob = bb.getBlob(
                      "text/x-vCalendar;charset=" + document.characterSet
                    );
                  }

                  // Create a data URI for the Blob
                  var dataURL = URL.createObjectURL(blob);

                  // Create mailto link with attachment
                  var mailtoLink =
                    "mailto:?subject=" +
                    encodeURIComponent(eventName) +
                    "&body=Please find attached the calendar event" +
                    "&attachment=" +
                    encodeURIComponent(dataURL);

                  // Open the default email client with the mailto link
                  window.location.href = mailtoLink;
                },
                download: function (e, t) {
                  if (n.length < 1) return !1;
                  (t = void 0 !== t ? t : ".ics"),
                    (e = void 0 !== e ? e : "calendar");
                  var a,
                    l = i + r + n.join(r) + o;
                  if (-1 === navigator.userAgent.indexOf("MSIE 10"))
                    a = new Blob([l]);
                  else {
                    var u = new BlobBuilder();
                    u.append(l),
                      (a = u.getBlob(
                        "text/x-vCalendar;charset=" + document.characterSet
                      ));
                  }
                  return saveAs(a, e + t), l;
                },
                build: function () {
                  return !(n.length < 1) && i + r + n.join(r) + o;
                },
              };
            }
            console.log("Unsupported Browser");
          }
        };

        /* Get elements by ID for filter fields */
        var fieldEl = document.getElementById("filter-field");
        var typeEl = document.getElementById("filter-type");
        var valueEl = document.getElementById("filter-value");

        /* Function to update the table filter based on user input */
        function updateFilter() {
          var filterVal = fieldEl.value;
          var typeVal = typeEl.value;

          if (valueEl.value.trim() !== "") {
            table.setFilter(filterVal, typeVal, valueEl.value);
          } else {
            table.clearFilter();
          }
        }

        /* Add event listeners for filter fields and clear filter button */
        document
          .getElementById("filter-field")
          .addEventListener("change", updateFilter);
        document
          .getElementById("filter-type")
          .addEventListener("change", updateFilter);
        document
          .getElementById("filter-value")
          .addEventListener("keyup", updateFilter);

        document
          .getElementById("filter-clear")
          .addEventListener("click", function () {
            fieldEl.value = "";
            typeEl.value = "=";
            valueEl.value = "";

            table.clearFilter();
          });
        table.on("cellClick", function (e, cell) {
          if (cell.getField() === "icon") {
            console.log(cell.getData());
            const calendarData = cell.getData();
            cal_single = ics();
            cal_single.addEvent(
              calendarData.name,
              calendarData.description,
              "New Delhi",
              `${calendarData.startDate}T8:30`,
              `${calendarData.endDate}T9:00`
            );
            cal_single.download(calendarData.name);

            console.log("clicked Calander Icon");
          }
        });
        /* Adding dblclick event listener to each row */
        table.on("rowDblClick", function (e, row) {
          let task = row.getData();
          const obj = data.find((item) => task.id === item.id);

          if (obj) {
            const taskId = obj.id;
            console.log(taskId);
            localStorage.setItem("taskId", taskId);
            document.getElementById("selectedOption").innerHTML = obj.name;
            updateTaskDetails(obj);
            const taskDetailsLink = $('[href="#task_details"]');
            if (taskDetailsLink.length > 0) {
              taskDetailsLink.tab("show");
            }
          }
        });

        /* This is for touch events */
        /*
        table.on("rowTap", function (e, row) {
          let task = row.getData();
          const obj = data.find((item) => task.id === item.id);

          if (obj) {
            const taskId = obj.id;
            localStorage.setItem("taskId", taskId);
          
            document.getElementById("selectedOption").innerHTML = obj.name;
            updateTaskDetails(obj);
            const taskDetailsLink = $('[href="#task_details"]');
            if (taskDetailsLink.length > 0) {
              taskDetailsLink.tab("show");
            }
          }
        });
        */
        /* Funtion that is called when an edit occurs in the tabulator
       to update in the data base 
    */
        function updateInDataBase(rowData) {
          const {
            id,
            name,
            description,
            assignedTo,
            rating,
            startDate,
            endDate,
            nextUpdate,
            weeklyUpdates,
            status,
            progress,
            calender_id,
          } = rowData;
          const ids = assignedTo.map((item) => item.id);
          const databaseObj = {
            task_id: id,
            title: name,
            assigned_to: ids,
            description: description,
            rating: rating,
            start: startDate,
            end: endDate,
            next_update: nextUpdate,
            updates: weeklyUpdates,
            status: status,
            progress: progress,
            calender_id: calender_id,
          };

          $.ajax({
            url: "/update_calender_database",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(databaseObj),
            success: function (apiResponse) {
              // location.reload();
              var parsedResponse = apiResponse;

              console.log(parsedResponse);
              if (parsedResponse.result.includes("Task Id")) {
                // Call a function to show the modal
                showModal();
                //location.reload();
              }

              //console.log(apiResponse);
            },
            error: function (apiResponse) {
              console.error(
                "Error fetching director details from the database: ",
                apiResponse
              );
            },
          });
        }
        /* When an edit even is trigreed handling that  */
        table.on("cellEdited", function (cell) {
          if (cell.getField() === "rating") {
            let editedValue = cell.getValue();
            // localStorage.getItem("filteredTasks", );

            console.log(`${cell.getField()} updated value : ${editedValue}`);
            let rowData = cell.getRow().getData();
            rowData.rating = editedValue;
            //  Update data in the database
            updateInDataBase(rowData);

            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.id; // assuming taskId is unique
            const taskToUpdate = localStorageData.find(
              (task) => task.id === oldTaskId
            );
            const newrating = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.rating = newrating;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() === "progress") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log(`${cell.getField()} updated value: ${editedValue}`);
            rowData.progress = editedValue;

            //  Update data in the database
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.calender_id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.calender_id === oldTaskId
            );
            const newProgress = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.progress = newProgress;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() == "id") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();

            // console.log(`${cell.getField()} updated value : ${editedValue}`);
            rowData.id = editedValue;
            // console.log(rowData);
            //  Update data in the database
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.calender_id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.calender_id === oldTaskId
            );
            const newId = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.id = newId;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() == "description") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log(`${cell.getField()} updated value : ${editedValue}`);
            rowData.description = editedValue;
            //  Update data in the database
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.id === oldTaskId
            );
            const newdescription = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.description = newdescription;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() == "name") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log("I am here ",localStorage.getItem("name", `${cell.getField()}`));
            // console.log(`${rowData.name} updated value : ${editedValue}`);
            rowData.name = editedValue;

            //Update in the Database.
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldName = localStorage.getItem("name", `${cell.getField()}`);
            const taskToUpdate = localStorageData.find(
              (task) => task.name === oldName
            );
            const newName = editedValue; // Replace with your new name
            if (taskToUpdate) {
              taskToUpdate.name = newName;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
            localStorage.setItem("name", editedValue);
          } else if (cell.getField() == "startDate") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log(`${cell.getField()} updated value : ${editedValue}`);
            rowData.startDate = editedValue;
            //  Update data in the database
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.id === oldTaskId
            );
            const newstartDate = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.startDate = newstartDate;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() == "endDate") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log(`${cell.getField()} updated value : ${editedValue}`);
            rowData.endDate = editedValue;
            //  Update data in the database
            updateInDataBase(rowData);

            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.id === oldTaskId
            );
            const newendDate = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.endDate = newendDate;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          } else if (cell.getField() == "status") {
            const editedValue = cell.getValue();
            const rowData = cell.getRow().getData();
            // console.log(`${cell.getField()} updated value : ${editedValue}`);
            rowData.status = editedValue;
            //  Update data in the database
            updateInDataBase(rowData);
            //Update in Local Storage.
            const localStorageData =
              JSON.parse(localStorage.getItem("filteredTasks")) || [];
            const oldTaskId = rowData.id; // assuming taskId is unique
            // console.log(oldTaskId)
            const taskToUpdate = localStorageData.find(
              (task) => task.id === oldTaskId
            );
            const newStatus = editedValue; // Replace with your new progress
            if (taskToUpdate) {
              taskToUpdate.status = newStatus;
            }
            localStorage.setItem(
              "filteredTasks",
              JSON.stringify(localStorageData)
            );
          }
        });
      }

      //******************************CheckBox***********************

      function createButtons(names) {
        console.log("container");
        const buttonContainer = document.getElementById("buttonContainer");

        if (buttonContainer) {
          const checkboxStates =
            JSON.parse(localStorage.getItem("checkboxStates")) || {};
          const filteredTasks =
            JSON.parse(localStorage.getItem("filteredTasks")) ||
            taskDetailsFromApi;

          names.forEach((name, index) => {
            const checkboxContainer = document.createElement("div");
            checkboxContainer.classList.add("form-check", "form-check-inline");

            const checkbox = document.createElement("input");
            checkbox.classList.add("form-check-input");
            checkbox.type = "checkbox";
            checkbox.value = name;
            checkbox.id = "inlineCheckbox" + (index + 1);
            checkbox.checked =
              checkboxStates[name] === undefined ? true : checkboxStates[name];

            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.setAttribute("for", checkbox.id);
            label.textContent = name;

            checkbox.addEventListener("click", handleButtonClick);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            buttonContainer.appendChild(checkboxContainer);
          });
        }
      }

      var filteredTasks;
      /* callback function for handle click button */
      function handleButtonClick() {
        const buttonContainer = document.getElementById("buttonContainer");
        const divs = buttonContainer.querySelectorAll("div");

        const checkboxStates = {};

        Array.from(divs).forEach((div, index) => {
          const id = "inlineCheckbox" + (index + 1);
          const checkButton = document.getElementById(id);
          checkboxStates[checkButton.value] = checkButton.checked;
        });

        // Save the checkbox states to local storage
        localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));

        const checkedBoxes = Array.from(divs).map((div, index) => {
          const id = "inlineCheckbox" + (index + 1);
          const checkButton = document.getElementById(id);
          return { value: checkButton.value, checked: checkButton.checked };
        });

        filteredTasks = taskDetailsFromApi.filter((task) =>
          checkedBoxes.some((box) => box.checked && box.value === task.source)
        );

        // console.log("filteredTasks",filteredTasks);

        // Save the filtered tasks to local storage
        localStorage.setItem("filteredTasks", JSON.stringify(filteredTasks));
        if (table) table.destroy();
        createTabulatorTable(filteredTasks);

        // Ensure that the document is ready
        $(document).ready(function () {
          // Check if the element with id "timeline" has the class "active"

          if (
            $("#timeline").hasClass("active") ||
            $("#timeline1").hasClass("active")
          ) {
            console.log("called me");

            // Render the chart with the filteredTasks data
            console.log("render from timeline click button");
            renderChart(filteredTasks);
          }
        });
      }

      // Retrieve the JSON string from localStorage
      const filteredTasksString = localStorage.getItem("filteredTasks");
      // console.log(filteredTasksString);

      /* Dynamic Creation Of Buttons */
      const sources = taskDetailsFromApi.map((person) => {
        return person.source;
      });

      const uniqueSources = [...new Set(sources)];

      // Call the function to create buttons using the names array
      createButtons(uniqueSources);

      /*

      Logic of updating data on First reload and Subsequent reload 
      
      */

      const isFirstReloadCreate = localStorage.getItem("firstReloadCreate");

      if (!isFirstReloadCreate) {
        console.log("First visit");
        createTabulatorTable(taskDetailsFromApi);
        console.log("render from timeline first reload");
        renderChart(taskDetailsFromApi);
        localStorage.setItem("firstReloadCreate", true);
      } else {
        const buttonContainer = document.getElementById("buttonContainer");
        const divs = buttonContainer.querySelectorAll("div");

        const checkedBoxess = Array.from(divs).map((div, index) => {
          const id = "inlineCheckbox" + (index + 1);
          const checkButton = document.getElementById(id);
          return { value: checkButton.value, checked: checkButton.checked };
        });

        filteredTasks = taskDetailsFromApi.filter((task) =>
          checkedBoxess.some((box) => box.checked && box.value === task.source)
        );
        console.log("inside reload fnction");

        //renderChart(filteredTasks);
        handleButtonClick();
      }

      // Check if "firstReload" flag is already set in local storage
      const isFirstReload = localStorage.getItem("firstReload");
      console.log(isFirstReload);

      // Check all checkboxes only on the first visit
      if (!isFirstReload) {
        console.log("First visit");
        //checkAllCheckboxes();
        // Set the "firstReload" flag in local storage
        localStorage.setItem("firstReload", true);
      } else {
        // Subsequent visits: Load checkbox states and handle button click
        console.log("Subsequent visit");
        // loadCheckboxStates();
        //handleButtonClick();
        //createButtons(uniqueSources);
      }

      // Event listener when we click on Timeline pill.
      $('a[data-toggle="pill"]').on("shown.bs.tab", function (e) {
        // Check if the active tab is #timeline
        if ($(e.target).attr("href") === "#apexChart") {
          console.log("TimeLine Active");
          const filteredTasksString = localStorage.getItem("filteredTasks");
          if (filteredTasksString) {
            const filteredTasks = JSON.parse(filteredTasksString);
            if (Array.isArray(filteredTasks) && filteredTasks.length > 0) {
              console.log("render from timeline pill active");
              console.log(filteredTasks);
              renderChart(filteredTasks);
            } else {
              if (chart) {
                chart.destroy();
              }

              var chart_div = document.querySelector("#chart");
              chart_div.innerHTML =
                "<br><strong> Select any Checkbox Above to display the chart</strong>";
            }
          } else {
            console.log("filteredTasksString is null or undefined.");
          }
        }
      });

      /* 
      Sorting the Data as per the id and adding some padding depends on the no of dots
      */
      taskDetailsFromApi.sort((a, b) => {
        const idPartsA = a.id.split(".").map((part) => parseFloat(part));
        const idPartsB = b.id.split(".").map((part) => parseFloat(part));

        for (let i = 0; i < Math.max(idPartsA.length, idPartsB.length); i++) {
          const partA = idPartsA[i] || 0;
          const partB = idPartsB[i] || 0;

          if (partA !== partB) {
            return partA - partB;
          }
        }

        return 0;
      });

      /* Once we created the table hiding the loadingOverlay */
      loadingOverlay.style.display = "none";
    })

    .catch((error) => {
      alert(error.statusText);
      console.error("Error fetching data:", error);
    });
});

function DeleteTask(Task) {
  const deleteEntireTaskIcon = document.getElementById("deleteEntireTaskIcon");

  function DeleteMe(e) {
    e.stopPropagation();
    $("#deleteConfirmationModal").modal("show");
    $("#deleteConfirmationModal")
      .off("click", "#yes")
      .on("click", "#yes", function (e) {
        const deleteformDataJSON = {};
        deleteformDataJSON.task_id = Task.id;
        $.ajax({
          url: "https://dokaudi.com/delete_calender_database",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(deleteformDataJSON),
          success: function (apiResponse) {
            console.log(apiResponse["message"]);
            location.reload();
            // processData(ticker);
          },
          error: function (apiResponse) {
            console.error(
              "Error fetching director details from the database: ",
              apiResponse
            );
          },
        });
        $("#deleteConfirmationModal").modal("hide");
      });
  }

  deleteEntireTaskIcon.addEventListener("click", DeleteMe);
}
