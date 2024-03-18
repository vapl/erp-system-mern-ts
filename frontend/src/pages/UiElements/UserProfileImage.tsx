import { useContext } from "react";
import AuthContext from "../../components/Routes/AuthContext";

const UserProfileImage = () => {
    const { user } = useContext(AuthContext);
    const userProfileImagePath = `http://localhost:5000/uploads/${user?.profile_image}`;

    return (
        <img src={userProfileImagePath} alt="User" className='h-full w-full object-cover rounded-full'/>
    );
}

export default UserProfileImage;