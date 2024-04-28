import env from "./env";

const canLog = () => env.NODE_ENV != "development";

const log = {
    info: (message: string) => {
        if (canLog())
        {
            console.log(message)
        }
    },
    warn: (message: string) => {
        if (canLog())
        {
            console.warn(message)
        }
    },
    error: (message: string) => {
        if (canLog())
        {
            console.error(message)
        }
    }
}

export default log;