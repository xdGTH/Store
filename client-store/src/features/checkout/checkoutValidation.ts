import * as yup from "yup";

export const validationSchema = [
  //AddressFrom validation Schema
  yup.object({
    fullName: yup.string().required("Full name is required"),
    address1: yup.string().required("Address line 1 is required"),
    address2: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    country: yup.string().required(),
  }),
  //Review validation Schema
  yup.object(),
  //PaymentForm validation Schema
  yup.object({
    nameOnCard: yup.string().required(),
  }),
];
