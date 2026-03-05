import { useState, useRef } from "react";
import profile from "../../../assets/dashboard/profile.jpg";
import cameraIcon from "../dashboard/icons/camera.svg";

function ProfileAvatar({
  children,
  title = "",
  name = "",
  status = "",
  profileClass,
  nameClass,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(profile);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      if (onChange) onChange(file); // send file to parent
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-[20px]">
      <span
        className="max-xl:text-[18px] text-vmb-primary xl:text-[20px] max-xl:leading-[20px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
        }}
      >
        {title}
      </span>
      <div className="w-full flex gap-x-[20px] items-center">
        <div
          className={`h-[80px] w-[80px] relative cursor-pointer`}
          onClick={() => fileInputRef.current.click()}
        >
          <div
            className={`rounded-full h-full w-full overflow-hidden ${profileClass}`}
          >
            <img src={profile} alt="" />
          </div>
          <div className="rounded-full absolute bottom-0 right-0 h-[32px] w-[32px] bg-vmb-secondary flex justify-center items-center">
            <img src={cameraIcon} alt="Camera" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="flex flex-col">
          <span
            className={`max-xl:text-[16px] text-vmb-primary xl:text-[18px] max-xl:leading-[20px] ${nameClass}`}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {name}
          </span>
          <span
            className="max-xl:text-[16px] text-vmb-text-muted xl:text-[18px] max-xl:leading-[20px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            {status}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default ProfileAvatar;
