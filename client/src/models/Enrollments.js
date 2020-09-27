import { Model } from "@vuex-orm/core";
import Studies from "./Studies";

export default class Enrollments extends Model {
    static entity = "enrollments";

    static fields() {
        return {
            id: this.attr(null),
            study_id: this.attr(null),
            completed: this.boolean(false),
            study: this.belongsTo(Studies, "study_id"),
        };
    }
}
