function loadLocalVariables() {

}

function loadConfig() {
    request('/ifup/config.json', function(err, data) {
        data = JSON.parse(data);
        new Promise(function(res, rej) {
            res(data)
        });
    });
}