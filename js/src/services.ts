import { Activitie } from './Activitie';
import { Config } from './config';
import { Utils } from './utils';

export class ActivitieService {

    //    envoirment = 'production';
    private envoirment = 'production';
    private server : string;    
    private utils: Utils;

    constructor() {
        this.server = this.envoirment == 'production' ? Config.SERVER : Config.DEV_SERVER;        
        this.utils = new Utils();        
    }

    getActivities(): Promise<Activitie[]> {
        const url = `${this.server}/api/dashboard`;                        
        const p = new Promise<Activitie[]>((resolve, reject) => {
            this.utils.request(url, (err: Error, data: string ) => {
                if (err) {
                    reject(err);
                }
                const activities: Activitie[] = JSON.parse(data);
                resolve(activities);                
            });
        });
        return p;
    }

    create() {

    }

    update() {

    }

    delete() {

    }

}