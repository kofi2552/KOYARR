import axios from "axios";

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dwmhusa2");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/loyke/upload",
      formData
    );

    // const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, formData);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;
