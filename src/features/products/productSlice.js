import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { getSellerProducts, SELLER_ID_BASE } from "../../utils/sellerStore";

function withSellerProducts(apiProducts) {
  const dummyOnly = apiProducts.filter((p) => p.id < SELLER_ID_BASE);
  return [...getSellerProducts(), ...dummyOnly];
}

// ── Cache: avoid re-fetching if products already loaded ──────────────────────
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { getState, rejectWithValue }) => {
    const existing = getState().products.products;
    if (existing.length > 0) return withSellerProducts(existing); // cache hit — re-merge in case seller products changed
    try {
      // Fetch 100 (not 200) – 200 items doubles parse time with no visible benefit
      const res = await axiosInstance.get("/products?limit=100");
      return withSellerProducts(res.data.products);
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

    addLocalProduct(state, action) {
      state.products = [action.payload, ...state.products];
    },
    removeLocalProduct(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
 
    updateLocalProduct(state, action) {
      const { id, patch } = action.payload;
      state.products = state.products.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      );
      if (state.singleProduct?.id === id) {
        state.singleProduct = { ...state.singleProduct, ...patch };
      }
    },
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

export const { clearSingleProduct, addLocalProduct, removeLocalProduct, updateLocalProduct } = productSlice.actions;
export default productSlice.reducer;
