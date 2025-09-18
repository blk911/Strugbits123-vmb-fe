import profile from '../../../assets/dashboard/profile.jpg'
import cameraIcon from '../dashboard/icons/camera.svg'

function ProfileAvatar({ children, title, name, status }) {
    return (

        <div className='w-full flex flex-col gap-y-[20px]'>
            <span
                className="max-xl:text-[18px] text-[#581838] xl:text-[20px] max-xl:leading-[20px]"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                }}
            >
                {title}
            </span>
            <div className='w-full flex gap-x-[20px] items-center'>
                <div className='h-[80px] w-[80px] relative'>
                    <div className='rounded-full h-full w-full overflow-hidden'>
                        <img src={profile} alt="" />
                    </div>
                    <div className='rounded-full absolute bottom-0 right-0 h-[32px] w-[32px] bg-[#FF92A5] flex justify-center items-center'>
                        <img src={cameraIcon} alt="Camera" />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span
                        className="max-xl:text-[16px] text-[#581838] xl:text-[18px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        {name}
                    </span>
                    <span
                        className="max-xl:text-[16px] text-[#737373] xl:text-[18px] max-xl:leading-[20px]"
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

    )
}

export default ProfileAvatar