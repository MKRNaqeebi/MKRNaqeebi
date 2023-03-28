<template>
    <header class="text-gray-600 body-font my-header">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="../assets/logo.svg" />
        </a>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectAllOpenIssues"
            v-bind:class="this.selectAllissues == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
          >
            Open All Issues
          </button>
        </nav>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectIssuesByRepo"
            v-bind:class="this.selectRepoissue == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
          >
            Issues By Repo
          </button>
        </nav>
        <nav class="md:ml-11 flex flex-wrap items-center text-base justify-center">
          <button
            @click="selectIssueReport"
            v-bind:class="this.selectReportissue == false ? 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none text-base mt-4 md:mt-0' : 'button inline-flex items-center border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 btn-select'"
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
        selectAllissues: true,
        selectRepoissue: false,
        selectReportissue: false,
      };
    },
    methods: {
      selectAllOpenIssues() {
        this.selectAllissues = true;
        this.selectRepoissue = false;
        this.selectReportissue = false;
      },
      selectIssuesByRepo() {
        this.selectRepoissue = true;
        this.selectAllissues = false;
        this.selectReportissue = false;
      },
      selectIssueReport() {
        this.selectReportissue = true;
        this.selectAllissues = false;
        this.selectRepoissue = false;
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