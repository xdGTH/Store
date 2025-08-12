import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

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
