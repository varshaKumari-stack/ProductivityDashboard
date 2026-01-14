function OpenFeatures() {
  let allElem = document.querySelectorAll(".elem");
  let allFullElem = document.querySelectorAll(".fullelem");
  let allBackBtn = document.querySelectorAll(" .fullelem .back");
  allElem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      allFullElem[elem.id].style.display = "block";
    });
  });
  allBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      allFullElem[back.id].style.display = "none";
    });
  });
}
OpenFeatures();
let form = document.querySelector(".addTask form");
let taskInput = document.querySelector("#task-imp");
let formText = document.querySelector("textarea");
let taskChkbox = document.querySelector("#check");

function todo() {
  let CurTask = [];

  if (localStorage.getItem("curTask")) {
    CurTask = JSON.parse(localStorage.getItem("curTask"));
  } else {
    console.error("TaskList Empty!!!!");
  }

  function renderTask() {
    let sum = "";
    let allTask = document.querySelector(".allTask");

    CurTask.forEach(function (elem, idx) {
      sum += ` <div class="task">
  <details class="detail">
 <summary>${elem.task}</summary>
 <p>${elem.details}</p>
 </details> 
<span class=${elem.status}>Imp</span> 
         <div class="btn">
                <button class="cmp">Mark As Completed</button>
                  <button id=${idx} class="del"  >Delete</button>
              </div>
            </div>
           `;
    });
    allTask.innerHTML = sum;

    localStorage.setItem("curTask", JSON.stringify(CurTask));
    document.querySelectorAll(".task .btn .del").forEach(function (del) {
      del.addEventListener("click", () => {
        CurTask.splice(del.id, 1);

        renderTask();
      });
    });

    let firstCmpBtn = document.querySelectorAll(".task .btn .cmp");
    firstCmpBtn.forEach(function (btn) {
      btn.addEventListener("click", () => {
        if (btn.innerText === "Mark As Completed") {
          btn.innerText = "Completed";
          btn.style.backgroundColor = "rgb(68, 153, 135)";
        } else {
          btn.innerText = "Mark As Completed";
          btn.style.backgroundColor = `var(--grayc)`;
        }
      });
    });
  }

  renderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    CurTask.push({
      task: taskInput.value,
      details: formText.value,
      status: taskChkbox.checked,
    });
    renderTask();
    taskInput.value = "";
    taskChkbox.checked = false;
    formText.value = "";
  });
}
todo();

