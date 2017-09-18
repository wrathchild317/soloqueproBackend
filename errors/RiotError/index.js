export default function(code){
    switch(code) {
        case 404:
            return {
                status: code,
                message: 'Data not found',
            }
        case 500: 
            return {
                status: code,
                message: 'Internal server error'
            }
        default: 
            return {
                status: 500,
                message: 'Unknown - Internal server error',
            }
    }
}