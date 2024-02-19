v-container
<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" md="12">
        <UiParentCard>
          <div class="flex mb-4">
            <h2 class="flex-grow">Inventory items</h2>
            <div class="search-container">
              <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <ModalAddInventory @click="addInventory()" @addItem="handleAddItem" />
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="(header, index) in headers" :key="index" class="header-cell">
                    <span>{{ header.label }}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Display data based on the current page -->
                <tr v-for="(item, index) in paginatedData" :key="index">
                  <td v-for="(header, index) in headers" :key="index">
                    <template v-if="header.field === 'status'">
                      <div v-if="item.status == false">
                        <!-- <v-badge color="error" content="Not in stock" inline></v-badge> -->
                        <v-chip size="small" text="Out of stock" color="error" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <!-- <v-badge color="success" content="In stock" inline></v-badge> -->
                        <v-chip size="small" text="In stock" color="success" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <td>
                    <!-- Add buttons or components for editing data -->
                    <div class="flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn icon v-bind="props" size="small" @click="checkClick(item.item_id)" :disabled="!item.status">
                            <v-icon color="grey-lighten-1"> mdi-book-arrow-down-outline </v-icon>
                          </v-btn>
                        </template>
                        <span>Withdraw/Borrow</span> </v-tooltip
                      >&nbsp

                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn icon v-bind="props" size="small">
                            <v-icon color="grey-lighten-1"> mdi-pencil </v-icon>
                          </v-btn>
                        </template>
                        <span>Edit</span> </v-tooltip
                      >&nbsp

                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn icon v-bind="props" size="small" :disabled="item.item_total != item.item_remain">
                            <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                          </v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Add Pagination section -->
          <v-container class="max-width"
            ><v-row justify="end">
              <v-pagination :length="totalPages" :total-visible="3" v-model="currentPage" :size="20"></v-pagination> </v-row
          ></v-container>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect, defineEmits } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getAllInventory } from '@/service/inventory';
import ModalAddInventory from './_modalAddInventory.vue';

const modalAddInventory = ref(false);

const addInventory = () => {
  modalAddInventory.value = true;
};

interface IData {
  item_id: number;
  item_name: string;
  item_cat: number;
  item_cat_name: string;
  item_unit: number;
  unit_name: string;
  item_total: number;
  item_remain: number;
  status: boolean; // เพิ่ม field สำหรับสถานะ
}

const dataGridInventory = reactive({
  dataList: [] as IData[]
});

const page = ref({ title: 'Inventory' });

const breadcrumbs = ref([
  { title: 'Management', disabled: true, href: '#' },
  { title: 'Inventory', disabled: false, href: '#' }
]);

const headers = reactive([
  { label: 'Name', value: 'item_id', field: 'item_name', sortable: true },
  { label: 'Product type', value: 'item_cat_id', field: 'item_cat_name', sortable: true },
  { label: 'Unit', value: 'unit_id', field: 'unit_name', sortable: true },
  { label: 'All Stock', value: 'item_total', field: 'item_total', sortable: true },
  { label: 'Remain Stock', value: 'item_remain', field: 'item_remain', sortable: true },
  { label: 'Status', field: 'status', sortable: true }
]);

const dataInventory = async () => {
  const res = await getAllInventory();
  dataGridInventory.dataList = res.data;
};

const handleAddItem = () => {
  dataInventory();
};

const checkClick = (id: number) => {
  alert(id);
};

dataInventory();

let sortedData = ref<IData[]>([]);
let sortOrders = ref({});
const currentPage = ref(1);
const perPage = ref(10);
const searchQuery = ref('');

const filteredData = computed(() => {
  return dataGridInventory.dataList.filter((item) => {
    return item.item_name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = Math.min(start + perPage.value, filteredData.value.length);
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / perPage.value);
});

const isNextDisabled = computed(() => {
  return currentPage.value === Math.ceil(filteredData.value.length / perPage.value);
});

const editItem = (id: number) => {
  alert('Success');
};

watchEffect(() => {
  currentPage.value = 1;
});
</script>
<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #ebe6f6;
  border-right: 1px solid #ddd;
}

th:last-child {
  border-right: none;
}

th:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

tr:hover {
  background-color: #f2eff9;
}

.header-cell {
  justify-content: space-between;
  align-items: center;
}

.sort-icon {
  margin-top: 6px;
}

.flex {
  display: flex;
  align-items: center;
}

.flex-grow {
  flex-grow: 1;
}

.pagination-container {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.pagination-container > * {
  margin-left: 5px;
  font-size: 14px;
}

.search-container {
  position: relative;
  width: 200px;
  margin-right: 5px;
}

.search-input {
  width: 100%;
  padding: 10px 30px;
  border-radius: 10px;
  border: 1px solid #ebe6f6;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #999;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
  font-size: 20px;
}
</style>
