import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  linkName: string;
  imgUrl?: string;
  altText?: string;
  link: string;
}

const NavLinkMain = (props: NavLinkProps) => {
  return (
    <Link to={props.link}>
      <div className="flex items-center rounded bg-emerald-600 px-4 py-1 font-bold">
        {props.imgUrl && (
          <img className="w-8" src={props.imgUrl} alt={props.altText} />
        )}
        <h2 className="text-xl">{props.linkName}</h2>
      </div>
    </Link>
  );
};

export default NavLinkMain;
