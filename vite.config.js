import url from "@rollup/plugin-url";
import vue from "@vitejs/plugin-vue";
import files from "rollup-plugin-import-file";

export default {
  plugins: [vue()],
  build: {
    rollupOptions: {
      plugins: [],
    },
  },
};
