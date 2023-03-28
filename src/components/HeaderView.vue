<template>
    <header class="text-gray-600 body-font my-header">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="../assets/logo.svg" />
        </a>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectAllOpenIssues"
            v-bind:class="this.select1 == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
          >
            Open All Issues
          </button>
        </nav>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectIssuesByRepo"
            v-bind:class="this.select2 == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
          >
            Issues By Repo
          </button>
        </nav>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectIssueReport"
            v-bind:class="this.select3 == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
          >
            Issue Report
          </button>
        </nav>
      </div>
    </header>
  </template>
  <script>
  export default {
    data() {
      return {
        select1: true,
        select2: false,
        select3: false,
      };
    },
    methods: {
      selectAllOpenIssues() {
        this.select1 = true;
        this.select2 = false;
        this.select3 = false;
        console.log("select", this.select1);
      },
      selectIssuesByRepo() {
        this.select2 = true;
        this.select1 = false;
        this.select3 = false;
        console.log("select", this.select2);
      },
      selectIssueReport() {
        this.select3 = true;
        this.select1 = false;
        this.select2 = false;
        console.log("select", this.select3);
      },
    },
  };
  </script>
  <style>
  * {
    font-family: "Montserrat";
  }
  .my-header {
    background-color: #495175;
  }
  button {
    color: white;
  }
  .btn-select {
    color: black;
    background-color: #F7B696;
    border-radius: 20px;
  }
  </style>