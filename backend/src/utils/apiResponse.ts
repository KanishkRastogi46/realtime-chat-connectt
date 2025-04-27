class ApiResponse {
    constructor(public data: any, public message: string,  public success: boolean, public status: number) {
        this.message = message;
        this.data = data;
        this.status = status;
        this.success = success;
    }
}

class ApiErrorResponse extends Error {
    public success: boolean;

    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;

        if (this.stack) {
            console.error(this.stack);
        } else {
            process.exit(1);
        }
    }
}


export { ApiResponse, ApiErrorResponse };