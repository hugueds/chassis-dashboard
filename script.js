var statusEdit = false;
var activities = [];
var filteredActivities = [];
var activity = new Activity();
var order = "desc";
var logged = false;

var currentPage = 0;
var pages = 0;
var itensPerPage = 50;

window.onload = function () {
    checkLogin();
    ping(SERVER + '/api/dashboard', function (result) {
        if (!result) {
            SERVER = SERVER_DOWN;
        }
        getActivities(generateTable);
        generateFilters();
        generateOptions();
    });
}

function generateFilters() {
    var filters = [LINES, STATUS, TYPES];
    // var filterLine = document.querySelector('#filter-line');
    var filterFunction = document.querySelector('#filter-function');
    var filterStatus = document.querySelector('#filter-status');
    var filterType = document.querySelector('#filter-type');
    var filterInput = document.querySelector('#filter-input');
    FUNCTION_AREAS.forEach(function(func) {
        var option = document.createElement('option');
        option.value = func;
        option.textContent = func;
        filterFunction.appendChild(option);
    });
    // LINES.forEach(function (line) {
    //     var option = document.createElement('option');
    //     option.value = line;
    //     option.textContent = line;
    //     filterLine.appendChild(option);
    // });
    STATUS.forEach(function (status) {
        var option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        filterStatus.appendChild(option);
    });
    TYPES.forEach(function (type) {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        filterType.appendChild(option);
    });
    INPUTS.forEach(function (input) {
        var option = document.createElement('option');
        option.value = input;
        option.textContent = input;
        filterInput.appendChild(option);
    });
}

