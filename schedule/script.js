var api = {
    // server: 'http://10.8.66.4/LTSApi',
    server: 'http://localhost:59450',
    serverDown: 'http://192.27.1.150/LtsApi',
    localServer: 'http://localhost',
    routePrefix: '/api/tasks',
    url: function () {
        return this.server + this.routePrefix;
    }
}

var project = getProject(); project.Id = 39;
var tasks = [];
var users = [];
var schedule = {};

function onInit() {
    getSchedule(project.Id, (data) => {
        loadConfig(() => {
            schedule.users = data.userTasks;
            schedule.tasks = data.tasks;
            loadScheduler();
        });
    });
}

function loadConfig(callback) {
    $.get('scheduleConfig.json', function (data) {
        data.onChange = onChange;
        data.onTaskCreation = onTaskCreation;
        data.onTaskEdition = onTaskEdition;
        data.onTaskRemoval = onTaskRemoval;
        data.onUserCreation = onUserCreation;
        data.onUserRemoval = onUserRemoval;
        data.onUserEdition = onUserEdition;
        data.onTaskAssignation = onTaskAssignation;
        data.onUserTaskDeletion = onUserTaskDeletion;
        data.tasks = tasks;
        data.users = users;
        schedule = data;
        callback();
    });
}



function loadScheduler() {
    $('#pit-scheduler').pitScheduler(schedule);
}

function saveTask(task, callback) {
    $.post(api.url() + '/project', task)
        .done(function (data) { callback(data) })
        .fail(function (err) { callback(err) });
}

function saveUserTask(task, callback) {

}

function onChange(settings) {
    console.log('Schedule Changed');
}

function onTaskCreation(settings) {
    var task = getLastTask(settings);
    task.projectId = project.Id; // project.id
    saveTask(task, function (err, data) {
        if (!err) {
            return console.log('Task salva com sucesso', data);
        }
        console.error(err);
    });
}

function onTaskAssignation(settings) {
    var userTask = getLastUserTask(settings);
    var lastTask = userTask.tasks[userTask.tasks.length - 1];
    console.log(lastTask)
    var task = {
        startDate: lastTask.start_date,
        endDate: lastTask.end_date,
        taskId: Number(lastTask.id.replace('_', '')),
        userId: userTask.userId,
        groupId: userTask.groupId
    };
    console.log(task);
    $.post(api.url() + '/schedule', task).done((data) => console.log('saved'))
}
function onTaskEdition(settings) {
    console.log('Task Edition');
}
function onTaskRemoval(settings) {
    console.log('Task Removal');
}
function onUserCreation(settings) {
    console.log('User created');
}
function onUserEdition(settings) {
    console.log('User edited');
}
function onUserTaskDeletion(settings) {
    console.log('Task Deleted');
}
function onUserRemoval(settings) {
    console.log('User removal');
}

function getSchedule(projectId, callback) {
    var t = [];
    $.get(api.url() + '/schedule/' + projectId)
        .done((data) => {
            data.tasks = data.tasks.map(dt => {
                dt.id = '_' + dt.id.toString();
                return dt;
            });
            var utask = data.userTasks;
            data.userTasks = utask.map((ut, i) => {
                var newUtTasks = [];
                var newUt = {
                    userId: ut[0].userId,
                    groupId: ut[0].groupId,
                    name: ut[0].name,
                    group: ut[0].group
                }
                ut.map((u) => {
                    newUtTasks.push({
                        id: '_' + u.id.toString(),
                        start_date: u.start_date,
                        end_date: u.end_date
                    });
                });
                newUt.tasks = newUtTasks;
                return newUt;
            });
            callback(data);
        });
}

function getProject() {
    // return JSON.parse(localStorage.getItem('currentProject'));
    return {
        "Id": 39,
        "Type": "PY",
        "Line": "ALL",
        "FunctionArea": "FA0",
        "Station": "1",
        "Position": 5,
        "Project": "Bancada de Teste de Freio ",
        "Responsible": "SSBFCI",
        "Input": "TQC",
        "NCG": "REWORK",
        "Activity": "Adaptação para acesso interior ao veículo NGS/NTG",
        "InputDate": null,
        "ADAproval": null,
        "ReqAlmox_OS": "231276",
        "StatusReq_OS": null,
        "RCNumber": null,
        "RCStatus": null,
        "OrderNumber": null,
        "Infra_Layout": "Ok",
        "Installation_TryOut": "2018-03-30T00:00:00",
        "Handover": "2018-04-13T00:00:00",
        "Phase": "INSTALLATION",
        "ProjectPercent": 90,
        "ProjectStatus": "ON GOING",
        "Comments": "Aguardando a chegada dos niples de adaptação",
        "Priority": 13,
        "NPR": null
    }
}

function getLastTask(settings) {
    var index = settings.tasks.length - 1;
    return settings.tasks[index];
}

function getLastUserTask(settings) {
    var index = settings.users.length - 1;
    return settings.users[index];
}

$(document).ready(onInit);

Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}
