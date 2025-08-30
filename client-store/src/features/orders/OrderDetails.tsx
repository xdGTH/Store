import { Box, Button, Grid, Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import BasketSummary from "../basket/BasketSummary";

interface Props {
  order: Order;
  setSelectedOrder: (id: number) => void;
}

export default function OrderDetails({ order, setSelectedOrder }: Props) {
  const subTotal =
    order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {order.id} = {order.orderStatus}
        </Typography>
        <Button
          onClick={() => setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <Grid container>
        <Grid size={{ xs: 6 }} />
        <Grid size={{ xs: 6 }}>
          <BasketSummary subTotal={subTotal} />
        </Grid>
      </Grid>
    </>
  );
}
