import React from "react";

const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?background=random";

const Avatar = ({ user }) => {
    const avatarUrl = user?.avatar || DEFAULT_AVATAR_URL;

    return (
        <img
            src={avatarUrl}
            alt={user.name}
            style={{
                width: 32,
                height: 32,
                objectFit: 'cover',
                borderRadius: '50%',
                marginRight: 8,
                verticalAlign: 'middle'
            }}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR_URL;
            }}
        />
    );
}

export default Avatar;