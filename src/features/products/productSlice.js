import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

// ── Cache: avoid re-fetching if products already loaded ──────────────────────
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { getState, rejectWithValue }) => {
    const existing = getState().products.products;
    if (existing.length > 0) return existing; // ← cache hit, no network request
    try {
      // Fetch 100 (not 200) – 200 items doubles parse time with no visible benefit
      const res = await axiosInstance.get("/products?limit=100");
      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "products/getSingleProduct",
  async (id, { getState, rejectWithValue }) => {
    // If we already have all products, pick from cache
    const cached = getState().products.products.find((p) => p.id === Number(id));
    if (cached) return cached;
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const initialState = {
  products: [],
  singleProduct: null,
  loading: false,
  singleLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSingleProduct(state) { state.singleProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending,   (state) => { state.loading = true; })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected,  (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleProduct.pending,   (state) => { state.singleLoading = true; })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleProduct = action.payload;
      })
      .addCase(getSingleProduct.rejected,  (state, action) => {
        state.singleLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleProduct } = productSlice.actions;
export default productSlice.reducer;
