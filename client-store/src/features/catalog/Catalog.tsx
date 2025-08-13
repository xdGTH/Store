import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.list()
      .then((products) => setProducts(products))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading products..." />;

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