function dayPlanner() {
  let today = new Date().toISOString().split("T")[0];
  let savedDate = localStorage.getItem("plannerDate");

  if (savedDate !== today) {
    localStorage.removeItem("dayPlanData");
    localStorage.setItem("plannerDate", today);
    alert("New day started! Planner reset.");
  }
  let day = document.querySelector(".day-planner");

  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  function twelvehour(hour) {
    let period = hour > 12 ? "PM" : "AM";
    let h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:00 ${period}`;
  }
  let hours = Array.from({ length: 18 }, (_, idx) => {
    let start = 6 + idx;
    let end = start + 1;
    return `${twelvehour(start)} - ${twelvehour(end)}`;
  });

  let dayPlanSum = "";

  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";

    dayPlanSum += ` <div class="day-time">
            <p>${elem}</p>
         <input id="${idx}" type="text" placeholder="......"  value="${savedData}" />
          </div>`;
  });

  day.innerHTML = dayPlanSum;
  let dayPlanInp = document.querySelectorAll(".day-planner input");
  dayPlanInp.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dayPlanner();
function motivation() {
  let ranquote = document.querySelector(".quote p");
  let author = document.querySelector(".auth p");
  async function fetchQuote() {
    let apiData = await fetch("https://dummyjson.com/quotes/random");
    let quote = await apiData.json();
    console.log(quote);
    ranquote.innerHTML = quote.quote;
    author.innerHTML = `~ ${quote.author}`;
  }
  fetchQuote();
}
motivation();

function pomodoro() {
  let totalMinutes = 0;
  let workTime = 25;
  let longBreak = 15;
  let breakTime = 5;
  let curTime = workTime * 60;
  let totalTime = curTime;
  let isRunning = false;
  let isWorkSession = true;
  let timer = null;
  let sessionCount = 0;
  let timeDisplay = document.querySelector("#time-display");
  let sessionTime = document.querySelector("#session-time");
  let progress = document.querySelector("#progress");
  let startBtn = document.querySelector("#startBtn");
  let pauseBtn = document.querySelector("#pauseBtn");
  let resetBtn = document.querySelector("#resetBtn");
  let skipBtn = document.querySelector("#skipBtn");
  let notification = document.querySelector("#notification");
  let notiText = document.querySelector("#noti-text");
  let workTimeDis = document.querySelector("#work-time");
  let shortBrk = document.querySelector("#shortBreak");
  let longBrk = document.querySelector("#longBreak");

  function updateDisplay() {
    let min = Math.floor(curTime / 60);
    let sec = curTime % 60;
    timeDisplay.innerHTML = `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")}`;
  }

  function updateProgress() {
    const progressValue = 1 - curTime / totalTime;
    const circumference = 2 * Math.PI * 145;
    const offset = circumference * (1 - progressValue);
    progress.style.strokeDashoffset = offset;
  }
  function notificationDis(text) {
    notiText.innerText = text;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 5000);
  }

  function StartTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.textContent = "Running...";
      startBtn.style.color = "red";
      startBtn.style.backgroundColor = "var(--tri2)";

      startBtn.classList.add("pulsing");
      timer = setInterval(() => {
        curTime--;
        updateDisplay();
        updateProgress();
        if (curTime <= 0) {
          sessionComplete();
        }
      }, 1000);
    }
  }

  function PauseTimer() {
    if (isRunning) {
      isRunning = false;
      clearInterval(timer);
      startBtn.textContent = "Start";
      startBtn.style.color = " rgb(162, 228, 205)";
      startBtn.style.backgroundColor = "transparent";
      startBtn.classList.remove("pulsing");
    }
  }

  function resetTimer() {
    PauseTimer();
    if (isWorkSession) {
      curTime = workTime * 60;
    } else {
      const isLongBreak = sessionCount % 4 === 0;
      curTime = isLongBreak ? longBreak * 60 : breakTime * 60;
    }
    updateDisplay();
    updateProgress();
  }
  function skipTimer() {
    PauseTimer();
    sessionComplete();
  }
  function sessionComplete() {
    PauseTimer();
    if (isWorkSession) {
      sessionCount++;
      totalMinutes += workTime;
      notificationDis("Work Session Completed!!!Time for a Break.");
    } else {
      notificationDis("Break Completed!! Work Session Startd..");
    }
    isWorkSession = !isWorkSession;
    if (isWorkSession) {
      curTime = workTime * 60;
      sessionTime.textContent = "Work Session";
      sessionTime.style.color = "green";
      progress.classList.remove("break");
      progress.classList.add("work");
    } else {
      const isLongBreak = sessionCount % 4 === 0;
      curTime = isLongBreak ? longBreak * 60 : breakTime * 60;
      progress.classList.remove("work");
      progress.classList.add("break");
      sessionTime.textContent = isLongBreak ? "Long Break" : " Short Break";
      sessionTime.style.color = "red";
    }
    totalTime = curTime;
    updateDisplay();
    updateProgress();
  }

  function adjustTime(type, delta) {
    if (isRunning) return;

    if (type === "work") {
      workTime = Math.min(60, Math.max(1, workTime + delta));
      workTimeDis.textContent = workTime;

      if (isWorkSession) curTime = workTime * 60;
    } else if (type === "break") {
      breakTime = Math.min(30, Math.max(1, breakTime + delta));
      shortBrk.textContent = breakTime;

      if (!isWorkSession && sessionCount % 4 !== 0) {
        curTime = breakTime * 60;
      }
    } else if (type === "longbreak") {
      longBreak = Math.min(60, Math.max(1, longBreak + delta));
      longBrk.textContent = longBreak;

      if (!isWorkSession && sessionCount % 4 === 0) {
        curTime = longBreak * 60;
      }
    }

    updateDisplay();
    updateProgress();
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
    startBtn.addEventListener("click", StartTimer);
    resetBtn.addEventListener("click", resetTimer);
    pauseBtn.addEventListener("click", PauseTimer);
    skipBtn.addEventListener("click", skipTimer);
    document.querySelector("#Wplus").addEventListener("click", () => {
      adjustTime("work", 1);
    });
    document.querySelector("#Wminus").addEventListener("click", () => {
      adjustTime("work", -1);
    });
    document.querySelector("#bplus").onclick = () => adjustTime("break", 1);
    document.querySelector("#bminus").onclick = () => adjustTime("break", -1);

    document.querySelector("#lbplus").onclick = () =>
      adjustTime("longbreak", 1);
    document.querySelector("#lbminus").onclick = () =>
      adjustTime("longbreak", -1);
  });
}
pomodoro();

