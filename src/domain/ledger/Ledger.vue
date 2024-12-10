<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useBilling } from "@/domain/ledger/stores";
import { useDebounceFn } from "@vueuse/core";
import type { FloatLedger } from "./types";
import moment from "moment/moment";
import RequestFloat from "@/domain/ledger/components/RequestFloat.vue";
import { useBalance } from "@/domain/balance/stores";

const balanceStore = useBalance();
const store = useBilling();

const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Filter object with defaults
const filter = reactive({
  limit: 15,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC",
    },
  ],
  filter: [],
  fromDate: "",
  toDate: "",
});

// Description for filtering
const description = ref("");

/** Fetch transactions with updated filters */
async function fetchFloatLedgers() {
  // Remove old filters
  filter.filter = filter.filter.filter(
    (f) => f.field !== "description" && f.field !== "date"
  );

  // Add description filter if provided
  if (description.value) {
    filter.filter.push({
      field: "description",
      operand: description.value,
      operator: "EQUALS",
    });
  }

  // Add date range filter if both dates are specified
  if (filter.fromDate && filter.toDate) {
    filter.filter.push({
      field: "date",
      operator: "BETWEEN",
      operand: [filter.fromDate, filter.toDate],
    });
  }

  console.log("Fetching Float Ledgers with filter:", filter);

  // Fetch data from the store
  const response = await store.fetchTransactions(filter);
  console.log("Fetched transactions:", response);
}

/** Handle navigation for pagination */
function next() {
  page.value += 1;
  fetchFloatLedgers();
}

function previous() {
  page.value = Math.max(1, page.value - 1);
  fetchFloatLedgers();
}

/** Convert date to readable format */
function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Debounced filter update function
const updateFilter = useDebounceFn(() => {
  console.log("Filter updated, fetching transactions...");
  fetchFloatLedgers();
}, 300);

// Watchers to update filters dynamically
watch(
  () => [description.value, filter.fromDate, filter.toDate],
  () => {
    updateFilter();
  },
  { deep: true }
);

// Compute transactions with running balance
const computedTransactions = computed(() => {
  let runningBalance = balanceStore.totalBalance.current || 0;
  return store.floatLedgers.map((transaction: FloatLedger) => {
    runningBalance += transaction.amount;
    return { ...transaction, balance: runningBalance };
  });
});

// Fetch data on mount
onMounted(() => {
  fetchFloatLedgers();
});
</script>

<template>
  <div>
    <!-- Header with filters -->
    <div class="max-w-7xl mx-auto bg-white p-2">
      <div class="flex space-x-2 my-1 pt-1 pb-3">
        <div class="flex-grow">
          <div class="flex justify-between bg-gray-10 border border-gray-200 rounded px-2 py-3">
            <div class="flex">
              <!-- Description Filter -->
              <select
                v-model="description"
                class="filter-element e-input"
                @change="fetchFloatLedgers"
              >
                <option value="">All Transactions</option>
                <option value="recharge">Recharge</option>
                <option value="service_fee">Service Fee</option>
              </select>

              <!-- Date Range Filters -->
              <div class="flex">
                <div class="flex items-center mr-2">
                  <label for="date-from" class="mr-2 text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    id="date-from"
                    class="border rounded-md px-3 py-2 text-sm text-gray-700"
                    v-model="filter.fromDate"
                  />
                </div>
                <div class="flex items-center mr-2">
                  <label for="date-to" class="mr-2 text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    id="date-to"
                    class="border rounded-md px-3 py-2 text-sm text-gray-700"
                    v-model="filter.toDate"
                  />
                </div>
              </div>
            </div>

            <!-- Request Float Button -->
            <div>
              <button @click="modalOpen = true" class="button btn-sm" type="button">
                <i class="px-1 fa-solid fa-plus"></i> Request Float
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <th class="t-header">Date</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right t-header">Status</th>
              <th class="text-right t-header">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in computedTransactions"
              :key="transaction.id"
              class="body-tr"
            >
              <td>{{ convertDateTime(transaction.createdAt) }}</td>
              <td>{{ transaction.description }}</td>
              <td class="text-right">{{ transaction.amount.toLocaleString() }}</td>
              <td class="text-right">
                <span
                  :class="{
                    'text-green-600 bg-green-100': transaction.status === 'success',
                    'text-gray-600 bg-gray-100': transaction.status === 'pending',
                    'text-red-600 bg-red-100': transaction.status === 'failed',
                  }"
                  class="text-xs rounded-md p-1 font-semibold"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="text-right">{{ transaction.balance.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Float Request -->
    <AppModal v-model="modalOpen" xl2>
      <RequestFloat @floatAllocated="modalOpen = false" :close="() => (modalOpen = false)" />
    </AppModal>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
