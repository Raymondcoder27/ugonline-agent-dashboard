import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export interface TotalBalance {
  prev: number;
  current: number;
}

export const useBalance = defineStore("balance", () => {
  // Initial dummy data for total balance
  // const dummyTotalBalance = {
  //   prev: 0,
  //   current: 300000000, // Initial dummy balance
  // };

  const dummyTotalBalance = reactive({
    prev: 300000000,
    current: 300000000, // Initial dummy balance
  });

  

  // Reactive totalBalance state
  const totalBalance = ref<TotalBalance>({ ...dummyTotalBalance });

  // Fetch the total balance (dummy data for now)
  async function fetchTotalBalance() {
    // Simulate API call
    totalBalance.value = { ...dummyTotalBalance };
  }

  // Increase the total balance and update the "prev" value
  async function increaseTotalBalance(amount: number) {
    totalBalance.value = {
      prev: totalBalance.value.current,
      current: totalBalance.value.current + amount,
    };
  }

  // Increase balance
// async function increaseTotalBalance(amount: number) {
//   totalBalance.value.prev = totalBalance.value.current;
//   totalBalance.value.current += amount; // Mutating individual properties
// }


  // Decrease the total balance and update the "prev" value
  // async function decreaseTotalBalance(amount: number) {
  //   totalBalance.value = {
  //     prev: totalBalance.value.current,
  //     current: totalBalance.value.current - amount,
  //   };
  // }

  async function decreaseTotalBalance(amount: number) {
    console.log("Previous:", totalBalance.value.prev, "Current:", totalBalance.value.current);
    totalBalance.value = {
      prev: totalBalance.value.current,
      current: totalBalance.value.current - amount,
    };
    console.log("Updated:", totalBalance.value);
  }

  dummyTotalBalance.current = totalBalance.value.current;

  totalBalance.value = { ...dummyTotalBalance };

  // Decrease balance
// async function decreaseTotalBalance(amount: number) {
//   totalBalance.value.prev = totalBalance.value.current;
//   totalBalance.value.current -= amount; // Mutating individual properties
// }
  

  return {
    totalBalance,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance,
  };
});