function dailyGoal() {
  window.addEventListener("load", function () {
    let form = document.querySelector("#new-task-form");
    let input = document.querySelector("#new-task-input");
    let list = document.querySelector("#tasks");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let task = input.value;
      if (!task) {
        alert("Please fill out the task");
        return;
      }
      const taskEl = document.createElement("div");
      taskEl.classList.add("task");
      const taskContent = document.createElement("div");
      taskContent.classList.add("content");

      taskEl.appendChild(taskContent);

      const taskInputEl = document.createElement("input");
      taskInputEl.classList.add("text");
      taskInputEl.type = "text";
      taskInputEl.value = task;
      taskInput.setAttribute("readonly", "readonly");
      taskContent.appendChild(taskInputEl);
      list.appendChild(taskEl);
      const taskActionsEl = document.createElement("div");
      taskActionsEl.classList.add("action");
      const editButton = document.createElement("button");
      editButton.classList.add("edit");
      editButton.innerText = "Edit";
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete");
      deleteButton.innerText = "Delete";
      taskActionsEl.appendChild(editButton);
      taskActionsEl.appendChild(deleteButton);
      taskEl.appendChild(taskActionsEl);
      input.value = "";
      editButton.addEventListener("click", function () {
        if (editButton.innerText.toLowerCase() == "edit") {
          taskInputEl.removeAttribute("readonly");
          taskInputEl.focus();
          editButton.innerText = "Save";
        } else {
          taskInputEl.setAttribute("readonly", "readonly");
          editButton.innerText = "Edit";
        }
      });
      deleteButton.addEventListener("click", function () {
        list.removeChild(taskEl);
      });
    });
  });
}
dailyGoal();

function NavLinksFunc() {
  let WorkDashboard = document.querySelector("nav .nav-in .work");

  WorkDashboard.addEventListener("click", () => {
    WorkDashboard.classList.add("active");

    window.location.href = "index.html";
  });

  function NavBar() {
    let navLinks = document.querySelectorAll(".links a");
    let allFullElem = document.querySelectorAll(".fullelem");
    let WorkDashboard = document.querySelector(" nav .nav-in .work");
    WorkDashboard.addEventListener("click", () => {
      WorkDashboard.classList.add("active");
    });
    function hideAll() {
      allFullElem.forEach((sec) => (sec.style.display = "none"));
    }
    navLinks.forEach(function (link, index) {
      link.addEventListener("click", function () {
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");

        hideAll();
        allFullElem[index].style.display = "block";

        let text = this.innerText.trim();

        if (text === "Todo List") todo();
        else if (text === "Daily Planner") dayPlanner();
        else if (text === "Motivation") motivation();
        else if (text === "Pomodoro Timer") pomodoro();
        else if (text === "Daily Goals") dailyGoal();
      });
    });
  }

  NavBar();
}
NavLinksFunc();

