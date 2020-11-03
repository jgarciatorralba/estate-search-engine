import { config } from "../config/app-config.js";

export default function main() {
    //DEFAULT RESPONSE TO SUCCESS AND FAILURE REQUESTS PROMISES
        const response = (prom, res) => { 
            prom.then(data => res.json({ data: data, status: true }))
                .catch(error => res.json({ data: error, status: false }))
        };

    
}