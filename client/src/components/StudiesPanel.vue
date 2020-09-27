<template>
    <div>
        <div class="hidden sm:flex font-medium mb-3">
            <div class="w-2/4 uppercase">Study</div>
            <div class="w-1/4 uppercase">Status</div>
            <div class="w-1/4 uppercase">Actions</div>
        </div>

        <div
            v-for="study in studies"
            :key="study.id"
            class="study-table border-sano-pink border divide-y divide-gray-400 data-row flex flex-col sm:flex-row sm:justify-between p-3"
        >
            <!-- Status -->
            <div class="flex sm:w-1/4 justify-between sm:flex-col sm:px-4 sm:border-r sm:border-l sm:border-sano-red-orange">
                <span class="uppercase text-sano-red-orange">{{ study.enrollment ? "Enrolled" : "Not Enrolled" }}</span>
                <span
                    v-if="study.enrollment"
                    class="px-3 text-white uppercase rounded-full text-center"
                    :class="[study.enrollment.completed ? 'bg-sano-green' : 'bg-sano-blue']"
                    >{{ study.enrollment.completed ? "Completed" : "In Progress" }}</span
                >
            </div>
            <!-- Study Details -->
            <div class="my-3 sm:my-0 flex flex-col sm:order-first sm:w-2/4 max-w-sm">
                <h3 class="font-semibold text-xl">{{ study.title }}</h3>
                <p>Run by Sano Genetics</p>
            </div>

            <!-- Action Buttons -->
            <div class="sm:p-2 sm:w-1/4">
                <button v-if="study.enrollment" @click="leaveStudy(study)" class="sano-btn w-full bg-sano-pink border-sano-pink">
                    Leave study
                </button>
                <button v-else @click="joinStudy(study)" class="sano-btn w-full bg-sano-red-orange border-sano-red-orange text-white">
                    Join study
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Studies from "@/models/Studies";
import Enrollments from "@/models/Enrollments";
import Api from "@/api/export";

export default {
    computed: {
        studies() {
            return Studies.query().with("enrollment").get();
        },
    },
    async created() {
        this.$store.dispatch("loadInitialData");
    },
    methods: {
        async joinStudy(study) {
            const response = await Api.user.post_enrollment(study.id);
            const enrollment = response.data;
            Enrollments.insert({ data: enrollment });
        },
        async leaveStudy(study) {
            const response = await Api.user.delete_enrollment(study.id);
            Enrollments.delete(study.enrollment.id);
        },
    },
};
</script>

<style scoped>
.study-table:nth-child(n + 2) {
    margin-bottom: -1px;
}
</style>
