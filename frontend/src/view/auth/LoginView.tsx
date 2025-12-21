import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import Page from "../../components/Page";
import DividerWithText from "../../components/ui/divider/DividerWithText";
import { X } from "lucide-react";
import { useAuth } from "../../context/authContext";
import LoadingForms from "../../components/ui/loading/LoadingForms";

interface LoginFormInputs {
  email: string;
  password: string;
  tyc: boolean;
}

const schema: yup.ObjectSchema<LoginFormInputs> = yup.object().shape({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es un campo requerido"),

  password: yup
    .string()
    .required("La contraseña es un campo requerido")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  tyc: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones")
    .required("Debes aceptar los términos y condiciones"),
});

export default function LoginView() {
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", tyc: true },
  });

  const handleSubmitLogin: SubmitHandler<LoginFormInputs> = async (newData) => {
    await login(newData);
  };

  return (
    <Page title="Inicio de sesión">
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        {isLoading && <LoadingForms />}

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Typography
              color="primary"
              variant="button"
              align="center"
              sx={{ fontSize: 15, fontWeight: "bold" }}
            >
              INICIAR SESIÓN EN TU CUENTA
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(handleSubmitLogin)}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Email"
              margin="normal"
              type="email"
              // slotProps={{ InputLabelProps: { shrink: true } }}
              error={!!errors?.email}
              variant="outlined"
              {...register("email")}
              helperText={errors?.email?.message || ""}
            />

            <TextField
              fullWidth
              label="Contraseña"
              placeholder="********"
              margin="normal"
              type="password"
              error={!!errors?.password}
              variant="outlined"
              {...register("password")}
              helperText={errors?.password?.message || ""}
            />

            {error && error.message !== "" && !isLoading && (
              <Box>
                <Collapse in={!!error}>
                  <Alert
                    severity={error.type === "error" ? "error" : "info"}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        // onClick={handleClearError}
                      >
                        <X />
                      </IconButton>
                    }
                  >
                    {error.message}
                  </Alert>
                </Collapse>
              </Box>
            )}

            <Button
              disabled={isLoading}
              fullWidth
              color="primary"
              size="medium"
              variant="contained"
              type="submit"
              sx={{ my: 2 }}
            >
              Ingresar
            </Button>
          </form>

          <Box
            sx={{
              my: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Checkbox {...register("tyc")} defaultChecked sx={{ padding: 0 }} />
            <Typography
              variant="overline"
              color="secondary"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Acepto política de tratamiento de datos
            </Typography>
          </Box>

          <DividerWithText spacing={1}>
            <Typography
              variant="caption"
              color="secondary"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ¿Aun no tiene una cuenta?
            </Typography>
          </DividerWithText>
        </Box>
      </Paper>
    </Page>
  );
}
