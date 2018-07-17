var api = {
    server: 'http://10.8.66.4/LTSApi',
    // server: 'http://localhost:59450',
    serverDown: 'http://192.27.1.150/LtsApi',
    localServer: 'http://localhost',
    routePrefix: '/api/tasks',
    url: function () {
        return this.server + this.routePrefix;
    }
}

var project = {};
var tasks = [];
var users = [];
var schedule = {};
var currentTask = {};
var currentUser = {};
var currentUserIndex = 0;
var currentEditTask = {};
var currentEditUserTask = {};
var currentRemoveTask = "";
var PEIP = [];

function onInit() {
    project = getProject(); // project.Id = 39;
    $('#project-name').text(project.project);
    getSchedule(project.id, (data) => {
        loadConfig(() => {
            schedule.users = data.userTasks;
            schedule.tasks = data.tasks;
            generatePeipPhases();
            generateUserList();
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
    lastSchedule = schedule;
    $('#pit-scheduler').pitScheduler(schedule);
}


function saveTask(task, callback) {
    currentTask = task;
    $.post(api.url() + '/project', task)
        .done(function (data) { callback(null, data) })
        .fail(function (err) { callback(err) });
}


/** EVENTS */

function onChange(settings) {
    console.log('Schedule Changed');
}

function onTaskCreation(settings) {
    let task = getLastTask(settings);
    task.projectId = project.id;
    saveTask(task, function (err, data) {
        if (!err) {
            return console.log('Task salva com sucesso', JSON.stringify(data));
        }
        console.error(err);
    });
}

function onTaskAssignation(settings) { // Quando associa a task para uma pessoa
    let user = settings.users[currentUserIndex];
    let userTask = user.tasks.find(t => t.id == currentTask.id);
    $.get(api.url() + '/name/' + currentTask.name + '/' + currentTask.projectId, function (task) {
        let newUserTask = {
            taskId: task.id,
            startDate: userTask.start_date,
            endDate: userTask.end_date,
            userId: user.userId,
            groupId: user.groupId
        }
        $.post(api.url() + '/schedule', newUserTask)
            .done((data) => console.log(data, 'Save succefully'))
            .fail((err) => console.error('There was an error during save request'));
    });

    return;
}

function onTaskEdition(settings) {
    let task = currentEditTask;
    $.post(api.url() + '/update/' + task.id.replace('_', ''), task)
        .done((data) => console.log('Task Updated succefully'))
        .fail((err) => console.error(err));
}
function onTaskRemoval(settings) { //Quando Deleta a task
    console.log('Task Removal');
    let taskId = currentRemoveTask.getAttribute('data-task').replace('_', '');
    $.post(api.url() + '/user-task/remove/' + taskId)
        .done((data) => {
            console.log('User Task removed', data);
        })
        .fail((err) => console.error(err));
}

function onUserCreation(settings) {
    console.log('User created');
}

function onUserEdition(settings) { // Quando altera a data   
    if (!currentEditUserTask.hasOwnProperty('user')) {
        console.log('Time Updated, no database changes');
        return;
    }
    let usr = settings.users[currentEditUserTask.user.index];
    let task = currentEditUserTask.task;
    let userTask = {
        taskId: task.id.replace('_', ''),
        startDate: new Date(task.start_date._d).toISOString(),
        endDate: new Date(task.end_date._d).toISOString(),
        userId: usr.userId,
        groupId: usr.groupId,
        projectId: project.id
    }
    $.post(api.url() + '/user-task/update', userTask)
        .done((data) => {
            console.log('User Task updated', data);
        })
        .fail((err) => console.error(err));
}
function onUserTaskDeletion(settings) {
    console.log('User Task Deleted');
}
function onUserRemoval(settings) {
    console.log('User removal');
}

// Main Schedule
function getSchedule(projectId, callback) {
    var t = [];
    $.get('./data/peip.json')
        .done((data) => {            
            PEIP = data.map(p => {
                p.projectId = project.id;
                return p;
            });
            $.get(api.url() + '/schedule/' + projectId)
                .done((data) => {
                    // PEIP.map(p => data.tasks.push(p));
                    data.tasks = data.tasks.map(dt => {
                        dt.id = '_' + dt.id.toString();
                        return dt;
                    });
                    let utask = data.userTasks;
                    data.userTasks = utask.map((ut, i) => {
                        let newUtTasks = [];
                        let newUt = {
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
                    data.users.map((u, i) => {
                        let found = false;
                        u.tasks = [];
                        data.userTasks.map((ut, i2) => {
                            if (u.name == ut.name)
                                found = true;
                        });
                        if (!found) {
                            data.userTasks.push(u);
                        }
                    });
                    data.userTasks = data.userTasks.sort((a, b) => {
                        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                        if (nameA < nameB) //sort string ascending
                            return -1
                        if (nameA > nameB)
                            return 1
                        return 0
                    });
                    callback(data);
                });
        });
    //.fail(callback());
}

function getProject() {
    return JSON.parse(localStorage.getItem('currentProject'));
}

function getCurrentTask() {
    let task = {};
    return;
}

function getLastTask(settings) {
    var index = settings.tasks.length - 1;
    return settings.tasks[index];
}

function getLastUserTask(settings) {
    var index = settings.users.length - 1;
    return settings.users[index];
}

function getLastUserTask(userIndex, taskId) {
    let user = schedule.users[userIndex];
    let userTask = user.tasks.filter(t => t.id == taskId);
}

$(document).ready(onInit);


$('.peip-date-time').datetimepicker({ format: 'DD/MM/YYYY' });

function generatePeipPhases() {
    let peipMask = '<option style="background: {color}" value="{taskId}" id="peip-{id}" class="peip-task" data-group="{groupId}">  {task} </option>'
    PEIP.map((p, i) => {        
        let taskId = p.id;
        let stringElement = peipMask.replace('{id}', i + 1)
            .replace('{color}', p.color)
            .replace('{task}', p.name)
            .replace('{taskId}', taskId);

        let element = $(stringElement);
        $('#select-peip').append(element);
    });
}

function generateUserList() {
    let userMask = '<option value="{userId}" id="user-{id}" class="peip-user" data-group="{groupId}">  {userName} </option>';
    schedule.users.map((u, i) => {
        let userId = u.userId;
        let groupId = u.groupId;
        let stringElement = userMask.replace('{id}', i + 1)
            .replace('{userId}', u.userId)
            .replace('{groupId}', u.groupId)
            .replace('{userName}', u.name);

        let element = $(stringElement);
        $('#select-user').append(element);
    });
}

function validateDates(st, end) {
    let a = st.split('/');
    a[1] = a[1] - 1;
    let c = new Date(a[2], a[1], a[0]);
    let b = end.split('/');
    b[1] = b[1] - 1;
    let d = new Date(b[2], b[1], b[0]);
    return c < d;
}

function convertToDate(date) {
    let a = date.split('/');
    a[1] = a[1] - 1;
    return new Date(a[2], a[1], a[0]).toISOString();
}

function savePeipTask() {

}

$('#save-peip-task').on('click', (e) => {
    // Salva task
    // Busca Id da task salva
    // Salva task com novo Id
    // Procurar task
    
    let userId = $('#select-user').val();
    let peipTask = $('#select-peip').val();
    let groupId = $('option:selected', '#select-user').attr('data-group');
    let startDate = $('#peip-start-date').val();
    let endDate = $('#peip-end-date').val();
    let result = validateDates(startDate, endDate);
    let newTask = PEIP.find( x => x.id == peipTask);    
    if (!result) {
        alert('Atenção! Data final deve ser maior que a inicial');
        $('#peip-end-date').val('');
        return;
    }
    $.post(api.url() + '/project', newTask)
        .done((task) => {
            console.log(task);
            let userTask = {
                // taskId: userTask, // Pegar Id após salvar no banco
                taskId: task.id,
                userId: userId,
                groupId: groupId,
                startDate: convertToDate(startDate),
                endDate: convertToDate(endDate),
                projectId: project.id
            }
            $.post(api.url() + '/schedule', userTask)
                .done((data) => {
                    console.log(data);
                    location.reload();
                })
                .fail((err) => console.error(err));
        });

});