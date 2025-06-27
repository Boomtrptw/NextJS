import Swal from "sweetalert2";

export const showAlertError = (
  icon: "success" | "error" | "warning" | "info",
  title: string,
  text: string
) => {
  return Swal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#3085d6",
    background: "#f7fafc",
  });
};
