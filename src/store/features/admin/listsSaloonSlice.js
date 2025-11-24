import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [
    {
      id: 1,
      ownerName: "Juan Elite",
      salonName: "Glam Studio",
      phone: "+123-456-78900",
      email: "elitejuan@gmail.com",
      address: "New York",
      status: "Active",
      actions: true,
    },
    {
      id: 2,
      ownerName: "Maria Style",
      salonName: "Beauty Hub",
      phone: "+321-456-78900",
      email: "maria@gmail.com",
      address: "Los Angeles",
      status: "Suspended",
      actions: true,
    },
  ],
  filteredData: [],
  searchQuery: "",
};

const saloonsSlice = createSlice({
  name: "saloons",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;

      const query = action.payload.toLowerCase();

      state.filteredData = state.data.filter(
        (item) =>
          item.ownerName.toLowerCase().includes(query) ||
          item.salonName.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
      );
    },
    resetSearch: (state) => {
      state.searchQuery = "";
      state.filteredData = [];
    },
  },
});

export const { setSearchQuery, resetSearch } = saloonsSlice.actions;

export default saloonsSlice.reducer;
