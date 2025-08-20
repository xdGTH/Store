import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  if (status.includes("pending"))
    return <LoadingComponent message="Loading products..." />;

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
    <>
      <ProductList products={products} />
    </>
  );
}
