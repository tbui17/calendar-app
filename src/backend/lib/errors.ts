


export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }
}

export class DatabaseRetrieveError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseRetrieveError";
    }
    
}

export class DatabaseRetrieveNoResultError extends DatabaseRetrieveError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseRetrieveNoResultError";
    }
}

export class DatabaseWriteError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseWriteError";
    }
}

export class DatabaseDeleteError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseDeleteError";
    }
}

export class DatabaseMultiTransactionError extends DatabaseError {
    constructor(message: string, public errors:DatabaseError[]) {
        super(message);
        this.name = "DatabaseMultiError";
    }
}


function main(){
    const res = new DatabaseRetrieveError("test")
    if (res instanceof DatabaseError){
        console.log("yes")
    }
    else{
        console.log("no")
    }
}
