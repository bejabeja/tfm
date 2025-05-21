import { Toaster } from "react-hot-toast";
import "./CustomToaster.scss";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          display: "flex",
          alignItems: "center",
          gap: "0px",
          fontWeight: 600,
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "15px",
          width: "fit-content",
        },
        success: {
          icon: "✅",
          style: {
            width: "fit-content",
          },
        },
        error: {
          icon: "❌",
          style: {
            width: "fit-content",
          },
        },
        loading: {
          icon: null,
        },
      }}
    />
  );
};

export default CustomToaster;
