<template>
  <div class="Main">
    <!-- How many to show per page -->
    <input type="number" v-model="page.pageSize" @change=setPageSize() min="0" style="float; right" />

    <!-- Load Table -->
    <vuetable ref="vuetable" :api-mode="false" :fields="fields" :data="data" :css="css.table">

      <!-- Notes -->
      <template slot="notes" scope="props">
        <textarea type="text" auto-grow v-model="props.rowData.notes" placeholder="Notes..." @change="updateNotes(props.rowData)">
        </textarea>
      </template>
    </vuetable>>

    <!-- Custom Pagination -->
    <div class="pull-left">
      <button class="btn btn-primary" @click="prevPage">Previous</button>
      <input type="number" v-model="page.index" placeholder="0" min="0" @change="jumpToPage" style="float-left">
      <button class="btn btn-primary" @click="nextPage">Next</button>
    </div>
  </div>
</template>


<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';
import FieldDef from './fieldDefs';
import SemanticStyle from './semanticStyles';
import { store } from '@/store/store';

export default {
  name: 'Main',
  components: {
    Vuetable
  },
  data() {
    return {
      data: [],
      fields: FieldDef,
      css: SemanticStyle,
      page: {
        limit: 10,
        offset: 0,
        index: 0,
        pageSize: 10,
        tableSize: null
      }
    }
  },
  watch: {
    data() {
      this.$refs.vuetable.refresh();
    }
  },
  mounted() {
    store.state.socket.emit("getAllData", this.page);
    store.state.socket.emit("getDataSize");

    //Check if the row updated is in the current view and ask for an updated rows if it is
    store.state.socket.on("dataIdUpdated", data => {
      if(this.data.some(item => item.id === data)) {
        store.state.socket.emit("getAllData", this.page);
      }
    })

    //Listen for the latest data
    store.state.socket.on("allData", data => {
      this.data = data;
    })

    //Listen for table size
    store.state.socket.on("tableSize", data => {
      this.page.tableSize = data.count;
    })
  },
  methods: {
    nextPage() {
      this.page.index += 1;     //Increment page number
      if(this.page.index > this.page.tableSize) {
        this.page.index = this.page.tableSize;
      }
      //Offset is set to the the current page number * the number of elements shows on the current page, so you get shown rows you have not seen before
      //Limit is how many to get
      //So offset is the skip that many rows, and limit is how many to get
      this.page.offset = Number(this.page.index) * Number(this.page.pageSize);
      this.page.limit = Number(this.page.pageSize);
      store.state.socket.emit("getAllData", this.page);
    },
    prevPage() {
      this.page.index -= 1;     //Decrement page number
      if(this.page.index > this.page.tableSize) {
        this.page.index = this.page.tableSize;
      }
      //Offset is set to the the current page number * the number of elements shows on the current page, so you get shown rows you have not seen before
      //Limit is how many to get
      //So offset is the skip that many rows, and limit is how many to get
      this.page.offset = Number(this.page.index) * Number(this.page.pageSize);
      this.page.limit = Number(this.page.pageSize);
      store.state.socket.emit("getAllData", this.page);
    },
    jumpToPage() {
      if(this.page.index > this.page.tableSize) {
        this.page.index = this.page.tableSize;
      }
      //Offset is set to the the current page number * the number of elements shows on the current page, so you get shown rows you have not seen before
      //Limit is how many to get
      //So offset is the skip that many rows, and limit is how many to get
      this.page.offset = Number(this.page.index) * Number(this.page.pageSize);
      this.page.limit = Number(this.page.pageSize);
      store.state.socket.emit("getAllData", this.page);
    },
    setPageSize() {
      if(this.page.index < 0) this.page.index = 0;
      this.page.offset = Number(this.page.index) * Number(this.page.pageSize);
      this.page.limit = Number(this.page.pageSize);
      store.state.socket.emit("getAllData", this.page);
    },
    updateNotes(data) {
      store.state.socket.emit("updateNotes", data);
    }
  }
}
</script>