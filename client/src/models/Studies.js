import { Model } from "@vuex-orm/core";
import Enrollments from "./Enrollments";

export default class Studies extends Model {
    static entity = "studies";

    static fields() {
        return {
            id: this.attr(null),
            key: this.string(""),
            title: this.string(""),
            short_title: this.string(""),
            description: this.string(""),
            visible: this.boolean(false),
            enrollment: this.hasOne(Enrollments, "study_id"),
        };
    }
}
