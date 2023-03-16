<template >
    <div class="bg_color py-5">
        <div class="container mx-auto p-5 bg_color w-5/6">
            <div class="flex my-5">
                <div class="flex-1 w-64">
                    <p class="text-xl">Developer Info</p>
                </div>
                <div class="flex-1 w-96">
                    <div class="flex">
                        <div class="flex-1 w-0 my-3">
                            <img class="icon" src="../assets/SwitchCalendarIcon.svg" />
                        </div>
                        <div class="flex-1 w-8 my-3">Switch your calender view</div>
                        <div class="flex-1 w-6 ml-1">

                            <div class="aselect" :data-value="value" :data-list="list">
                                <div class="selector" @click="toggle()">
                                    <div class="label">
                                        <p class="text-lg">{{ value }}</p>
                                    </div>
                                    <div class="arrow" :class="{ expanded: visible }"></div>
                                    <div :class="{ hidden: !visible, visible }">
                                        <ul class="ulStyle">
                                            <li class="liStyle" :class="{ current: item === value }" v-for="item in list"
                                                @click="select(item)"><b>{{ item }}</b></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-16">
                <div v-for="data, index in assigneesData">
                    <div class="container mr-5 p-3">
                        <div class="mb-3">{{ data.assignee }}</div>
                        <div class="bg-white rounded-2xl drop-shadow-lg">
                            <div
                                v-bind:class="index % 2 == 0 ? 'grid grid-cols-2 gap-0 left_border1 rounded-2xl' : 'grid grid-cols-2 gap-0 left_border2 rounded-2xl'">
                                <div class="pt-3 text-center">Open Task</div>
                                <div class="num_style_open_task">{{ data.openTask }}</div>
                                <div class="pt-3 text-center">Close Task</div>
                                <div class="num_style_close_task">{{ data.closeTask }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="conatiner bg-white drop-shadow-lg my-5 rounded-2xl">
                <div class=" m-3 py-3">
                    <div class="section2 ml--5">
                        <div class="img_repo"><img src="../assets/RepositriesIcon.svg" alt=""></div>
                        <div class="text_align">Respositries</div>
                        <div class="aselect " :data-value="valueRepo" :data-list="repositries">
                            <div class="selector" @click="toggleRepo()">
                                <div class="label">
                                    <h4 class="text-lg">{{ valueRepo }}</h4>
                                </div>
                                <div class="arrow" :class="{ expanded: visibleRepo }"></div>
                                <div :class="{ hidden: !visibleRepo, visibleRepo }">
                                    <ul class="ulStyle">
                                        <li class="liStyle" :class="{current: item === valueRepo }" v-for="item in repositries"
                                            @click="selectRepo(item)"><b>{{ item }}</b></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <button class="buttonChart items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0">Previous</button>
                        <button class="buttonChart items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0">Next</button>
                    </div>
                    <div>
                        <GanttChart />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import GanttChart from "../components/GanttChart.vue";
export default {
    name: "DeveloperInfo",
    components: {GanttChart},
    data() {
        
        return {
            assigneesData: [
                { assignee: "aishatasaduq", openTask: '04', closeTask: '06' },
                { assignee: "AliHanifdev1", openTask: '04', closeTask: '06' },
                { assignee: "ammarhaider001", openTask: '04', closeTask: '06' },
                { assignee: "hamza-coaldev", openTask: '04', closeTask: '06' },
                { assignee: "LaiqaRafiq", openTask: '04', closeTask: '06' },
                { assignee: "NajamBilalDev", openTask: '04', closeTask: '06' },
                { assignee: "noumandev11", openTask: '04', closeTask: '06' },
                { assignee: "RehmanCoaldev", openTask: '04', closeTask: '06' },
            ],
            repositries: ["Select Repository", "ABC", "Coaldev Invoice", "Coaldev Website", "XYZ"],

            value: 'Select',
            list: ["Select", "Monthly", "Weekly"],
            visible: false,
            valueRepo: 'Select Repository',
            visibleRepo: false,
        }
    },
    methods: {
        toggle() {
            this.visible = !this.visible;
        },
        select(option) {
            this.value = option;
        },

        toggleRepo() {
            this.visibleRepo = !this.visibleRepo;
        },
        selectRepo(option) {
            this.valueRepo = option;
        }
    },

}
</script>
<style>
* {
    font-family: "Montserrat";
}

.bg_color {
    background-color: #EFEDE9;
}

.num_style_open_task {
    font-size: 3rem;
    color: #495175;
    text-align: center;
}

.num_style_close_task {
    font-size: 3rem;
    color: #F7B696;
    text-align: center;
}

.left_border1 {
    border-left: 10px solid #F7B696;
}

.left_border2 {
    border-left: 10px solid #495175;
}

.icon {
    margin-left: 81%;
}

.img_repo {
    text-align: center;
    margin: 12px 17px;
}

.text_align {
    text-align: center;
    margin: 12px 0px;
}


.aselect {
    margin-left: 20px;
    width: 13rem;
    text-align: left;
    margin-right: 45%;
}

.selector {
    border: 1px solid #F7B696;
    background: #F7B696;
    position: relative;
    z-index: 1;
    border-radius: 8px;
}

.arrow {
    position: absolute;
    right: 10px;
    top: 40%;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 10px solid #495175;
    ;
    transform: rotateZ(0deg) translateY(0px);
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(.59, 1.39, .37, 1.01);
}

.expanded {
    transform: rotateZ(180deg) translateY(2px);
}

.label {
    display: block;
    padding: 10px;
    font-size: 16px;
    color: black;
}

.ulStyle {
    width: 100%;
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 16px;
    border: 1px solid gainsboro;
    position: absolute;
    z-index: 1;
    background: #F7B696;
    border-radius: 8px;

}

.liStyle {
    padding: 12px;
    color: #495175;
    background: #F7B696;
    border-radius: 8px;
}

.liStyle:hover {
    color: black;
    background: #f3d2c2;
}

.current {
    background: #f3d2c2;
}

.hidden {
    visibility: hidden;
}

.visible {
    visibility: visible;
}

.section2 {
    display: flex;
}
.buttonChart{
    background-color: #F7B696;
    border-radius: 6px;
    width: 9%;
    margin: 0px 6px;
    /* margin:  */
}
</style>