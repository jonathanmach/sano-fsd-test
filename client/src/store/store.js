import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import Studies from "@/models/Studies";
import Enrollments from "@/models/Enrollments";
import Api from "@/api/export";

Vue.use(Vuex);

// 1. Create new instance of Database
const database = new VuexORM.Database();

// 2. Register Models
database.register(Studies);
database.register(Enrollments);

// 3. Create Vuex Store and register database through Vuex ORM.
export default new Vuex.Store({
    plugins: [VuexORM.install(database)],
    state: {
        menu_hidden: true,
        mobile_menu_hidden: true,
    },
    getters: {
        menu_hidden: (state) => state.menu_hidden,
    },
    mutations: {},
    actions: {
        loadInitialData() {
            Promise.all([Api.pub.get_studies(), Api.user.get_enrollments()]).then((responses) => {
                const studies = responses[0].data.filter((study) => study.visible);
                const enrollments = responses[1].data;

                // Add data to the store
                Studies.insert({
                    data: studies,
                });
                Enrollments.insert({
                    data: enrollments,
                });
            });
        },
    },
});
