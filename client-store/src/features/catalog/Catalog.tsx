import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchProductFiltersAsync,
  fetchProductsAsync,
  productSelectors,
  setPageNumer,
  setProductParams,
} from "./catalogSlice";
import ProductList from "./ProductList";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - Hight to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const {
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchProductFiltersAsync());
  }, [filtersLoaded, dispatch]);

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  //   function addProducts() {
  //     setProducts((prevState) => [
  //       ...products,
  //       {
  //         id: prevState.length + 101,
  //         name: "product" + (prevState.length + 1),
  //         price: prevState.length * 100 + 100,
  //         brand: "some brand",
  //         description: "some description",
  //         pictureUrl: "http://picsum.photos/200",
  //         quantityInStock: 2,
  //       },
  //     ]);
  //   }
  return (
    <Grid container columnSpacing={4}>
      <Grid size={{ xs: 3 }}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(e) =>
              dispatch(setProductParams({ orderBy: e.target.value }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ brands: items }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ types: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 9 }}>
        <ProductList products={products} />
      </Grid>
      <Grid size={{ xs: 3 }} />
      <Grid size={{ xs: 9 }} sx={{ mb: 2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumer({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
