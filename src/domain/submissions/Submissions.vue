<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch } from "vue";
import { useSubmissions } from "@/domain/submissions/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import TransactionDetails from "@/domain/submissions/components/TransactionDetails.vue";

// import type {
//   Submission,
//   FloatLedger,
//   FloatRequest,
//   FloatManagement,
// } from "./types"; 
// Import billing types
import moment from "moment/moment";

const store = useSubmissions(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

const transactionDetailsModalOpen: Ref<boolean> = ref(false);

function transactionDetails(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  transactionDetailsModalOpen.value = true;
}

// Billing-specific filter
const filter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN",
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN",
    },
  ],
  fromDate: "", // Add fromDate
  toDate: "", // Add toDate
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchSubmissions();
});

function fetchSubmissions() {
  filter.limit = limit.value;
  filter.page = page.value;

  // Add date filter if both dates are provided
  if (filter.fromDate && filter.toDate) {
    filter.filter.push({
      field: "date",
      operator: "BETWEEN",
      operand: [filter.fromDate, filter.toDate],
    });
  }

  store.fetchSubmissions(filter); // Fetch transactions based on filter
}

// Function to handle submission draft
function submissionDraft(name: string) {
  // Logic to check if submission is a draft
  return name === "DRAFT";
}

// Function to handle submission repay
function submissionRepay(name: string) {
  // Logic to check if submission is a repay
  return name === "REPAY";
}

function next() {
  page.value += 1;
  fetchSubmissions();
}

function previous() {
  page.value -= 1;
  fetchSubmissions();
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
const updateFilter = useDebounceFn(
  () => {
    fetchSubmissions();
  },
  300,
  { maxWait: 5000 }
);

// Date conversion utility
const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
  }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
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
          <div class="block">
            <label for="date-from" class="mr-2 text-sm text-gray-600"
              >From:</label
            >
            <input
              type="date"
              id="date-from"
              class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="filter.fromDate"
            />
          </div>
          <div class="block">
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
        <table class="table tr">
          <thead>
            <tr class="text-left">
              <!-- <th>#</th> -->
              <th>Tracking Number</th>
              <th>Service</th>
              <th>Provider</th>
              <!-- <th>Till</th> -->
              <!-- <th>Transaction Type</th> -->
              <!-- <th>Fee</th> -->
              <!-- <th>Status</th> -->
              <th>Date</th>
             <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="text-left"
              v-for="(transaction, idx) in store.submissions"
              :key="idx"
              :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
            >
              <!-- <td>{{ idx + 1 }}</td> -->
              <td
                class="rounded-md font-semibold text-red-700 hover:underline"
                @click="transactionDetails(transaction.id)"
              >
                {{ transaction.trackingNumber }}
              </td>
              <td>{{ transaction.service }}</td>
              <td class="text-left">{{ transaction.provider }}</td>
              <!-- <td>{{ transaction.till }}</td> -->
              <!-- <td class="text-left">{{ transaction.transactionType }}</td> -->
              <!-- <td class="text-left">{{ transaction.fee }}</td> -->
              <!-- <td class="text-left">{{ transaction.status }}</td> -->
              <td class="text-left">{{ convertDate(transaction.date) }}</td>
              <!-- <td class="text-left"> -->
                <!-- <td class="text-black-700 text-center">
              <div v-if="getManagerByBranch(branch.name)">
                <label>
                  {{ getManagerByBranch(branch.name).firstName }}
                  {{ getManagerByBranch(branch.name).lastName }}
                </label>
              </div>

              <div v-else-if="branch.manager">
                <label>
                  {{ branch.manager.firstName }} {{ branch.manager.lastName }}
                </label>
              </div>

              <div v-else>
                <button
                  class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                  @click="allocateManager(branch)"
                >
                  Assign Manager
                </button>
              </div>
            </td> -->
              <!-- actions -->
               <!-- use the same v-if, v-else-if and v-else to make scenarios for draft, repay, or confirmed -->
              <td class="text-left">
                <div class="" v-if="submissionDraft(transaction.name)">
                  <button
                    class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                    @click="submitDraft(transaction)"
                  >
                    Draft
                  </button>
                </div>
                <div class="" v-else-if="submissionRepay(transaction.name)">
                  <button
                    class="bg-green-200 rounded-md font-semibold text-green-700 p-1 hover:underline"
                    @click="repay(transaction)"
                  >
                    Repay
                  </button>
                </div>
                <div class="" v-else>
                  <span
                    class="bg-blue-200 rounded-md font-semibold text-blue-700 p-1"
                    @click="confirm(transaction)"
                  >
                    Confirmed
                  </span>
                </div>
              </td>


              <!-- </td> -->

              <!-- <td class="text-left">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(transaction)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(transaction)"
              ></i>
              <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(transaction)"
              ></i>
            </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
    </AppModal>

    <!-- Tracking Number Modal to show transaction details -->
    <AppModal v-model="transactionDetailsModalOpen" xl2>
      <TransactionDetails @transactionViewed="close" @cancel="close" />
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
