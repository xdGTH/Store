import { Typography, Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { StripeInput } from "./StripeInput";
import { StripeElementType } from "@stripe/stripe-js";

interface Props {
  cardState: {
    elementError: { [key in StripeElementType]?: string };
  };
  onCardInputChange: (event: any) => void;
}

export default function PaymentForm({ cardState, onCardInputChange }: Props) {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AppTextInput
            name="nameOnCard"
            label="Name on Card"
            control={control}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardNumber}
            helperText={cardState.elementError.cardNumber}
            //required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: CardNumberElement,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            //required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: CardExpiryElement,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            //required
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                inputComponent: StripeInput,
                inputProps: CardCvcElement,
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
