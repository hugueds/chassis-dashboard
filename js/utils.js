function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error("Erro na requisição"));
            }
        }
    }
    xhr.send(null);
}

function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error("Erro na requisição"));
            }
        }
    }
    xhr.send(data);
}

function generateDate(date) {
    return date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1');
}

function dateFormatter(date) {
    if (date)
        return date.slice(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1');
    return 'SEM DATA';
}

$(function () {

    var dateConfig = {
        dateFormat: 'dd-mm-yy',
        locale: 'pt-br',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        nextText: 'Proximo',
        prevText: 'Anterior'
    }

    $("[id$=date]").datepicker(dateConfig).datepicker("setDate", new Date);
});

Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}

toastr.options = {
    "showDuration": "300",
    "hideDuration": "300",
    "timeOut": "300",
    "extendedTimeOut": "1000",
    "positionClass": "toast-top-center"
}



