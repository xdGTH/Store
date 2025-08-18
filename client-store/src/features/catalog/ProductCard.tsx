import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/Util";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { setBasket } = useStoreContext();

  function handleAddItem(productId: number) {
    setLoading(true);
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.light" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        slotProps={{
          title: { sx: { fontWeight: "bold", color: "" } },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "background.paper",
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secondary.light" variant="h5">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          loading={loading}
          onClick={() => handleAddItem(product.id)}
        >
          Add to cart
        </Button>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
