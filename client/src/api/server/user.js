import axios from "axios";

export function get_enrollments() {
    return new Promise((resolve, reject) => {
        axios
            .get("/enrollments")
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function post_enrollment(studyId) {
    return new Promise((resolve, reject) => {
        axios
            .post(`/studies/${studyId}/enroll`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function delete_enrollment(studyId) {
    return new Promise((resolve, reject) => {
        axios
            .delete(`/studies/${studyId}/unenroll`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
