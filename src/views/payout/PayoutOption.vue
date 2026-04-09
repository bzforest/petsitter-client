<template>
  <div class="space-y-8">
    <h1 class="headline-3 font-bold text-brand-gray-900">Payout Option</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Total Earning -->
      <div class="flex items-center justify-between bg-brand-white p-6 rounded-2xl shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-brand-gray-50">
            <CircleDollarSign class="w-6 h-6 text-brand-gray-500" />
          </div>
          <span class="body-1 font-medium text-brand-gray-900">Total Earning</span>
        </div>
        <span class="headline-4 font-bold text-brand-gray-900">{{ totalEarning }}</span>
      </div>

      <!-- Bank Account -->
      <div class="flex items-center justify-between bg-brand-white p-6 rounded-2xl shadow-sm cursor-pointer hover:bg-brand-gray-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-brand-gray-50">
            <CreditCard class="w-6 h-6 text-brand-gray-500" />
          </div>
          <span class="body-1 font-medium text-brand-gray-900">Bank Account</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="body-1 font-medium text-brand-orange-700">SCB *444</span>
          <ChevronRight class="w-6 h-6 text-brand-gray-300" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-brand-white rounded-2xl shadow-sm p-12 flex justify-center">
      <span class="body-2 text-brand-gray-400">Loading transactions...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-brand-white rounded-2xl shadow-sm p-6">
      <span class="body-2 text-red-500">{{ errorMsg }}</span>
    </div>

    <!-- Transaction Table -->
    <div v-else class="bg-brand-white rounded-2xl shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-brand-black text-brand-white">
            <th class="px-6 py-4 body-3 font-medium cursor-default first:rounded-tl-2xl">Date</th>
            <th class="px-6 py-4 body-3 font-medium cursor-default">From</th>
            <th class="px-6 py-4 body-3 font-medium cursor-default">Transaction No.</th>
            <th class="px-6 py-4 body-3 font-medium cursor-default text-right last:rounded-tr-2xl">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-gray-100">
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="hover:bg-brand-gray-50 transition-colors"
          >
            <td class="px-6 py-6 body-3 text-brand-gray-900">{{ tx.date }}</td>
            <td class="px-6 py-6 body-3 text-brand-gray-900">{{ tx.fromName }}</td>
            <td class="px-6 py-6 body-3 text-brand-gray-900">{{ tx.id }}</td>
            <td class="px-6 py-6 body-3 font-bold text-brand-green-500 text-right">
              {{ formatAmount(tx.amount) }}
            </td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="4" class="px-6 py-12 text-center body-2 text-brand-gray-400">
              No transactions found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CircleDollarSign, CreditCard, ChevronRight } from 'lucide-vue-next';
import { getMyPayouts, type PayoutTransaction } from '@/services/payout.service';

const transactions = ref<PayoutTransaction[]>([]);
const isLoading = ref(false);
const errorMsg = ref('');

// คำนวณ Total Earning จาก amount ทั้งหมด
const totalEarning = computed(() => {
  const sum = transactions.value.reduce((acc, tx) => {
    return acc + (tx.amount ?? 0);
  }, 0);

  return sum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' THB';
});

// Format amount สำหรับแสดงใน table
const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null) return '0.00 THB';
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' THB';
};

// ดึงข้อมูลจาก API เมื่อ component โหลด
onMounted(async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    transactions.value = await getMyPayouts();
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.message ?? 'Failed to load payout data';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Any specific card or table tweaks can go here if utility classes aren't enough */
thead th {
  letter-spacing: 0.025em;
}
</style>
