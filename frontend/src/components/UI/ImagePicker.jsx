import { useEffect, useState } from "react";
import { Image, Upload } from "lucide-react";

const ImagePicker = ({ imageUrl, imageFile, onChange, label = "Image" }) => {
  const [type, setType] = useState(imageUrl ? "url" : "file");

  useEffect(() => {
    if (imageUrl) {
      setType("url");
    }
  }, [imageUrl]);

  const handleUrlChange = (value) => {
    onChange({ imageUrl: value, imageFile: null });
  };

  const handleFileChange = (file) => {
    onChange({ imageFile: file, imageUrl: "" });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {/* Toggle Buttons */}
      <div
        className="flex bg-white p-1 rounded-xl 
      shadow-sm border border-gray-100 
      dark:bg-slate-700 dark:border-gray-500
       w-fit"
      >
        <button
          type="button"
          onClick={() => {
            setType("url");
            handleFileChange(null);
          }}
          className={`px-4 py-1.5 rounded-lg 
                text-[0.8rem] 
            font-black transition-all 
             ${
               type === "url"
                 ? "bg-orange-600 text-white"
                 : "text-gray-400 hover:text-gray-600"
             }`}
        >
          URL
        </button>

        <button
          type="button"
          onClick={() => {
            setType("file");
            handleUrlChange("");
          }}
          className={`px-4 py-1.5 rounded-lg text-[0.8rem] 
            font-black transition-all
              ${
                type === "file"
                  ? "bg-orange-600 text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
        >
          Upload
        </button>
      </div>

      <div className="flex flex-items-center gap-4">
        <div className="h-12 rounded-xl flex-1 ">
          {/* URL Input */}
          {type === "url" && (
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full h-full bg-gray-50 dark:bg-slate-800
            rounded-xl px-4 py-2
            border border-gray-200 dark:border-gray-700
            focus:ring-2 focus:ring-orange-500 outline-none"
            />
          )}

          {/* File Input */}
          {type === "file" && (
            <label
              className="flex items-center justify-center gap-2
          w-full h-full border-2 
          border-dashed rounded-lg cursor-pointer 
          bg-gray-50 dark:bg-slate-800 
          hover:bg-orange-100
          hover:border-orange-500"
            >
              <Upload /> <span>Select File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </label>
          )}
        </div>
        {/* Preview */}
        <div
          className="w-12 h-12 bg-gray-100 dark:bg-slate-800 
        rounded-lg flex items-center justify-center overflow-hidden"
        >
          {imageUrl || imageFile ? (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border"
            />
          ) : (
            <Image className="flex items-center justify-center" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
