import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Hero = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.userData);

    if (currentUser.id) {
        return (
            <div className="flex-col text-center">
                <h1 className="text-3xl m-2">Welcome back, {currentUser.id}!</h1> {/* TODO: modify API to return first name */}
                <p className="text-sm m-1">Your playlists are just a click away.</p>
            </div>
        );
    }

    return (
        <div className="flex-col text-center">
            <h1 className="text-3xl m-2">Welcome to The Enchiridion</h1>
            <p className="text-sm m-1"><a className="underline cursor-pointer" onClick={() => navigate("/login")}>Sign in</a> or <a className="underline cursor-pointer" onClick={() => navigate("/register")}>Register</a> to make your own personalized TV playlists.</p>
        </div>
    );
};