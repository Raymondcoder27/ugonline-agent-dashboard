<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch } from "vue";
import { useBilling } from "@/domain/submissions/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type { Transaction, FloatLedger, FloatRequest, FloatManagement } from "./types"; // Import billing types
import moment from "moment/moment";

const store = useBilling(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Billing-specific filter
const filter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN"
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN"
    },
  ],
  fromDate: "", // Add fromDate
  toDate: "" // Add toDate
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchTransactions();
});

function fetchTransactions() {
  filter.limit = limit.value;
  filter.page = page.value;

  // Add date filter if both dates are provided
  if (filter.fromDate && filter.toDate) {
    filter.filter.push({
      field: "date",
      operator: "BETWEEN",
      operand: [filter.fromDate, filter.toDate]
    });
  }

  store.fetchTransactions(filter); // Fetch transactions based on filter
}

function next() {
  page.value += 1;
  fetchTransactions();
}

function previous() {
  page.value -= 1;
  fetchTransactions();
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Debounced filter update function
const updateFilter = useDebounceFn(() => {
  fetchTransactions();
}, 300, { maxWait: 5000 });

// Watch for changes in the modal state
watch(() => modalOpen.value, (isOpen) => {
  if (!isOpen) {
    // Handle modal close if needed
  }
});

// Watch for changes in the filter object
watch(() => filter, () => updateFilter(), { deep: true });
</script>


<template>
  <div class="">

    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white p-2">
      <!-- <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
        <div>
          <label for="date-range" class="mr-2 text-sm text-gray-600 justify-end">Date Range:</label>
          <input
            type="date"
            id="date-range"
            class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> -->
      <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
  <div class="flex space-x-4">
    <div>
      <label for="date-from" class="mr-2 text-sm text-gray-600">From:</label>
      <input
        type="date"
        id="date-from"
        class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="filter.fromDate"
      />
    </div>
    <div>
      <label for="date-to" class="mr-2 text-sm text-gray-600">To:</label>
      <input
        type="date"
        id="date-to"
        class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="filter.toDate"
      />
    </div>
  </div>
</div>


      <!-- Table -->
     <!-- Table -->
     <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <th class="t-header">#</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right t-header">Balance</th>
              <th class="t-header">Date</th>
            </tr>
          </thead>
          <thead v-if="loading">
            <tr>
              <th colspan="12" style="padding: 0">
                <div class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, idx) in store.transactions" :key="transaction.id" class="body-tr">
              <td class="text-left">{{ idx + 1 }}</td>
             
              <td class="text-left">
                <label class="cursor-pointer font-bold hover:text-primary-700 mx-2">
                  <span class="hover:underline">{{ transaction.description }}</span>
                </label>
              </td>
              <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td>
              <td class="text-left text-gray-800">
                <span>{{ transaction.balance }}</span>
              </td>
              <td class="text-left">
                <span class="text-xs">{{ convertDateTime(transaction.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="text-left font-bold text-gray-600">Totals:</td>
              <td class="text-left font-bold text-gray-800">{{ store.totalAmount }}</td>
              <td class="text-left font-bold text-gray-800">{{ store.totalBalance }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
