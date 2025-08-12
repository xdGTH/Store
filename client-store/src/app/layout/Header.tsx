import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
  mode: boolean;
  toggleMode: () => void;
}

export default function Header({ mode, toggleMode }: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4, bgcolor: "primary.main" }}>
      <Toolbar sx={{ gap: "25px" }}>
        <Typography variant="h6">Store</Typography>
        <Switch onChange={toggleMode} color="primary" checked={mode} />
      </Toolbar>
    </AppBar>
  );
}