function Weather() {
  let data = null;
  let Form = document.querySelector("form input");
  let CountryName = document.querySelector("form .country");
  let temp = document.querySelector(".header1 h2");
  let wind = document.querySelector(".header1 h3");
  let headerMonth = document.querySelector(".header2 h3");
  let header2Date = document.querySelector(".header2 h2");
  let humidity = document.querySelector(".humidity");
  let weather = document.querySelector(".weather");
  let feelLikes = document.querySelector(".feel-like");
  async function weatherAPI(cityname) {
    let key = "6bb6a9b21801ea9ef9da0f39f5c264ac";
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${key}&units=metric`
    );

    data = await response.json();

    temp.innerHTML = `Temp: <span>${data.main.temp}°C</span> `;
    wind.innerHTML = `Wind: <span> ${data.wind.speed}Km/h</span> `;
    humidity.innerHTML = `Humidity: <span>${data.main.humidity}</span>`;
    weather.innerHTML = ` Weather: <span>${data.weather[0].description}</span>`;
    CountryName.innerHTML = `${data.name},${data.sys.country}`;
    feelLikes.innerHTML = `Feels-like <span> ${data.main.feels_like}</span>`;
  }
  Form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // reload stop

      if (Form.value.trim() !== "") {
        weatherAPI(Form.value.trim());
        Form.value = "";
      }
    }
  });

  function getDate() {
    let WeekDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let dateobj = new Date();
    var getHours = dateobj.getHours();
    var getMinutes = dateobj.getMinutes();
    var seconds = dateobj.getSeconds();
    var month = dateobj.getMonth() + 1;
    var date = dateobj.getDate();
    var year = dateobj.getFullYear();

    headerMonth.innerHTML = `${date}/${months[month - 1]}/${year}`;
    let ampm = getHours >= 12 ? "PM" : "AM";
    getHours = getHours % 12 || 12;
    var dayOfWeek = WeekDay[dateobj.getDay()];
    header2Date.innerHTML = `${dayOfWeek}, <span style=" font-family:cyr;letter-spacing:0.1em;"> ${String(
      getHours
    ).padStart(2, "0")}:${String(getMinutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")} ${ampm}</span>`;
  }
  setInterval(() => {
    getDate();
  }, 1000);
  window.addEventListener("load", () => {
    weatherAPI("Allahabad");
  });
}
Weather();
function ThemeChange() {
  let flag = 0;
  let themeColor = document.querySelector(".theme");

  themeColor.addEventListener("click", () => {
    if (flag === 0) {
      document.documentElement.style.setProperty("--ran", " #1d1b1b");
      document.documentElement.style.setProperty("--llwhite", "#018790");
      document.documentElement.style.setProperty("--tri2", "#eee");
      document.documentElement.style.setProperty("--darkest", "#393E46");
      document.documentElement.style.setProperty("--nav", "#ec4899");
      flag = 1;
    } else if (flag == 1) {
      document.documentElement.style.setProperty("--yellow", " #FFEAD3");
      document.documentElement.style.setProperty("--lightPink", "#FFB6B9");
      document.documentElement.style.setProperty("--green", "#526D82");
      document.documentElement.style.setProperty("--pri", " rgb(225, 9, 9)");
      document.documentElement.style.setProperty("--sec", "#d5835d");
      flag = 2;
    } else if (flag == 2) {
      document.documentElement.style.setProperty("--lgray", "#26a5b9b7");
      document.documentElement.style.setProperty("--tri1", "#395B64");
      document.documentElement.style.setProperty("--cyan", " #628141");
      document.documentElement.style.setProperty("--lightPink", "#FFB6B9");
      document.documentElement.style.setProperty("--crimson", "#0840a7ad");
      flag = 3;
    } else if (flag == 3) {
      document.documentElement.style.setProperty("--lorange", "#4ecde4");
      document.documentElement.style.setProperty("--lblue", "#ff6b6b");
      document.documentElement.style.setProperty("--sea", " #155263");
      document.documentElement.style.setProperty("--lgrn", "#810000");
      document.documentElement.style.setProperty("--llgrn", "#0E8388");
      flag = 4;
    } else if (flag == 4) {
      document.documentElement.style.setProperty("--grayc", "red");
      document.documentElement.style.setProperty("--orange", "#2e8b57");
      flag = 5;
    } else if (flag == 5) {
      document.documentElement.style.setProperty("--pink", "#ff9a9e");
      document.documentElement.style.setProperty("--purple", "#a18cd1");
      document.documentElement.style.setProperty("--nav", "#6a0572");
      document.documentElement.style.setProperty("--pri", "#ff4e50");
      flag = 6;
    } else if (flag == 6) {
      document.documentElement.style.setProperty("--blue", "#00c6ff");
      document.documentElement.style.setProperty("--cyan", "#0072ff");
      document.documentElement.style.setProperty("--sec", "#f7971e");
      document.documentElement.style.setProperty("--darkest", "#1a1a2e");
      flag = 7;
    } else if (flag == 7) {
      document.documentElement.style.setProperty("--green", "#11998e");
      document.documentElement.style.setProperty("--tri2", "#38ef7d");
      document.documentElement.style.setProperty("--pri", "#0f2027");
      document.documentElement.style.setProperty("--nav", "#203a43");
      flag = 8;
    } else if (flag == 8) {
      document.documentElement.style.setProperty("--orange", "#f12711");
      document.documentElement.style.setProperty("--yellow", "#f5af19");
      document.documentElement.style.setProperty("--sec", "#ffe000");
      document.documentElement.style.setProperty("--tri1", "#c31432");
      flag = 9;
    } else if (flag == 9) {
      document.documentElement.style.setProperty("--lgrn", "#c471ed");
      document.documentElement.style.setProperty("--sky", "#12c2e9");
      document.documentElement.style.setProperty("--lightPink", "#f64f59");
      document.documentElement.style.setProperty("--darkest", "#232526");
      flag = 0;
    }
  });
}
ThemeChange();
