import axios from "axios";

export function get_studies() {
    // TBD: Axios already returns a promise
    // alternative: return axios.get("/studies")

    return new Promise((resolve, reject) => {
        axios
            .get("/studies")
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
