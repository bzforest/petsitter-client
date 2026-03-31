import { ref } from "vue";

const message = ref("");
const type = ref<"success" | "error">("success");
const visible = ref(false);

export const useToast = () => {
  const showToast = (msg: string, t: "success" | "error" = "success") => {
    message.value = msg;
    type.value = t;
    visible.value = true;

    setTimeout(() => {
      visible.value = false;
    }, 3000);
  };

  return {
    message,
    type,
    visible,
    showToast,
  };
};