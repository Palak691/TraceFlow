 export default class ExpressErr extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;
    }
}
