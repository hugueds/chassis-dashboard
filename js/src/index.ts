import { Activitie, ActivitieStatus } from './Activitie';
import { ActivitieService } from './services';
import { Config } from './config';
// import * as $ from 'jquery';

export class Main {

    activities: Activitie[];
    private services = new ActivitieService();

    private window: Window;

    constructor(_window?: Window) {
        this.services = new ActivitieService();
        this.window = _window;
        // _window.onload = this.onLoad;
        // _window.onclick = this.onLoad;        
    }

    onLoad() {
        this.services.getActivities().then((act) => {
            // this.activities = act;
            // this.generateTable(act);
        });
    }

    generateTable(data: Activitie[]) {
        console.log(654654);
        const thead = document.querySelector('thead');
        const tbody = document.querySelector('tbody');
        // document.querySelector('.table-wrapper').style.display = 'flex';
        thead.innerHTML = "";
        tbody.innerHTML = "";
        // $('thead').empty();
        // $('tbody').empty();
        TABLE_CONTENT.forEach((tc, index) => {
            const th = document.createElement('th');            
            th.className = 'theader';
            // th.onclick = function () { orderBy(tc.field) }
            th.textContent = tc.header;
            thead.appendChild(th);
        });
        data.map( d => {
            const row = document.createElement('tr');
            TABLE_CONTENT.map((tc) => {
                const td = document.createElement('td');
                // td.textContent = d[tc['field']];
                if (tc.field == "handover") {
                    td.textContent = dateFormatter(td.textContent);
                }
                if (tc.field == 'details') {
                    const btn = document.createElement('button');
                    btn.setAttribute('data-toggle', 'modal');
                    btn.setAttribute('data-target', '#activity-modal');
                    btn.className = 'btn btn-primary';
                    btn.textContent = 'VER';
                    // btn.onclick = function () { openActivityDetails(d) };
                    td.appendChild(btn);
                }
                if (tc.field == 'projectPercent') {
                    // updatePercentage2(td, d[tc.field])
                }
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    }

    generateOptions() {
    }

    generateFilters() {
    }

}

const APP = new Main(window);
