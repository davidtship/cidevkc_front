import React from 'react';
const Avatar = ({ type, className, status, size, colorSolid, colorSoft, shape, ...props }) => {
    const avatarClassName = `avatar ${className || ''} ${size ? `avatar-${size}` : ''} ${colorSolid ? `text-white bg-${colorSolid}` : ''} ${colorSoft ? `text-${colorSoft} bg-${colorSoft}-subtle` : ''} ${shape ? `rounded-${shape}` : ''}`;
    if (type === 'text') {
        const { text } = props;
        const initials = text
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase();
        return (<div className={avatarClassName}>
        {status}
        <div>{initials}</div>
      </div>);
    }
    else if (type === 'image') {
        const { src, alt, children: imageChildren } = props;
        return (<div className={avatarClassName}>
        {status}
        <img src={src} alt={alt || 'Avatar'} className={`img-fluid rounded-${shape}`}/>
        {imageChildren}
      </div>);
    }
    else {
        return null;
    }
};
export default Avatar;
