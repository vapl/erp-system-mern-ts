import React from "react";

interface UserProfileImageProps {
    imageName?: string,
    alt?: string,
    className?: string,
}

const UserProfileImage: React.FC<UserProfileImageProps> = ({ 
    imageName, 
    alt='User', 
    className='h-full w-full object-cover rounded-full' 
}) => {
    if (!imageName) {
        return <div>NO IMAGE</div>
    }

    const userProfileImagePath = `http://localhost:5000/uploads/profile-images/${imageName}`;

    return (
        <img src={userProfileImagePath} alt={alt} className={className}/>
    );
}

export default UserProfileImage;