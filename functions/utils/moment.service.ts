import * as MomentJS from 'moment';
class Moment {

    constructor(){
        MomentJS.locale('vi');
    }
    timeago(time:string|number){
        return MomentJS(time).fromNow();

    }
}

let moment = new Moment();
export default moment
