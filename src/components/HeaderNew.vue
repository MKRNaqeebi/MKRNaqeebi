<template>
     <header class="text-gray-600 body-font MyHeader">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <img src="../assets/logo.svg"/>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-purple-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg> -->
      <!-- <span class="ml-3 text-xl">Coaldev</span> -->
    </a>
    <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
        <button @click="selectAllOpenIssues" v-bind:class="this.select1==false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0': 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btnSelect'">Open All Issues
        </button>
    </nav>
    <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
        <button @click="selectIssuesByRepo" v-bind:class="this.select2==false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0': 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btnSelect'">Issues By Repo</button>
    </nav>
    <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
        <button @click="selectIssueReport" v-bind:class="this.select3==false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0': 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btnSelect'">Issue Report</button>
    </nav>
  </div>
</header>
   
</template>
<script>
export default {
    data(){
        return {
            select1: true,
            select2: false,
            select3: false,
        }
    },
methods:{
    selectAllOpenIssues(){
        this.select1 = true;
        this.select2 = false;
        this.select3 = false;
        console.log("select", this.select1);
    },
    selectIssuesByRepo(){
        this.select2 = true;
        this.select1 = false;
        this.select3 = false;
        console.log("select", this.select2);
    },
    selectIssueReport(){
        this.select3 = true;
        this.select1 = false;
        this.select2 = false;
        console.log("select", this.select3);
    }
}
}
</script>
<style>
*{
    font-family: "Montserrat";
}
.MyHeader{
    background-color: #495175;
}
button{
    color: white;
}
/* button:focus{
    color: black;
    background-color: #F7B696;
    border-radius: 20px;
} */
/* button:hover{
    color: black;
    background-color: #F7B696;
    border-radius: 20px;
} */
.btnSelect{
    color: black;
    background-color: #F7B696;
    border-radius: 20px;
}

</style>