function generateTable(data) {
    var thead = document.querySelector('thead');
    var tbody = document.querySelector('tbody');
    document.querySelector('.table-wrapper').style.display = 'flex';
    $('thead').empty();
    $('tbody').empty();
    TABLE_CONTENT.forEach(function (tc, index) {
        var th = document.createElement('th');
        th.className = 'theader';
        th.onclick = function () { orderBy(tc.field) }
        th.textContent = tc.header;
        thead.appendChild(th);
    });
    data.map(function (d) {
        var row = document.createElement('tr');
        TABLE_CONTENT.map(function (tc) {
            var td = document.createElement('td');
            td.textContent = d[tc.field] != undefined ? d[tc.field] : '';
            switch(tc.field) {
                case 'handover': 
                break;
                case 'details':
                break;
                case 'projectPercent':
                break;
                case 'calendar':
                    var btn = document.createElement('button');
                    btn.className = 'btn btn-default';                    
                    btn.innerHTML = '<img  src="images/calendar-3x.png" />';
                    btn.onclick = function() { openCalendar(d) };
                    td.appendChild(btn);
                break;
            }
            if (tc.field == "handover") {
                td.textContent = dateFormatter(td.textContent);
            }
            else if (tc.field == 'details') {
                var btn = document.createElement('button');
                btn.setAttribute('data-toggle', 'modal');
                btn.setAttribute('data-target', '#activity-modal');
                btn.className = 'btn btn-primary';
                btn.textContent = 'VER';
                btn.onclick = function () { openActivityDetails(d) };
                td.appendChild(btn);
            }
            else if (tc.field == 'projectPercent') {
                updatePercentage2(td, d[tc.field])
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

function openCalendar(project) {    
    localStorage.setItem('currentProject', JSON.stringify(project));    
    window.location = 'schedule';
}

function filterActivities() {
    var selectedFunction = document.querySelector('#filter-function').value;
    // var selectedLine = document.querySelector('#filter-line').value;
    var selectedStatus = document.querySelector('#filter-status').value;
    var selectedType = document.querySelector('#filter-type').value;
    var selectedInput = document.querySelector('#filter-input').value;
    filteredActivities = activities;
    if (selectedFunction != 'ALL')
        filteredActivities = filteredActivities.filter(function (a) { return a.functionArea == selectedFunction });
    // if (selectedLine != 'ALL')
    //     filteredActivities = filteredActivities.filter(function (a) { return a.line == selectedLine });
    if (selectedStatus != 'ALL')
        filteredActivities = filteredActivities.filter(function (a) { return a.projectStatus == selectedStatus });
    if (selectedType != 'ALL')
        filteredActivities = filteredActivities.filter(function (a) { return a.type == selectedType });
    if (selectedInput != 'ALL')
        filteredActivities = filteredActivities.filter(function (a) { return a.input == selectedInput });
    document.getElementById('total-activities').innerHTML = filteredActivities.length;
    generateTable(filteredActivities);
}

function getActivities(callback) {
    activities = [];
    $.get(SERVER + '/api/dashboard', function (data) {
        data.map(function (d) { activities.push(new Activity(d)); });
        filteredActivities = activities;
        console.log('Atividades carregadas com sucesso');
        document.getElementById('total-activities').innerHTML = activities.length;
        callback(activities);
    });
}

function openActivityDetails(data) {

    statusEdit = false;
    disableEdit();
    document.querySelector('#form-id').value = data.id;
    document.querySelector('#form-type').value = data.type;
    document.querySelector('#form-line').value = data.line;
    document.querySelector('#form-function-area').value = data.functionArea;
    document.querySelector('#form-station').value = data.station;
    document.querySelector('#form-position').value = data.position;
    document.querySelector('#form-project').value = data.project;
    document.querySelector('#form-responsible').value = data.responsible;
    document.querySelector('#form-involved-1').value = data.involved_1;
    document.querySelector('#form-involved-2').value = data.involved_2;
    document.querySelector('#form-involved-3').value = data.involved_3;
    document.querySelector('#form-input').value = data.input;
    document.querySelector('#form-ncg').value = data.ncg;
    document.querySelector('#form-machine-type').value = data.machineType;
    document.querySelector('#form-existing-tool').value = data.isExistingTool ? 'true' : 'false';
    document.querySelector('#form-activity').value = data.activity;
    document.querySelector('#form-input-date').value = dateFormatter(data.inputDate);
    document.querySelector('#form-ad-aproval-date').value = dateFormatter(data.adAproval);
    document.querySelector('#form-project-number').value = data.projectNumber;
    document.querySelector('#form-project-budget').value = data.projectBudget;
    document.querySelector('#form-req-almox-os').value = data.reqAlmox_OS;
    document.querySelector('#form-status-almox-os').value = data.statusReq_OS;
    document.querySelector('#form-rc-number').value = data.rcNumber;
    document.querySelector('#form-rc-status').value = data.rcStatus;
    document.querySelector('#form-order-number').value = data.orderNumber;
    document.querySelector('#form-layout-infra').value = data.infra_Layout;
    document.querySelector('#form-install-tryout-date').value = dateFormatter(data.installation_TryOut);
    document.querySelector('#form-handover-date').value = dateFormatter(data.handover);
    document.querySelector('#form-phase').value = data.phase;
    // document.querySelector('#form-phase-delivery').value = dateFormatter(data.phaseDelivery);
    document.querySelector('#form-project-status').value = data.projectStatus;
    document.querySelector('#form-comments').value = data.comments;
    document.querySelector('#form-priority').value = data.priority;
    document.querySelector('#form-npr').value = data.npr;
    document.querySelector('#form-percentage').value = data.projectPercent;

    var el = document.querySelector('#form-percentage');
    updatePercentage2(el, el.value);

    document.querySelector('#save-button').disabled = !logged;
    document.querySelector('#edit-button').disabled = !logged;
    document.querySelector('#delete-button').disabled = !logged;

}

function updateActivity() {

    activity.id = document.querySelector('#form-id').value;
    activity.type = document.querySelector('#form-type').value;
    activity.line = document.querySelector('#form-line').value;
    activity.functionArea = document.querySelector('#form-function-area').value;
    activity.station = document.querySelector('#form-station').value;
    activity.position = document.querySelector('#form-position').value;
    activity.project = document.querySelector('#form-project').value;
    activity.responsible = document.querySelector('#form-responsible').value;
    activity.involved_1 = document.querySelector('#form-involved-1').value;
    activity.involved_2 = document.querySelector('#form-involved-2').value;
    activity.involved_3 = document.querySelector('#form-involved-3').value;
    activity.input = document.querySelector('#form-input').value;
    activity.ncg = document.querySelector('#form-ncg').value;
    activity.machineType = document.querySelector('#form-machine-type').value;
    activity.isExistingTool = document.querySelector('#form-existing-tool').value == 'true' ? true : false;
    activity.activity = document.querySelector('#form-activity').value;
    activity.inputDate = generateDate(document.querySelector('#form-input-date').value);
    activity.adAproval = document.querySelector('#form-ad-aproval-date').value;
    activity.projectNumber = document.querySelector('#form-project-number').value;
    activity.projectBudget = document.querySelector('#form-project-budget').value;
    activity.reqAlmox_OS = document.querySelector('#form-req-almox-os').value;
    activity.statusReq_OS = document.querySelector('#form-status-almox-os').value;
    activity.rcNumber = document.querySelector('#form-rc-number').value;
    activity.rcStatus = document.querySelector('#form-rc-status').value;
    activity.orderNumber = document.querySelector('#form-order-number').value;
    activity.infra_Layout = document.querySelector('#form-layout-infra').value;
    activity.installation_TryOut = generateDate(document.querySelector('#form-install-tryout-date').value);
    activity.handover = generateDate(document.querySelector('#form-handover-date').value);
    activity.phase = document.querySelector('#form-phase').value;
    // activity.phaseDelivery = generateDate(document.querySelector('#form-phase-delivery').value);
    activity.projectPercent = document.querySelector('#form-percentage').value;
    activity.projectStatus = document.querySelector('#form-project-status').value;
    activity.comments = document.querySelector('#form-comments').value;
    activity.priority = document.querySelector('#form-priority').value;
    activity.npr = document.querySelector('#form-npr').value;

    $.post(SERVER + '/api/dashboard/' + activity.id, activity)
        .done(function (data) {
            getActivities(function (data) {
                filterActivities();
                generateTable(filteredActivities)
                toastr.success("ATIVIDADE SALVA COM SUCESSO");
            });
        })
        .fail(function (err) { toastr.error("ERRO AO CRIAR REQUISIÇÃO"); console.error(err) });
}

function enableEdit() {

    var fields = [
        'type', 'project', 'line', 'function-area', 'station', 'position', 'responsible',
        'involved-1', 'involved-2', 'involved-3', 'ncg', 'machine-type', 'existing-tool', 'activity',
        'ad-aproval-date', 'project-number', 'project-budget', 'req-almox-os', 'status-almox-os', 'rc-status',
        'rc-number', 'order-number', 'layout-infra', 'install-tryout-date', 'priority', 'handover-date', 'phase', /*'phase-delivery', */, 'percentage',
        'project-status', 'comments', 'npr'
    ];

    fields.map(function (field, index) {
        document.querySelector('#form-' + field).disabled = false;
    });

    document.querySelector('#edit-button').style.display = 'none';
    document.querySelector('#delete-button').style.display = 'block';

}

function disableEdit() {

    var fields = [
        'type', 'project', 'line', 'function-area', 'station', 'position', 'responsible',
        'involved-1', 'involved-2', 'involved-3', 'ncg', 'machine-type', 'existing-tool', 'activity',
        'ad-aproval-date', 'project-number', 'project-budget', 'req-almox-os', 'status-almox-os', 'rc-status',
        'rc-number', 'order-number', 'layout-infra', 'install-tryout-date', 'priority', 'handover-date', 'phase', /* 'phase-delivery', */ 'percentage',
        'project-status', 'comments', 'npr'
    ];

    fields.map(function (field, index) {
        document.querySelector('#form-' + field).disabled = true;
    });
    document.querySelector('#edit-button').style.display = 'block';
    document.querySelector('#delete-button').style.display = 'none';

}

function deleteActivity() {
    var response = window.confirm('DESEJA EXCLUIR ESTA ATIVIDADE?');
    if (!response) return;

    var actv = document.querySelector('#form-id');
    $.get(SERVER + '/api/dashboard/delete/' + actv.value, function (data) {
        if (data.Status == 'OK') {
            toastr.success(data.Message);
            getActivities(function (data) {
                filterActivities();
                generateTable(filteredActivities)
            });
        }
    });
}

function generateOptions() {
    OPTION_FIELDS.forEach(function (option) {
        option.value.forEach(function (o) {
            var selection = document.getElementById('form-' + option.type);
            var el = document.createElement('option');
            el.value = o;
            el.textContent = o;
            selection.appendChild(el);
        });
    })
}

function updatePercentage() {
    var inputPercent = document.querySelector('#form-percentage');
    var phase = document.querySelector('#form-phase').value;
    var newPhase = PHASES.filter(function (ph) { return ph.name == phase })[0];
    if (!newPhase) return;
    if (newPhase.percentage >= 0 && newPhase.percentage <= 30) {
        inputPercent.style.background = 'yellow';
    } else if (newPhase.percentage > 60) {
        inputPercent.style.background = 'limegreen';
    } else {
        inputPercent.style.background = 'lightgrey';
    }
    inputPercent.value = newPhase.percentage;
}

function updatePercentage2(element, percentage) {
    if (percentage > 0 && percentage <= 30) {
        element.style.backgroundColor = 'gold';
    } else if (percentage > 30 && percentage <= 60) {
        element.style.backgroundColor = 'lightgrey';
    } else if (percentage > 60) {
        element.style.backgroundColor = 'limegreen';
    } else {
        element.style.backgroundColor = 'bisque';
    }
}

function orderBy(column) {
    if (column == 'handover') {
        filteredActivities = filteredActivities.sort(function (a, b) {
            if (a[column] == null)
                return 1;
            if (b[column] == null)
                return -1;
            if (order == "asc") {
                return new Date(a[column]) > new Date(b[column]) ? 1 : -1;
            }
            return new Date(a[column]) < new Date(b[column]) ? 1 : -1;
        });
    } else {
        filteredActivities = filteredActivities.sort(function (a, b) {
            if (order == "asc")
                return (a[column] > b[column]) - (a[column] < b[column])
            else
                return (a[column] < b[column]) - (a[column] > b[column])
        });
    }
    if (order == "asc") {
        order = "desc";
    } else {
        order = "asc"
    }
    // filteredActivities = filteredActivities.sort((a, b) => (a[column] > b[column]) - (a[column] < b[column]))
    generateTable(filteredActivities);
}

function login() {
    var pass = prompt('INSIRA A SENHA MAGICA');
    if (parseInt(pass) == 0xDFF) {
        logged = true;
        localStorage.setItem('logged', true);
        document.querySelector('#button-login').style.display = 'none';
        document.querySelector('#button-logoff').style.display = 'block';
    } else {
        alert('Senha incorreta!');
    }
}

function logoff() {
    logged = false;
    localStorage.setItem('logged', false);
    document.querySelector('#button-login').style.display = 'block';
    document.querySelector('#button-logoff').style.display = 'none';
}

function checkLogin() {
    if (localStorage.getItem('logged')) {
        logged = localStorage.getItem('logged') == "true" ? true : false;
    } 
    if (logged) {
        document.querySelector('#button-login').style.display = 'none';
        document.querySelector('#button-logoff').style.display = 'block';
    } else {
        document.querySelector('#button-login').style.display = 'block';
        document.querySelector('#button-logoff').style.display = 'none';
    }
}

