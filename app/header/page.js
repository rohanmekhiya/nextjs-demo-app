"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function header() {
    const { data: session, status } = useSession();

    function logout() {
        signOut();
    }
    return (
        <>
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </Link>
                    </div>
                    <div className="flex justify-center gap-[50px]">
                        {session ? <Link href="/products" className="text-sm font-semibold leading-6 text-gray-900">Products</Link> : <p></p>}
                        {session ? <Link href="/report" className="text-sm font-semibold leading-6 text-gray-900">Report</Link> : <p></p>}
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>

                        </button>
                    </div>
                    <div className="font-bold hidden lg:flex lg:gap-x-12">

                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                        {session ? <button onClick={logout} className="text-sm font-semibold leading-6 text-gray-900">Log out</button> : <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                            Log in
                        </Link>}

                        {session ? <p></p> : <Link href="/register" className="text-sm font-semibold leading-6 text-gray-900">
                            Register
                        </Link>}
                    </div>
                </nav>
            </header>
        </>
    );

}

export default header;
