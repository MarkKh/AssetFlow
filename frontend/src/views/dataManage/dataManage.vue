<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" md="12">
        <UiParentCard>
          <div class="flex mb-4">
            <h2 class="flex-grow">Item Category Management</h2>
            <div class="search-container">
              <input type="text" v-model="ICsearchQuery" placeholder="Search..." class="search-input" />
              <i class="mdi mdi-magnify search-icon"></i>
            </div>
            <ModalAddIC @click="addIC" @addIC="handleAddIC" />
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th v-for="(header, index) in itemCategoryHeaders" :key="index" class="header-cell">
                    <span>{{ header.label }}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in ICpaginatedData" :key="index">
                  <td>{{ ICcurrentIndex + index + 1 }}</td>
                  <td v-for="(header, index) in itemCategoryHeaders" :key="index">
                    <template v-if="header.field == 'isReferenced'">
                      <div v-if="item.isReferenced">
                        <v-chip size="small" text="Active" color="success" variant="tonal" class="mr-2" />
                      </div>
                      <div v-else>
                        <v-chip size="small" text="InActive" color="warning" variant="tonal" class="mr-2" />
                      </div>
                    </template>
                    <template v-else>
                      {{ item[header.field] }}
                    </template>
                  </td>
                  <td>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <ModalUpdateIC
                          @click="updateIC"
                          @updateIC="handleUpdateIC"
                          :item_cat_id="item.item_cat_id"
                          :item_cat_name="item.item_cat_name"
                        />
                      </template> </v-tooltip
                    >&nbsp

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          v-bind="props"
                          size="small"
                          :disabled="item.isReferenced"
                          @click="deleteIC(item.item_cat_id, item.item_cat_name)"
                        >
                          <v-icon color="grey-lighten-1"> mdi-trash-can-outline </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <v-container class="max-width"
            ><v-row justify="end">
              <v-pagination :length="ICtotalPages" :total-visible="3" v-model="ICcurrentPage" :size="20"></v-pagination> </v-row
          ></v-container>
        </UiParentCard>

        <UiParentCard class="mt-6">
          <div class="flex mb-4">
            <h2 class="flex-grow">Unit Management</h2>
          </div>
        </UiParentCard>

        <UiParentCard class="mt-6">
          <div class="flex mb-4">
            <h2 class="flex-grow">Transaction Category Management</h2>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref, reactive, computed, defineEmits, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getAllItemCategory, deleteItemCategory } from '@/service/dataManage';
import ModalAddIC from './_modalAddItemCategory.vue';
import ModalUpdateIC from './_modalEditItemCategory.vue';

const page = ref({ title: 'Data Management' });

const breadcrumbs = ref([
  { title: 'Management', disabled: true, href: '#' },
  { title: 'Data Management', disabled: false, href: '#' }
]);

//------------------Item Category --------------------
interface IDataItemCategory {
  item_cat_id: number;
  item_cat_name: string;
  isReferenced: boolean;
}

const dataGridItemCategory = reactive({
  dataList: [] as IDataItemCategory[]
});

const itemCategoryHeaders = reactive([
  { label: 'Item Category ID', value: 'item_cat_id', field: 'item_cat_id' },
  { label: 'Item Category Name', value: 'item_cat_name', field: 'item_cat_name' },
  { label: 'Active', value: 'isReferenced', field: 'isReferenced' }
]);

const dataItemCategory = async () => {
  const res = await getAllItemCategory();
  dataGridItemCategory.dataList = res.data;
};

const ICcurrentPage = ref(1);
const ICperPage = ref(5);
const ICsearchQuery = ref('');

const ICfilteredData = computed(() => {
  return dataGridItemCategory.dataList.filter((item) => {
    return item.item_cat_name.toLowerCase().includes(ICsearchQuery.value.toLowerCase());
  });
});

const ICpaginatedData = computed(() => {
  const start = (ICcurrentPage.value - 1) * ICperPage.value;
  const end = Math.min(start + ICperPage.value, ICfilteredData.value.length);
  return ICfilteredData.value.slice(start, end);
});

const ICtotalPages = computed(() => {
  return Math.ceil(ICfilteredData.value.length / ICperPage.value);
});

const ICcurrentIndex = computed(() => {
  return (ICcurrentPage.value - 1) * ICperPage.value;
});

const modalAddIC = ref(false);
const modalUpdate = ref(false);

const addIC = () => {
  modalAddIC.value = true;
};

const updateIC = () => {
  modalUpdate.value = true;
};

const handleAddIC = () => {
  dataItemCategory();
};

const handleUpdateIC = () => {
  dataItemCategory();
};

const deleteIC = async (id: number, name: string) => {
  const item_id = id;
  try {
    const confirmResult = await Swal.fire({
      title: 'Are you sure to delete?',
      text: `${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (confirmResult.isConfirmed) {
      await deleteItemCategory(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your item category has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        dataItemCategory();
      });
    }
  } catch (error) {
    console.error('Error while deleting item category:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while deleting the item category.'
    });
  }
};
//------------------Item Category --------------------

onMounted(() => {
  dataItemCategory();
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
