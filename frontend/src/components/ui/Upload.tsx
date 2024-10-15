// Upload.tsx
import React from 'react';

interface UploadProps {
  onChange: (url: string) => void;
  placeholder?: string;
  value?: string;
}

export const Upload: React.FC<UploadProps> = ({ onChange, placeholder, value }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string); // Update with the actual URL after uploading to your server
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        className="border rounded p-2"
      />
      {value && <img src={value} alt="Product" className="h-16 mt-2" />}
    </div>
  );
};
